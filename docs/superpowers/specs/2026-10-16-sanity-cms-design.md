# Sanity as the site's content source — design

**Date:** 2026-10-16
**Status:** Approved (design), pending implementation plan
**Repo:** hackuet.github.io (Next.js 16, static export, GitHub Pages)

## Goal

Move every piece of club content out of the repository and into Sanity (images
included). After this work:

- `src/data/club.ts` no longer exists; the repo contains no club content.
- Editors upload and change content — text and photos — in a Sanity Studio at
  `hack-kuet.sanity.studio`, with no code changes and no developer involved.
- The public site is built from Sanity content at `next build` time and
  refreshed by a webhook-triggered rebuild when content is published.

Source material for the first real dataset: `~/Documents/hack-report/`
(28-page activity report, 26 captioned photos in `images/` + `manifest.json`).

## Decisions made during design

1. **Studio lives in this repo** at `studio/` (own package.json; deployed with
   `sanity deploy`). Schemas are versioned next to the site code. Site CI never
   builds the studio.
2. **Build-time fetching** with a Sanity webhook → GitHub `repository_dispatch`
   → Pages rebuild (live in ~2 minutes after publish). No runtime fetching, no
   loading states, SEO unchanged.
3. **Typed content functions** (hand-written types) in `src/lib/content.ts` —
   one async function per content area. No codegen.
4. **Everything in `club.ts` moves to Sanity**, including registration dropdown
   lists (departments/batches/tracks) and nav labels/blurbs. Code keeps only
   route hrefs, the `addr` design constants, and validation regexes.
5. **Projects is a new, separate site section** (route `/projects`), holding
   the report's 9 technical projects. The existing Achievements section stays
   for future contest results and gets a proper empty state until then.
6. Images are served from Sanity's CDN (`cdn.sanity.io`, `auto=format`);
   content functions return plain URL strings so components keep their current
   `image?: string` shape.

## Content model (Sanity schemas)

### Singletons (fixed `_id`, duplicate/delete disabled, pinned in sidebar)

| Schema (`_id`) | Fields | Replaces |
|---|---|---|
| `siteSettings` | short, name, university, tagline, description, founded (number), email, room, address, mapUrl, meets, intake, intakeCloses | `club` |
| `homeStory` | history { title, lede, milestones[]{year,title,body} }, mission { statement, items[]{title,body} }, vision { statement, items[]{title,body} } — three collapsible field groups | `history`, `mission`, `vision` |
| `registrationOptions` | departments: string[], batches: string[], tracks[]{ id, title, note } | `departments`, `batches`, `tracks` |
| `navigation` | items[]{ key (fixed dropdown: about, projects, achievements, events, gallery, executive-board, contact), label, blurb } | `nav`, route labels/blurbs |

### Collections

| Schema | Fields | Notes |
|---|---|---|
| `heroSlide` | label, eyebrow, title, body, figure, image (hotspot), seed/hue in collapsed "placeholder artwork" group | drag-to-reorder |
| `teamMember` | name, role, department, batch, portrait image (hotspot), seed/hue group | drag-to-reorder; falls back to generated artwork |
| `event` | date (ISO, validated), when (display string), title, place, body | sorted by date; upcoming/past logic unchanged |
| `project` | title, description, images (1..n, hotspot), links[]{label,url}, seed/hue group | drag-to-reorder; the new section |
| `achievement` | year, title, event, result | drag-to-reorder; empty state on the page |
| `galleryPhoto` | title (doubles as caption/alt), date label, category (workshop / project / farewell / other), image, seed/hue group | drag-to-reorder |

Cross-cutting rules:

- `hue` is a dropdown matching the existing art generator: `navy | blue | cyan | sky`.
- `seed` has sensible defaults; nothing beyond natural fields is required.
- Image alt text reuses title/name; no separate alt field.
- Track `id`s and navigation `key`s are stable identifiers — field descriptions
  warn not to change them once published (saved member passes validate against
  track ids).
- Anti-drift: route hrefs stay in code (`/projects`, `/achievements`, …), so a
  Studio edit can never point the nav at a missing page.

## Site data layer

New dependencies (build-time only): `@sanity/client`, `@sanity/image-url`.

