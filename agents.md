# AGENTS.md — Development & Agent Guidelines for HACK Website

This file provides architectural context, development conventions, and operational instructions for AI agents and automated coding assistants working on the `hackuet.github.io` repository.

---

## 1. Project Mission & Identity

- **Project:** Official website for **Hardware Acceleration Club of KUET (HACK)**.
- **Identity:** High-performance, clean, hardware-aesthetic web design reflecting digital logic, silicon design, FPGAs, and low-level computer architecture.
- **Key Tenet:** Single source of truth. Dynamic content and club data are centralized in TypeScript data modules without a database backend.

---

## 2. Core Architecture & Tech Stack

- **Framework:** Next.js (App Router) configured strictly with **static export** (`output: 'export'`, `trailingSlash: true`, `images: { unoptimized: true }`).
- **No Node.js Server:** Any feature requiring backend persistence must either:
  1. Use client-side storage (`localStorage` / `sessionStorage`) with resilient fallbacks, or
  2. Integrate external static services/APIs without breaking `next build`.
- **Typing:** Strict TypeScript (`tsc --noEmit`). No unchecked `any` or loose types.
- **Styling Architecture:** Pure modular CSS utilizing CSS Custom Properties (`src/styles/tokens.css`, `base.css`, `components.css`, `pages.css`). No Tailwind, no CSS-in-JS.
- **Fonts:** Next.js Font Optimization (`Bricolage_Grotesque`, `Instrument_Sans`, `JetBrains_Mono`).
- **Post-Export Processing:** `scripts/postexport.mjs` runs after `next build` to normalize dotted prefetch route files for static hosts like GitHub Pages.

---

## 3. Directory Layout & Roles

| Directory / File | Description | Guidelines |
|---|---|---|
| `src/data/club.ts` | **Central Data Store** | Contains all text, committee lists, events, achievements, slides, and club info. Always modify this file instead of hardcoding text into page components. |
| `src/app/` | Routes & App Router | Pages should remain minimal wrappers around data imports and components. |
| `src/components/` | Reusable React UI | Functional components. Generative visual components (e.g. `DieArt.tsx`, `CircuitBackground.tsx`) use canvas or SVG primitives. |
| `src/lib/` | Pure utilities | `seo.ts` (JSON-LD & metadata), `registration.ts` (client validation), `site.ts` (URL config). Keep side-effect free. |
| `src/styles/` | Global & component CSS | Update `tokens.css` for palette adjustments; ensure dark/contrast harmony with chip aesthetics. |
| `scripts/postexport.mjs` | Build automation | Do not remove; ensures client prefetch works on GitHub Pages without rewrite rules. |

---

## 4. Key Conventions for Agents

### 4.1. Single Source of Truth
- When updating club details, executive members, events, or copy, modify `src/data/club.ts`.
- Ensure data structures export matching TypeScript types (e.g., `Member`, `ClubEvent`, `Achievement`, `Slide`).
- Keep `src/app/llms.txt/route.ts` synchronized whenever data models in `club.ts` are restructured.

### 4.2. Handling Static Export Constraints
- Do **not** use Next.js dynamic server features:
  - No `cookies()`, `headers()`, or server actions.
  - No Next.js dynamic route parameters unless accompanied by `generateStaticParams()`.
  - Use `export const dynamic = 'force-static'` on route handlers if added.
- Images must use `unoptimized: true` (configured globally in `next.config.ts`).
- All internal page links should follow relative or root-relative paths consistent with `trailingSlash: true`.

### 4.3. Client vs. Server Components
- Use `'use client'` strictly when client-side hooks (`useState`, `useEffect`, `useRef`), browser APIs (`localStorage`, `window`), or interaction handlers (`onClick`, `onSubmit`) are required.
- Keep pages as server components where possible to maximize static HTML generation.

