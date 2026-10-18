---
name: sanity-media-uploader
description: Autonomous protocol and CLI tooling for uploading media, executive board member portraits, workshop graphics, and event photography to Sanity.io Content Lake. Maintains local JSON asset mapping in src/data/sanity-assets.json to avoid duplicate uploads.
---

# Autonomous Skill: Sanity Media & Asset Uploader

This skill provides autonomous AI coding agents and developers with the protocol and tooling to upload assets directly to **Sanity.io Content Lake** (`https://<projectId>.api.sanity.io/v2024-01-01/assets/images/<dataset>`).

---

## 1. Directives & Git Hygiene

1. **Keep Raw Assets Gitignored**:
   - Heavy raw image files (`assets/pics/`, `assets/raw-team/`) must **never** be committed to the static web repository. They are listed in `.gitignore`.
2. **Canonical Asset Mapping**:
   - Every uploaded image is recorded with its SHA-1 hash, asset ID, and CDN URL in `src/data/sanity-assets.json`.
   - The script automatically skips files that are already uploaded to avoid redundant requests and prevent duplicate asset creation.
3. **Sanity Studio Isolation**:
   - `studio-hackuet/` lives as a standalone project outside or gitignored in the repo so it is not bundled into GitHub Pages.
4. **Environment Credentials**:
   - Read from `.env`, `.env.local`, or `~/.env`:
     - `SANITY_PROJECT_ID=xcn3cj7z`
     - `SANITY_DATASET=production`
     - `SANITY_TOKEN=<Sanity Editor/Admin Write Token>`

---

## 2. CLI Usage

### Check or Upload a Single Image
```bash
python3 scripts/upload_to_sanity.py path/to/portrait.webp
```

### Batch Upload a Directory (Skips existing duplicates)
```bash
python3 scripts/upload_to_sanity.py assets/raw-team/
```

### Force Re-upload (Bypass duplicate check)
```bash
python3 scripts/upload_to_sanity.py path/to/image.webp --force
```

---

## 3. Sanity Model Context Protocol (MCP)

The Sanity MCP server is configured in `~/.gemini/antigravity/mcp_config.json`:
```json
{
  "mcpServers": {
    "sanity": {
      "command": "npx",
      "args": ["-y", "@sanity/mcp-server"],
      "env": {
        "SANITY_PROJECT_ID": "xcn3cj7z",
        "SANITY_DATASET": "production"
      }
    }
  }
}
```
