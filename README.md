# HACK — Hardware Acceleration Club of KUET

Website of HACK (Hardware Acceleration Club of KUET): a statically exported Next.js
site whose content lives entirely in Sanity. This repository contains code only —
everything visitors read (text, photos, registration options) is edited in the
Studio and fetched at build time.

## How it works

- **Site** — Next.js App Router, exported to static HTML (`output: 'export'`), deployed to GitHub Pages by `.github/workflows/deploy.yml`.
- **Content** — Sanity Studio v6 lives in `studio/` and is hosted at **https://hack-kuet.sanity.studio**.
- **Publishing loop** — an editor publishes in the Studio → Sanity fires a webhook → GitHub Actions rebuilds and redeploys (~2 minutes).

## Editing content

1. Open https://hack-kuet.sanity.studio and sign in.
2. Edit:
   - **Site settings** — name, tagline, contact details, intake dates, keywords.
   - **Home story** — history, mission, vision.
   - **Hero slides / Projects / Achievements / Gallery / Executive board / Events** — the six content lists; drag to reorder where handles appear.
   - **Registration options** — departments, batches and tracks offered in the join form.
   - **Navigation** — the words used for each page in the header and footer.
3. Click **Publish**. The live site rebuilds automatically; changes appear within a few minutes.

Notes:

- Track **IDs** (in Registration options) are stored inside member passes — rename the visible titles freely, but do not change the IDs.
- Pages and their addresses (`/projects`, `/events`, …) are fixed in code; the Studio changes their words and content, never the page structure.

## Development

Requirements: Node 20+.

```bash
npm install
cp .env.example .env.local   # then fill in the Sanity project ID
npm run dev                  # site at http://localhost:3000
npm run typecheck
npm run build                # static export into out/
```

Environment variables (both are public values, no secrets):

| Variable | Where to set |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `.env.local` (development), repository Actions *Variables* (CI) |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |

The build fails loudly if a required singleton document (Site settings, Home story,
Registration options) is missing; the error names the document to create.

### Studio

```bash
npm run studio          # Studio at http://localhost:3333
npm run studio:deploy   # deploy the Studio to hack-kuet.sanity.studio
```

Studio source lives in `studio/` (its own package.json; not part of the site build).

### Deploy

Pushing to `main` deploys the site. Content publishes deploy via the Sanity webhook
(`repository_dispatch` event `sanity-publish`).
