#!/usr/bin/env python3
"""
scripts/seed_sanity_team.py
Autonomous migration & seeding script for HACK Executive Board members into Sanity Content Lake.

- Uploads/syncs 2026 Executive Panel documents with the 'teamMember' type.
- References existing Sanity image assets via 'src/data/sanity-assets.json'.
- PRIVACY GUARD: Strips out private personal identification info (e.g. student roll numbers).
- Auto-initials: Relies on frontend algorithmic monogram generation (e.g. Tasmir Hossain Zihad -> TZ).

NOTE ON HISTORICAL PANELS:
We will later support keeping and archiving previous executive panels (e.g. 2025, 2024 alumni panels).
Currently only the active 2026 panel is seeded and displayed.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CLUB_TS = ROOT / "src" / "data" / "club.ts"
ASSETS_JSON = ROOT / "src" / "data" / "sanity-assets.json"
ENV_FILE = ROOT / ".env"

def load_env() -> dict[str, str]:
    env = {}
    if ENV_FILE.exists():
        with open(ENV_FILE, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, v = line.split("=", 1)
                    env[k.strip()] = v.strip().strip("'\"")
    return env

def parse_members_from_club_ts() -> list[dict]:
    with open(CLUB_TS, "r", encoding="utf-8") as f:
        content = f.read()

    # Match member objects in the team array
    pattern = re.compile(r"\{\s*id:\s*'([^']+)',\s*name:\s*'([^']+)'(.*?)\}", re.DOTALL)
    matches = pattern.findall(content)

    members = []
    for mid, name, rest in matches:
        # Extract fields
        title_m = re.search(r"title:\s*'([^']+)'", rest)
        dept_m = re.search(r"department:\s*'([^']+)'", rest)
        desig_m = re.search(r"designation:\s*'([^']+)'", rest)
        batch_m = re.search(r"batch:\s*'([^']+)'", rest)
        seed_m = re.search(r"seed:\s*(\d+)", rest)
        hue_m = re.search(r"hue:\s*(?:hues\[\d+\]|'([^']+)')", rest)
        img_m = re.search(r"image:\s*'([^']+)'", rest)

        # Handle hue indexing
        hues = ["navy", "blue", "cyan", "sky"]
        hue = "navy"
        if "hues[" in rest:
            idx = int(re.search(r"hues\[(\d+)\]", rest).group(1))
            hue = hues[idx % len(hues)]
        elif hue_m and hue_m.group(1):
            hue = hue_m.group(1)

        doc = {
            "id": mid,
            "name": name,
            "title": title_m.group(1) if title_m else "",
            "seed": int(seed_m.group(1)) if seed_m else 300,
            "hue": hue,
        }
        if dept_m:
            doc["department"] = dept_m.group(1)
        if desig_m:
            doc["designation"] = desig_m.group(1)
        if batch_m:
            doc["batch"] = batch_m.group(1)
        if img_m:
            doc["imageUrl"] = img_m.group(1)

        # PRIVACY GUARANTEE: Roll numbers and private data are deliberately NOT extracted or uploaded.
        members.append(doc)

    return members

def main():
    env = load_env()
    token = env.get("SANITY_TOKEN")
    project_id = env.get("SANITY_PROJECT_ID", "xcn3cj7z")
    dataset = env.get("SANITY_DATASET", "production")

    if not token:
        print("[ERROR] SANITY_TOKEN is required in .env", file=sys.stderr)
        sys.exit(1)

    with open(ASSETS_JSON, "r", encoding="utf-8") as f:
        asset_map = json.load(f)

    # Build reverse map: url -> asset_id
    url_to_asset_id = {v["url"]: v["id"] for v in asset_map.values()}

    members = parse_members_from_club_ts()
    print(f"[*] Parsed {len(members)} executive board members from club.ts")

    mutations = []
    for idx, m in enumerate(members):
        doc_id = f"teamMember-2026-{m['id']}"
        order_rank = f"{idx:04d}"

        sanity_doc = {
            "_id": doc_id,
            "_type": "teamMember",
            "name": m["name"],
            "title": m["title"],
            "panel": "2026",  # Tagged for 2026; historical panels (2025, 2024) can be added in future
            "seed": m["seed"],
            "hue": m["hue"],
            "orderRank": order_rank,
        }

        if "department" in m:
            sanity_doc["department"] = m["department"]
        if "designation" in m:
            sanity_doc["designation"] = m["designation"]
        if "batch" in m:
            sanity_doc["batch"] = m["batch"]

        # Link image asset if present
        if "imageUrl" in m:
            asset_id = url_to_asset_id.get(m["imageUrl"])
            if not asset_id:
                # Deduce asset id from URL structure
                match = re.search(r"([a-f0-9]{40}-\d+x\d+\.\w+)$", m["imageUrl"])
                if match:
                    asset_id = f"image-{match.group(1).replace('.', '-')}"
            if asset_id:
                sanity_doc["image"] = {
                    "_type": "image",
                    "asset": {
                        "_type": "reference",
                        "_ref": asset_id,
                    },
                }

        mutations.append({"createOrReplace": sanity_doc})

    print(f"[*] Submitting {len(mutations)} document mutations to Sanity...")
    mutate_url = f"https://{project_id}.api.sanity.io/v2024-01-01/data/mutate/{dataset}"
    payload = json.dumps({"mutations": mutations}).encode("utf-8")

    req = urllib.request.Request(
        mutate_url,
        data=payload,
        headers={
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.urlopen(req) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        print(f"[SUCCESS] Synced {len(result.get('results', []))} executive members into Sanity!")
        print(f"          Transaction ID: {result.get('transactionId')}")

if __name__ == "__main__":
    main()
