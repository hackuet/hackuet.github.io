#!/usr/bin/env python3
"""
scripts/upload_to_sanity.py — Autonomous Sanity.io Media & Asset Uploader.
Uploads images and media assets to Sanity Content Lake, checks local mapping
in `src/data/sanity-assets.json` to prevent duplicates, and atomically updates
the canonical mapping with CDN URLs and asset IDs.
"""

import os
import sys
import json
import hashlib
import argparse
import mimetypes
from pathlib import Path
import urllib.request
import urllib.parse
import urllib.error
from concurrent.futures import ThreadPoolExecutor, as_completed

REPO_ROOT = Path(__file__).resolve().parent.parent
MAPPING_FILE = REPO_ROOT / 'src' / 'data' / 'sanity-assets.json'

def get_env_val(key, default=None):
    val = os.getenv(key)
    if val:
        return val
    # Search local repo .env files then home dir .env
    candidates = [
        REPO_ROOT / '.env',
        REPO_ROOT / '.env.local',
        Path.home() / '.env'
    ]
    for env_path in candidates:
        if env_path.is_file():
            with open(env_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line.startswith(f"{key}="):
                        return line.split('=', 1)[1].strip().strip('"').strip("'")
    return default

PROJECT_ID = get_env_val('SANITY_PROJECT_ID', 'ky8bcwum')
DATASET = get_env_val('SANITY_DATASET', 'production')
TOKEN = get_env_val('SANITY_TOKEN')
API_VERSION = get_env_val('SANITY_API_VERSION', 'v2024-01-01')

def compute_sha1(file_path: Path) -> str:
    hasher = hashlib.sha1()
    with open(file_path, 'rb') as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def load_mapping() -> dict:
    if MAPPING_FILE.is_file():
        try:
            with open(MAPPING_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_mapping(mapping: dict):
    MAPPING_FILE.parent.mkdir(parents=True, exist_ok=True)
    with open(MAPPING_FILE, 'w', encoding='utf-8') as f:
        json.dump(mapping, f, indent=2, sort_keys=True)

def upload_image_to_sanity(file_path: str, filename: str = None, force: bool = False, mapping: dict = None):
    path = Path(file_path)
    if not path.is_file():
        print(f"[Error] File not found: {file_path}", file=sys.stderr)
        return None

    name = filename or path.name
    sha1 = compute_sha1(path)
    file_size = path.stat().st_size

    # Deduplication check against local mapping
    if mapping is None:
        mapping = load_mapping()

    if not force:
        # Check by filename or SHA-1
        existing = mapping.get(name)
        if not existing:
            for item in mapping.values():
                if isinstance(item, dict) and item.get('sha1') == sha1:
                    existing = item
                    break
        if existing and existing.get('url'):
            print(f"[=] Already in Sanity ({name} -> {existing['url']})")
            return existing

    if not TOKEN:
        print("[Error] SANITY_TOKEN is required to upload assets to Sanity.", file=sys.stderr)
        print("Set SANITY_TOKEN in .env or ~/.env file.", file=sys.stderr)
        return None

    mime_type, _ = mimetypes.guess_type(str(path))
    if not mime_type:
        mime_type = 'image/webp' if path.suffix.lower() == '.webp' else 'application/octet-stream'

    url = f"https://{PROJECT_ID}.api.sanity.io/{API_VERSION}/assets/images/{DATASET}?filename={urllib.parse.quote(name)}"

    with open(path, 'rb') as f:
        data = f.read()

    req = urllib.request.Request(url, data=data, method='POST')
    req.add_header('Authorization', f"Bearer {TOKEN}")
    req.add_header('Content-Type', mime_type)

    try:
        with urllib.request.urlopen(req) as resp:
            res_body = resp.read().decode('utf-8')
            res = json.loads(res_body)
            document = res.get('document', {})
            asset_id = document.get('_id')
            asset_url = document.get('url')

            record = {
                'id': asset_id,
                'url': asset_url,
                'originalFilename': name,
                'size': file_size,
                'sha1': sha1
            }

            mapping[name] = record
            save_mapping(mapping)

            print(f"[✓] Uploaded {name} to Sanity:")
            print(f"    Asset ID : {asset_id}")
            print(f"    CDN URL  : {asset_url}")
            return record
    except urllib.error.HTTPError as e:
        err_msg = e.read().decode('utf-8')
        print(f"[✗] Sanity upload failed ({e.code}): {err_msg}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"[✗] Error uploading {name}: {e}", file=sys.stderr)
        return None

def upload_directory_to_sanity(dir_path: str, manifest_path: str = None, workers: int = 6, force: bool = False):
    p = Path(dir_path)
    if not p.is_dir():
        print(f"[Error] Directory not found: {dir_path}", file=sys.stderr)
        return {}

    exts = {'.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'}
    files = sorted([f for f in p.rglob('*') if f.suffix.lower() in exts])

    if not files:
        print(f"No image files found in {dir_path}")
        return {}

    mapping = load_mapping()
    print(f"Checking {len(files)} asset(s) in {dir_path} with {workers} workers...")
    results = {}

    def _worker(f):
        rel = str(f.relative_to(p))
        rec = upload_image_to_sanity(str(f), filename=f.name, force=force, mapping=mapping)
        return rel, rec

    with ThreadPoolExecutor(max_workers=workers) as executor:
        futures = {executor.submit(_worker, f): f for f in files}
        for future in as_completed(futures):
            rel, rec = future.result()
            if rec:
                results[rel] = rec

    save_mapping(mapping)

    if manifest_path:
        out_p = Path(manifest_path)
        out_p.parent.mkdir(parents=True, exist_ok=True)
        with open(out_p, 'w', encoding='utf-8') as out:
            json.dump(results, out, indent=2, sort_keys=True)
        print(f"Custom manifest saved to {manifest_path}")

    print(f"Finished processing. Total mapped assets in {MAPPING_FILE}: {len(mapping)}")
    return results

def main():
    parser = argparse.ArgumentParser(description="Upload images to Sanity.io Content Lake with deduplication.")
    parser.add_argument("path", help="Path to image file or directory of images")
    parser.add_argument("--filename", help="Optional override for asset filename in Sanity")
    parser.add_argument("--manifest", help="Optional output JSON manifest path when uploading a directory")
    parser.add_argument("--force", action="store_true", help="Force upload even if asset is already mapped")
    parser.add_argument("--workers", type=int, default=6, help="Number of concurrent workers for directory uploads")

    args = parser.parse_args()
    target = Path(args.path)

    if target.is_file():
        upload_image_to_sanity(str(target), filename=args.filename, force=args.force)
    elif target.is_dir():
        upload_directory_to_sanity(str(target), manifest_path=args.manifest, workers=args.workers, force=args.force)
    else:
        print(f"[Error] Path not found: {args.path}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