**`src/lib/sanity.ts`**
- Client from env: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`
  (public values — they appear in every CDN URL). Pinned `apiVersion`.
- `useCdn: true` in production builds, `false` in dev (Studio edits visible on
  reload).
- `urlFor(source)` image-builder helper.
- Missing env at build → throw with an actionable message.

**`src/lib/content.ts`**
- All content types (`Slide`, `Member`, `ClubEvent`, `Project`, `Achievement`,
  `Photo`, `Track`, …) — moved out of `club.ts`.
- Async fetchers, one per area: `getSiteSettings()`, `getSlides()`,
  `getStory()`, `getTeam()`, `getEvents()`, `getGallery()`, `getProjects()`,
  `getAchievements()`, `getRegistrationOptions()`, `getNavigation()`.
- Fetchers map Sanity image refs → CDN URLs at sensible widths
  (slide ~1920, gallery/project ~1600, portrait ~800; `auto=format`).
- `SECTION` map in code: `{ key, href, addr }`; labels/blurbs merged in from
  `navigation`.

**Failure policy:** unreachable Sanity or missing singleton fails the build
(GitHub Pages keeps the previous good deploy). Empty collections render
intentional empty states, never blank gaps.

## Page and component refactor

- The 6 existing pages plus new `src/app/projects/page.tsx` become async server
  components; each awaits its content functions and passes props down.
  `layout.tsx` fetches settings once (metadata, Header, Footer).
- Components currently importing `@/data/club` (`HeroCarousel`, `EventsView`,
  `RegisterForm`, `MemberPass`, `Header`, `Footer`, `Page`, `TeamGrid`,
  `ui.tsx` types) switch to props; types import from `@/lib/content`.
- Every consumer of `routes`/`nav` switches to the `SECTION` map + Sanity
  labels: `Page.tsx` sidebar, `Header`, `Footer`, `sitemap.ts`.
- `seo.ts`, `manifest.ts`, `llms.txt/route.ts`: settings/navigation from
  Sanity; hrefs from code.
- Address labels (`addr`) shift to make room: projects `0x05`, achievements
  `0x06`, events `0x07`, gallery `0x08`, executive-board `0x09`, contact `0x0A`.
- New `/projects` page UI: card grid (photo, title, description, optional
  links) reusing existing card/media styles; minor `page.css` additions only.
- Register page: dropdown lists and track data baked in at build from
  `registrationOptions`; browser-side validation unchanged (`TrackId` becomes
  `string`).
- Delete `src/data/club.ts`; remove the "under development / placeholder data"
  banner from `Header.tsx` (same change set, before merge, once real content is
  verified locally).
- Add `.env.example` documenting both env vars; README gains editor + developer
  sections.

## Studio (`studio/`)

- `sanity` v6 (current), `@sanity/orderable-document-list`, TypeScript; own
  `package.json`, `tsconfig`, `sanity.config.ts`, `schemaTypes/`.
- Structure: singletons pinned (`S.document().schemaType(...).documentId(...)`),
  collections grouped; Vision tool optional.
- Root scripts: `npm run studio`, `npm run studio:deploy`. Root `tsconfig.json`
  excludes `studio/`; root install/CI untouched by it.

## CI, webhook, deploy

- `deploy.yml` build step reads the two public vars from repo Actions
  **Variables**.
- `deploy.yml` gains `on: repository_dispatch: types: [sanity-publish]`.
- Sanity webhook (created by the user in the project dashboard): on
  create/update/delete, filter `!(_id in path("drafts.**"))`, POST to
  `https://api.github.com/repos/hackuet/hackuet.github.io/dispatches`,
  `Accept: application/vnd.github+json`, body
  `{"event_type":"sanity-publish"}`, `Authorization: Bearer <fine-grained
  PAT>` (Contents: read and write). Token lives only in Sanity's webhook
  config — never in the repo.

## First-data import (one-time)

Script written to `~/Documents/hack-report/` — deliberately **not** in the
repo, because it embeds captions/mappings; the repo stays content-free.

- Uploads the 26 report photos to Sanity (asset dedupe by checksum).
- Creates `galleryPhoto` docs with captions from `manifest.json`.
- Creates `project` docs (9 projects) with their photos, descriptions from the
  report.
- Creates `event` docs (6 workshops + farewell ceremony); farewell date marked
  for the user to fill.
- Creates singleton skeletons with draft copy drawn from the report
  (introduction/goals/roadmap) for the user to refine in the Studio.
- Run once locally with a write token the user creates in the dashboard.

## Who does what (one-time setup)

1. **User:** `cd studio && npx sanity login`, create project + `production`
   dataset; share project ID.
2. **Agent:** wire env + code; `.env.local` for dev.
3. **User:** add the two public vars to GitHub Actions Variables.
4. **Agent:** run import script; verify all pages locally with `npm run dev`.
5. **User:** `npm run studio:deploy`; optionally create the webhook PAT.
6. **Agent:** finalize `deploy.yml` webhook trigger; end-to-end test.

## Testing

- `npm run typecheck`, `npm run build` against the real project.
- Dev spot-check of all routes incl. new `/projects`; image URLs resolve from
  `cdn.sanity.io` with correct content types.
- Empty-state check: Achievements empty, Projects populated.
- Register flow regression: dropdowns from Sanity, validation, pass issuance,
  MemberPass shows track title.
- Studio: schema validation on deploy; publish a test change → confirm webhook
  fires the Actions rebuild → change appears live.

## Out of scope (explicit)

- Registration submissions (still `localStorage`; a write path needs its own
  backend/serverless design).
- Draft previews / visual editing (published content only).
- Dynamic OG image from Sanity (static file stays).
- Visual redesign; the only new UI is the Projects card grid, in existing
  styles.
- Assignments, hardware inventory, and alumni from the report — data model
  can absorb them later as new collections if wanted.

## Content the user should have ready for the first import

- Club founding year and history copy (not in the report).
- Farewell ceremony date.
- Current executive board names/roles/portraits (not in the report).
- Final tagline/description wording of choice.