### 4.4. Generative Art & Media Fallbacks
- The `DieArt` component (`src/components/DieArt.tsx`) renders an SVG silicon die floorplan deterministically generated using Mulberry32 PRNG.
- When adding entities (members, gallery items, events), always provide a numeric `seed` and a `hue` (`'navy' | 'blue' | 'cyan' | 'sky'`) to guarantee that `Media` fallback artwork displays properly in the absence of a photo.
- **Auto-Generated Initials Badge**: Member cards without bitmap images render the procedural chip floorplan with an initials badge auto-computed via `getInitials(name)` (e.g. stripping honorifics and taking first and last name initials: `'Tasmir Hossain Zihad'` $\rightarrow$ `'TZ'`, `'Arnob Dam'` $\rightarrow$ `'AD'`).
- **Privacy Protection (Strict Requirement)**: Never commit student roll numbers, personal phone numbers, or private emails to GitHub or the public website. Public member profiles only display public titles, departments, and academic batches.

### 4.5. Sanity.io Executive Panel & Media Pipeline
- **Sanity Content Lake (`xcn3cj7z` / `production`)**:
  - Executive panel members are stored as `teamMember` documents in Sanity Content Lake and dynamically fetched via GROQ (`src/lib/sanity-team.ts`).
  - Historical Panels: Schema and queries support a `panel` tag (`panel: '2026'`) so previous panels (e.g. 2025, 2024 alumni) can be archived and supported in the future.
  - Resilient Fallback: If Sanity is unreachable or network drops during build, the loader gracefully falls back to the static `team` array in `src/data/club.ts`.
- **Deduplicated Asset Mapping (`src/data/sanity-assets.json`)**:
  - The repository maintains `src/data/sanity-assets.json` as the canonical registry of uploaded assets, indexing each file's SHA-1 hash, asset ID, and CDN URL.
  - Before uploading any image, the uploader script checks this registry to skip existing assets and prevent redundant network requests and duplicate assets.
- **Asset Upload Tooling**:
  - Script: [`scripts/upload_to_sanity.py`](file:///home/user/.gemini/antigravity/scratch/hackuet.github.io/scripts/upload_to_sanity.py)
  - Usage:
    ```bash
    # Single image (checks duplicates first)
    python3 scripts/upload_to_sanity.py assets/raw-team/new-member.webp

    # Batch directory upload (multithreaded, skips existing)
    python3 scripts/upload_to_sanity.py assets/raw-team/

    # Force re-upload (bypasses duplicate check)
    python3 scripts/upload_to_sanity.py assets/pics/banner.webp --force
    ```
- **Git Hygiene for Assets**:
  - Raw images are placed in `assets/raw-team/` or `assets/pics/`.
  - The `assets/` directory is strictly gitignored in `.gitignore`. **Never commit binary photos into git**.
- **Sanity Studio Isolation**:
  - The Sanity Studio (`studio-hackuet/`) is kept as an independent sibling folder outside the web repository (and listed in `.gitignore`) so studio packages and credentials are never bundled into the static GitHub Pages deployment.

### 4.6. Pre-Push Testing & Quality Gates
Before pushing any commit or submitting a pull request, agents must strictly pass all 4 verification gates:

1. **Gate 1 — Typecheck:**
   ```bash
   npm run typecheck
   ```
   Must exit with code 0 without any type errors or implicit `any`.

2. **Gate 2 — Production Static Export Build:**
   ```bash
   npm run build
   ```
   Must compile cleanly, generate all static routes (`14/14`), and complete `scripts/postexport.mjs` without errors.

3. **Gate 3 — Local Runtime & Visual Verification:**
   - Run local dev server (`npm run dev`) or test exported pages.
   - Verify page renders correctly in the browser or via automated browser tooling (Playwright).
   - Ensure external CDN assets load with HTTP 200 and SVG procedural fallbacks render as expected.

4. **Gate 4 — Binary & Secret Audit:**
   ```bash
   git status
   ```
   Ensure no image binaries (`.webp`, `.jpg`, `.png`), secret credentials (`.env`, `.env.local`), or build output folders (`.next/`, `out/`, `studio-hackuet/`) are staged.

---

## 5. Deployment Pipeline

- Push to `main` triggers `.github/workflows/deploy.yml`.
- The workflow installs dependencies via `npm ci`, runs `npm run build`, and publishes the `/out` directory directly to GitHub Pages.
- Maintain environment parity with `NEXT_PUBLIC_SITE_URL=https://hackuet.github.io`.
