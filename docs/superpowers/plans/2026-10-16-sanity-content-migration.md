# Sanity Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move every piece of club content out of the repo into Sanity (text + photos), with the static site built from Sanity at `next build` time and rebuilt automatically when content is published.

**Architecture:** A Sanity Studio v6 lives in `studio/` (own package.json, deployed to Sanity's free hosting). The static Next.js site gains a build-time-only data layer (`src/lib/sanity.ts` + `src/lib/content.ts`) of typed async fetchers; pages become async server components that pass plain props to existing (mostly unchanged) components. A one-time import script outside the repo seeds the real dataset from `~/Documents/hack-report/`. A Sanity webhook triggers a GitHub Actions rebuild via `repository_dispatch`.

**Tech Stack:** Next.js 16 (static export, GitHub Pages), React 19, TypeScript, Sanity Studio v6, `@sanity/client`, `@sanity/image-url`, `@sanity/orderable-document-list`.

**Spec:** `docs/superpowers/specs/2026-10-16-sanity-cms-design.md` — read it first. Where this plan and the spec disagree, this plan wins (it carries two refinements: a `keywords` field on `siteSettings`, and register address `0x0B`).

## Global Constraints

- Env vars, exact names: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`. Public values (no tokens) — `.env.local` for dev, GitHub Actions **Variables** for CI.
- Client config: `apiVersion: '2026-10-01'`, `useCdn: true` in production builds, `false` in dev.
- Image URLs: width 1920 (hero slides), 1600 (gallery, projects), 800 (team portraits), `.auto('format').quality(80)`.
- Section address map (design motif, fixed in code): about `0x01`, projects `0x05`, achievements `0x06`, events `0x07`, gallery `0x08`, executive-board `0x09`, contact `0x0A`, register `0x0B`.
- Navigation `key`s (fixed identifiers, used in both schemas and code): `about`, `projects`, `achievements`, `events`, `gallery`, `executive-board`, `contact`. Route hrefs live only in code (`src/lib/sections.ts`); Studio may never create a link to a page that does not exist.
- Singleton `_id`s (fixed, queried directly): `siteSettings`, `homeStory`, `registrationOptions`, `navigation`.
- Track `id`s are stable identifiers (stored inside member passes in visitor browsers). Schema descriptions must warn not to change them.
- After this work the repo contains **zero club content**; `src/data/club.ts` is deleted. Only schemas, queries, code-level fallback labels, and validation regexes remain.
- `output: 'export'` and `images: { unoptimized: true }` stay. All fetching happens during `next build`; no runtime fetching, no new client-side JS.
- Client components (`'use client'` files) must never import `@/lib/content` or `@/lib/sanity` — only `@/lib/types`, `@/lib/sections`, `@/lib/registration`, or component modules. Sanity data reaches them exclusively as props from server components.
- CI Node 20; studio never builds in CI.
- **Verification approach:** this repo has no test runner, and the work is build-time data plumbing. Every task is verified with `npm run typecheck`, `npm run build`, greps against `out/` HTML, `npx sanity schema validate`, and targeted manual checks (browser dev tools where noted). Do not add a test framework. Failure-mode tests build against the empty `staging` dataset; if that dataset is ever unavailable, fall back to temporarily deleting a document and restoring it with the idempotent importer.

## Review Focus

Failure modes most likely to bite, each pinned to a test in the owning task:

1. **Missing singleton** (documents deleted or renamed in Studio) → build must fail with an actionable message naming the document; GitHub Pages then keeps the last good deploy. *(Task 6, verified by building against the empty `staging` dataset.)*
2. **Zero hero slides** → home page must not crash (`slides[index].figure` on an empty array) — carousel renders nothing, page intact. *(Task 7, verified by emptying slides then restoring via the idempotent import script.)*
3. **Entry without a photo** (e.g. Eyewear, whose report photo is a placeholder) → generated artwork renders, layout intact. *(Task 8, grep for `die-` in built HTML.)*
4. **Missing env vars** → build error naming the variable and pointing at README, never a cryptic fetch failure. *(Task 6 — the first build that imports the client.)*
5. **Empty collections** (achievements, team, gallery before real data) → intentional empty states, never blank gaps. *(Tasks 8–9, greps for empty-state copy in `out/`.)*

---

### Task 1: Sanity project and Studio scaffold

**Files:**
- Create: `studio/` (via the official scaffold command)
- Modify: `package.json` (root scripts), `tsconfig.json` (exclude `studio`), `.gitignore` (resolve a committed merge conflict + studio entries)
- User input needed: Sanity account (login), project ID

**Interfaces:**
- Produces: a Sanity project with datasets `production` (real content) and `staging` (empty, for failure-mode tests) — **already created**: project ID `ky8bcwum`, both datasets exist; a runnable Studio in `studio/`; root scripts `npm run studio` and `npm run studio:deploy`.

- [ ] **Step 1 (USER): create the Sanity project — DONE.** At https://sanity.io/manage → *Create project* → name `HACK KUET` → dataset `production`. Then in **Datasets → Create dataset** add `staging` (leave it empty). Copy the **Project ID** (format `abc12def`) — tell the agent this value. *(Executed: project ID `ky8bcwum`; datasets `production` and `staging` confirmed via `sanity dataset list`; CLI login done.)*

- [ ] **Step 2 (USER): log in and scaffold.** From the repo root:

```bash
npx sanity@latest login
npx sanity@latest init --template clean --dataset production --output-path studio
```

Answer the prompts: select the existing project (`HACK KUET`), dataset `production`, TypeScript. If `--template clean` is rejected, pick the **Clean** template when prompted.

- [ ] **Step 3: resolve the committed `.gitignore` conflict and add studio entries.** The file currently contains literal `<<<<<<< HEAD` / `>>>>>>>` conflict markers. Replace the entire file with:

```gitignore
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# sanity studio
studio/dist
studio/.sanity

# superpowers execution scratch
.superpowers/
```

- [ ] **Step 4: root `package.json` scripts.** Add to `"scripts"` (keep alphabetical order of the existing keys):

```json
"studio": "npm --prefix studio run dev",
"studio:deploy": "npm --prefix studio run deploy",
```

- [ ] **Step 5: keep the studio out of the site build.** In `tsconfig.json`, change `"exclude": ["node_modules"]` to `"exclude": ["node_modules", "studio"]`. In `next.config.ts` no change is needed, but confirm `output: 'export'` and `images: { unoptimized: true }` are still present.

- [ ] **Step 6: verify.**

```bash
npm run typecheck            # passes; studio/ ignored
npm run studio               # Studio dev server starts (http://localhost:3333), Clean template loads
```

Stop the studio server (Ctrl-C), then:

```bash
git add -A
git commit -m "feat(studio): scaffold Sanity Studio in studio/"
```

---

### Task 2: Studio schemas

**Files:**
- Create: `studio/schemaTypes/index.ts` and ten schema files (below)
- Delete: any sample schema files the scaffold created (e.g. `studio/schemaTypes/pet.ts` or similar demo types)

**Interfaces:**
- Produces: document types `siteSettings`, `homeStory`, `registrationOptions`, `navigation`, `heroSlide`, `teamMember`, `event`, `project`, `achievement`, `galleryPhoto`. The site's queries (Task 4) and the import script (Task 5) rely on exactly these type names, field names, and `orderRank` sorting.

- [ ] **Step 1: replace the scaffolded sample types.** Delete every file in `studio/schemaTypes/` created by the template, then create the files below. Field names are load-bearing — copy exactly.

`studio/schemaTypes/siteSettings.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'identity', title: 'Identity', default: true },
    { name: 'contact', title: 'Contact' },
    { name: 'membership', title: 'Membership' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'short', title: 'Short name', type: 'string', group: 'identity', validation: (r) => r.required().max(12), description: 'The logo word and title prefix, e.g. "HACK".' }),
    defineField({ name: 'name', title: 'Full name', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'university', title: 'University', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'identity', validation: (r) => r.required() }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 3, group: 'identity', validation: (r) => r.required().max(300), description: 'One paragraph used in search results and social cards.' }),
    defineField({ name: 'founded', title: 'Founded (year)', type: 'number', group: 'identity', validation: (r) => r.integer().min(1900).max(2100), description: 'Optional. Shown in structured data and llms.txt once set.' }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (r) => r.required().email() }),
    defineField({ name: 'room', title: 'Room / meeting place', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'address', title: 'Address', type: 'string', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'mapUrl', title: 'Map link', type: 'url', group: 'contact', validation: (r) => r.required() }),
    defineField({ name: 'meets', title: 'Weekly session', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'Shown as "Meets …", e.g. "Thursdays, 5:00 PM".' }),
    defineField({ name: 'intake', title: 'Intake label', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'e.g. "Spring 2027 intake".' }),
    defineField({ name: 'intakeCloses', title: 'Intake closes', type: 'string', group: 'membership', validation: (r) => r.required(), description: 'Free-text date, e.g. "30 November 2026".' }),
    defineField({ name: 'keywords', title: 'Topics / keywords', type: 'array', of: [{ type: 'string' }], group: 'seo', description: 'Domains the club is known for; used in search metadata.' }),
  ],
  preview: { prepare: () => ({ title: 'Site settings' }) },
})
```

`studio/schemaTypes/homeStory.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'

const milestone = defineArrayMember({
  name: 'milestone',
  type: 'object',
  fields: [
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'year' } },
})

const storyItem = defineArrayMember({
  name: 'storyItem',
  type: 'object',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title' } },
})

export const homeStory = defineType({
  name: 'homeStory',
  title: 'Home story (history, mission, vision)',
  type: 'document',
  groups: [
    { name: 'history', title: 'History', default: true },
    { name: 'mission', title: 'Mission' },
    { name: 'vision', title: 'Vision' },
  ],
  fields: [
    defineField({ name: 'historyTitle', title: 'History heading', type: 'string', group: 'history', validation: (r) => r.required() }),
    defineField({ name: 'historyLede', title: 'History lead paragraph', type: 'text', rows: 3, group: 'history', validation: (r) => r.required() }),
    defineField({ name: 'milestones', title: 'Milestones', type: 'array', of: [milestone], group: 'history' }),
    defineField({ name: 'missionStatement', title: 'Mission statement', type: 'text', rows: 3, group: 'mission', validation: (r) => r.required() }),
    defineField({ name: 'missionItems', title: 'Mission items', type: 'array', of: [storyItem], group: 'mission' }),
    defineField({ name: 'visionStatement', title: 'Vision statement', type: 'text', rows: 3, group: 'vision', validation: (r) => r.required() }),
    defineField({ name: 'visionItems', title: 'Vision items', type: 'array', of: [storyItem], group: 'vision' }),
  ],
  preview: { prepare: () => ({ title: 'Home story' }) },
})
```

`studio/schemaTypes/registrationOptions.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'

export const registrationOptions = defineType({
  name: 'registrationOptions',
  title: 'Registration options',
  type: 'document',
  fields: [
    defineField({
      name: 'departments',
      title: 'Departments',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'Shown in the registration form dropdown, exactly as written here.',
    }),
    defineField({
      name: 'batches',
      title: 'Batches',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (r) => r.required().min(1),
      description: 'e.g. "2k25". Roll-number validation derives its prefix from the last two characters, so keep the 2kNN shape.',
    }),
    defineField({
      name: 'tracks',
      title: 'Tracks',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'track',
          type: 'object',
          fields: [
            defineField({
              name: 'id',
              title: 'ID',
              type: 'string',
              validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: 'lowercase id' }),
              description: 'Stable identifier stored inside member passes. Do not change once members have registered (e.g. "embedded").',
            }),
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'note', title: 'Note', type: 'string', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'title', subtitle: 'id' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: 'Registration options' }) },
})
```

`studio/schemaTypes/navigation.ts`:

```ts
import { defineArrayMember, defineField, defineType } from 'sanity'

const KEYS = [
  { title: 'About', value: 'about' },
  { title: 'Projects', value: 'projects' },
  { title: 'Achievements', value: 'achievements' },
  { title: 'Events', value: 'events' },
  { title: 'Gallery', value: 'gallery' },
  { title: 'Executive Board', value: 'executive-board' },
  { title: 'Contact', value: 'contact' },
]

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'navItem',
          type: 'object',
          fields: [
            defineField({
              name: 'key',
              title: 'Section',
              type: 'string',
              options: { list: KEYS },
              validation: (r) => r.required(),
              description: 'Which page this label belongs to. Page addresses are fixed in code; only the words change here.',
            }),
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'blurb', title: 'Short description', type: 'string', description: 'One line, shown on the home page index and in llms.txt.' }),
          ],
          preview: { select: { title: 'label', subtitle: 'key' } },
        }),
      ],
      validation: (r) => r.required().min(1),
    }),
  ],
  preview: { prepare: () => ({ title: 'Navigation' }) },
})
```

- [ ] **Step 2: create the collection schemas.**

`studio/schemaTypes/heroSlide.ts`:

```ts
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const heroSlide = defineType({
  name: 'heroSlide',
  title: 'Hero slides',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'heroSlide' }),
    defineField({ name: 'label', title: 'Tick label', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Short word shown on the carousel tick, e.g. "Learn".' }),
    defineField({ name: 'eyebrow', title: 'Eyebrow', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Heading', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'figure', title: 'Figure caption', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Image', type: 'image', group: 'content', options: { hotspot: true } }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 11, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'navy', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'label' }, prepare: (s) => ({ title: s.title ?? '', subtitle: s.label ?? '' }) },
})
```

`studio/schemaTypes/teamMember.ts`:

```ts
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Executive board',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Member', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'teamMember' }),
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Role', type: 'string', group: 'content', validation: (r) => r.required(), description: 'e.g. "President".' }),
    defineField({ name: 'department', title: 'Department', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'batch', title: 'Batch', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'image', title: 'Portrait', type: 'image', group: 'content', options: { hotspot: true }, description: 'Until a portrait is added, generated artwork is shown.' }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 211, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'navy', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'name', subtitle: 'title', media: 'image' } },
})
```

`studio/schemaTypes/event.ts`:

```ts
import { defineField, defineType } from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Events',
  type: 'document',
  orderings: [
    { title: 'Date, newest first', name: 'dateDesc', by: [{ field: 'date', direction: 'desc' }] },
  ],
  fields: [
    defineField({ name: 'date', title: 'Date (ISO)', type: 'date', validation: (r) => r.required(), description: 'Used for sorting and upcoming/past status.' }),
    defineField({ name: 'when', title: 'Display text', type: 'string', validation: (r) => r.required(), description: 'What visitors read, e.g. "13 to 14 Nov 2026" or "20 Aug 2026, 5:00 PM".' }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'place', title: 'Place', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Body', type: 'text', rows: 3, validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'when' } },
})
```

`studio/schemaTypes/project.ts`:

```ts
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineArrayMember, defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

export const project = defineType({
  name: 'project',
  title: 'Projects',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Project', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'project' }),
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'body', title: 'Description', type: 'text', rows: 4, group: 'content', validation: (r) => r.required() }),
    defineField({ name: 'images', title: 'Photos', type: 'array', of: [{ type: 'image', options: { hotspot: true } }], group: 'content', description: 'The first photo is the card cover; any further photos appear below it.' }),
    defineField({
      name: 'links',
      title: 'Links',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'projectLink',
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'url', title: 'URL', type: 'url', validation: (r) => r.required() }),
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        }),
      ],
    }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 301, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'blue', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', media: 'images.0' } },
})
```

`studio/schemaTypes/achievement.ts`:

```ts
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

export const achievement = defineType({
  name: 'achievement',
  title: 'Achievements',
  type: 'document',
  orderings: [orderRankOrdering],
  fields: [
    orderRankField({ type: 'achievement' }),
    defineField({ name: 'year', title: 'Year', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'event', title: 'Event / venue', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'result', title: 'Result', type: 'string', validation: (r) => r.required(), description: 'e.g. "Champion", "Paper accepted".' }),
  ],
  preview: { select: { title: 'title', subtitle: 'result' } },
})
```

`studio/schemaTypes/galleryPhoto.ts`:

```ts
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { defineField, defineType } from 'sanity'

const HUES = [
  { title: 'Navy', value: 'navy' },
  { title: 'Blue', value: 'blue' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Sky', value: 'sky' },
]

const CATEGORIES = [
  { title: 'Workshop', value: 'workshop' },
  { title: 'Project', value: 'project' },
  { title: 'Farewell', value: 'farewell' },
  { title: 'Other', value: 'other' },
]

export const galleryPhoto = defineType({
  name: 'galleryPhoto',
  title: 'Gallery',
  type: 'document',
  orderings: [orderRankOrdering],
  groups: [
    { name: 'content', title: 'Photo', default: true },
    { name: 'art', title: 'Placeholder artwork' },
  ],
  fields: [
    orderRankField({ type: 'galleryPhoto' }),
    defineField({ name: 'title', title: 'Caption', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Doubles as the image alt text.' }),
    defineField({ name: 'date', title: 'Date label', type: 'string', group: 'content', validation: (r) => r.required(), description: 'Free text, e.g. "October 2026".' }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'content', options: { list: CATEGORIES } }),
    defineField({ name: 'image', title: 'Photo', type: 'image', group: 'content', options: { hotspot: true } }),
    defineField({ name: 'seed', title: 'Artwork seed', type: 'number', group: 'art', initialValue: 101, validation: (r) => r.required().integer() }),
    defineField({ name: 'hue', title: 'Artwork colour', type: 'string', group: 'art', options: { list: HUES, layout: 'radio' }, initialValue: 'sky', validation: (r) => r.required() }),
  ],
  preview: { select: { title: 'title', subtitle: 'date', media: 'image' } },
})
```

- [ ] **Step 3: wire the schema list.** Replace `studio/schemaTypes/index.ts` with:

```ts
import { achievement } from './achievement'
import { event } from './event'
import { galleryPhoto } from './galleryPhoto'
import { heroSlide } from './heroSlide'
import { homeStory } from './homeStory'
import { navigation } from './navigation'
import { project } from './project'
import { registrationOptions } from './registrationOptions'
import { siteSettings } from './siteSettings'
import { teamMember } from './teamMember'

export const schemaTypes = [
  siteSettings,
  homeStory,
  registrationOptions,
  navigation,
  heroSlide,
  teamMember,
  event,
  project,
  achievement,
  galleryPhoto,
]
```

- [ ] **Step 4: install the ordering plugin.** In `studio/`: `npm install @sanity/orderable-document-list`.

- [ ] **Step 5: verify.**

```bash
cd studio && npx sanity schema validate && cd ..
```

Expected: “All schemas are valid.” If the command is unavailable in the installed CLI version, run `npx sanity dev` instead and confirm the Studio loads without schema errors, then Ctrl-C.

- [ ] **Step 6: commit.**

```bash
git add studio
git commit -m "feat(studio): content schemas for settings, story, options, nav, slides, team, events, projects, achievements, gallery"
```

---

### Task 3: Studio structure, singleton guards, deploy config

**Files:**
- Create: `studio/structure.ts`
- Modify: `studio/sanity.config.ts`, `studio/sanity.cli.ts` (both created by the scaffold)

**Interfaces:**
- Produces: pinned singleton editing screens (`siteSettings`, `homeStory`, `registrationOptions`, `navigation`), drag-to-reorder lists (slides, projects, achievements, gallery, team), a plain Events list, deploy target `hack-kuet.sanity.studio`.

- [ ] **Step 1: create `studio/structure.ts`.**

```ts
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      S.listItem().title('Site settings').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem().title('Home story').id('homeStory').child(S.document().schemaType('homeStory').documentId('homeStory')),
      S.listItem().title('Registration options').id('registrationOptions').child(S.document().schemaType('registrationOptions').documentId('registrationOptions')),
      S.listItem().title('Navigation').id('navigation').child(S.document().schemaType('navigation').documentId('navigation')),
      S.divider(),
      orderableDocumentListDeskItem({ type: 'heroSlide', title: 'Hero slides', S, context }),
      orderableDocumentListDeskItem({ type: 'project', title: 'Projects', S, context }),
      S.documentTypeListItem('event').title('Events'),
      orderableDocumentListDeskItem({ type: 'achievement', title: 'Achievements', S, context }),
      orderableDocumentListDeskItem({ type: 'galleryPhoto', title: 'Gallery', S, context }),
      orderableDocumentListDeskItem({ type: 'teamMember', title: 'Executive board', S, context }),
    ])
```

- [ ] **Step 2: singleton protection in `studio/sanity.config.ts`.** Keep the scaffolded `projectId` and `dataset`; make the rest of the file read:

```ts
import { visionTool } from '@sanity/vision'
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'
import { structure } from './structure'

const SINGLETONS = new Set(['siteSettings', 'homeStory', 'registrationOptions', 'navigation'])

export default defineConfig({
  name: 'default',
  title: 'HACK KUET',
  projectId: '<PROJECT_ID>',
  dataset: 'production',
  plugins: [structureTool({ structure }), visionTool()],
  schema: { types: schemaTypes },
  document: {
    actions: (prev, context) =>
      SINGLETONS.has(context.schemaType)
        ? prev.filter(({ action }) => action !== 'duplicate' && action !== 'delete')
        : prev,
    newDocumentOptions: (prev) =>
      prev.filter((template) => !SINGLETONS.has(template.templateId.replace(/^template-/, ''))),
  },
})
```

- [ ] **Step 3: deploy target in `studio/sanity.cli.ts`.** Keep the scaffolded project config; add `studioHost`:

```ts
import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: { projectId: '<PROJECT_ID>', dataset: 'production' },
  studioHost: 'hack-kuet',
})
```

- [ ] **Step 4: verify locally.**

```bash
npm run studio
```

Expected: sidebar shows the four singletons pinned at the top, then Hero slides, Projects, Events, Achievements, Gallery, Executive board. The global “create new document” menu offers only the six collections. Ctrl-C when satisfied.

- [ ] **Step 5 (USER): deploy the Studio.**

```bash
npm run studio:deploy
```

Confirm the hostname `hack-kuet` when asked (the editor URL becomes `https://hack-kuet.sanity.studio`). If the CLI asks for an app or deployment name instead, accept defaults.

- [ ] **Step 6: commit.**

```bash
git add studio
git commit -m "feat(studio): pinned singletons, orderable lists, deploy host"
```

---

### Task 4: Site data layer (types, sections, client, fetchers)

**Files:**
- Create: `src/lib/types.ts`, `src/lib/sections.ts`, `src/lib/sanity.ts`, `src/lib/content.ts`, `.env.example`
- Create (untracked): `.env.local`
- Modify: `package.json` (dependencies)

**Interfaces:**
- Produces, used by every later task:
  - Types: `SiteSettings`, `Slide`, `Milestone`, `StoryItem`, `Story`, `Member`, `ClubEvent`, `Project`, `Achievement`, `Photo`, `Track`, `RegistrationOptions`, `NavItem`, `Section`, `SanityImage` (all in `@/lib/types`, pure).
  - `ROUTE_DEFS`, `REGISTER_ADDR`, `mergeNavigation(items: NavItem[]): Section[]`, `routeSections(): Section[]` (all in `@/lib/sections`, pure).
  - `client`, `imageUrl(image: SanityImage | undefined, width: number): string | undefined` (in `@/lib/sanity`, server-only).
  - Fetchers: `getSiteSettings()`, `getSlides()`, `getStory()`, `getTeam()`, `getEvents()`, `getGallery()`, `getProjects()`, `getAchievements()`, `getRegistrationOptions()`, `getNavigation()` — all `async`, all in `@/lib/content` (server-only).

- [ ] **Step 1: install dependencies.**

```bash
npm install @sanity/client @sanity/image-url
```

Also add a root `prebuild` script (runs automatically before every `npm run build`):

```json
"prebuild": "node -e \"require('fs').rmSync('.next/cache/fetch-cache', { recursive: true, force: true })\""
```

Next persists fetched responses in `.next/cache/fetch-cache`, so without this a local rebuild can reuse the previous build’s Sanity reads and serve stale content. CI builds start from fresh checkouts and are unaffected; this keeps local rebuilds honest.

- [ ] **Step 2: create `src/lib/types.ts`.**

```ts
// Pure content types shared by server fetchers, client components, and the
// registration logic. Nothing here may import Sanity — client bundles depend on it.
import type { Hue } from '@/components/DieArt'

export type { Hue }

export type SiteSettings = {
  short: string
  name: string
  university: string
  tagline: string
  description: string
  founded?: number
  email: string
  room: string
  address: string
  mapUrl: string
  meets: string
  intake: string
  intakeCloses: string
  keywords: string[]
}

export type Slide = {
  id: string
  label: string
  eyebrow: string
  title: string
  body: string
  figure: string
  seed: number
  hue: Hue
  image?: string
}

export type StoryItem = { title: string; body: string }
export type Milestone = { year: string; title: string; body: string }

export type Story = {
  history: { title: string; lede: string; milestones: Milestone[] }
  mission: { statement: string; items: StoryItem[] }
  vision: { statement: string; items: StoryItem[] }
}

export type Member = {
  id: string
  name: string
  title: string
  department: string
  batch: string
  seed: number
  hue: Hue
  /** Sanity CDN URL; artwork is shown until one is set. */
  image?: string
}

export type ClubEvent = { id: string; date: string; when: string; title: string; place: string; body: string }

export type Project = {
  id: string
  title: string
  body: string
  seed: number
  hue: Hue
  images: string[]
  links: { label: string; url: string }[]
}

export type Achievement = { id: string; year: string; title: string; event: string; result: string }

export type Photo = {
  id: string
  title: string
  date: string
  category?: string
  seed: number
  hue: Hue
  image?: string
}

export type Track = { id: string; title: string; note: string }
export type RegistrationOptions = { departments: string[]; batches: string[]; tracks: Track[] }

export type NavItem = { key: string; label: string; blurb?: string }
export type Section = { key: string; href: string; addr: string; label: string; blurb?: string }

export type SanityImage = { _type: 'image'; asset: { _ref: string } }
```

- [ ] **Step 3: create `src/lib/sections.ts`.**

```ts
import type { NavItem, Section } from './types'

// Route hrefs and address labels are design constants: a navigation label edited
// in the Studio can never point at a page that does not exist. The Projects
// route is added to this list in Task 8, together with its page.
export const REGISTER_ADDR = '0x0B'

const ROUTE_DEFS: Section[] = [
  { key: 'about', href: '/#history', addr: '0x01', label: 'About', blurb: 'How the club started and why it exists.' },
  { key: 'achievements', href: '/achievements', addr: '0x06', label: 'Achievements', blurb: 'Contest results and published work.' },
  { key: 'events', href: '/events', addr: '0x07', label: 'Events', blurb: 'Workshops, sessions and what is coming next.' },
  { key: 'gallery', href: '/gallery', addr: '0x08', label: 'Gallery', blurb: 'Sessions, builds and contest days.' },
  { key: 'executive-board', href: '/executive-board', addr: '0x09', label: 'Executive Board', blurb: 'The students running the club this year.' },
  { key: 'contact', href: '/#contact', addr: '0x0A', label: 'Contact', blurb: 'Where to find us, and how to write.' },
]

/** Labels and blurbs come from Sanity; addresses and hrefs stay in code. Unknown
    Studio items are ignored; missing ones fall back to the defaults above. */
export function mergeNavigation(items: NavItem[]): Section[] {
  const byKey = new Map(items.map((item) => [item.key, item]))
  return ROUTE_DEFS.map((def) => {
    const item = byKey.get(def.key)
    return { ...def, label: item?.label ?? def.label, blurb: item?.blurb ?? def.blurb }
  })
}

/** The named section routes (about and contact are anchors on the home page). */
export function routeSections(): Section[] {
  return ROUTE_DEFS.filter((section) => section.href.startsWith('/'))
}
```

- [ ] **Step 4: create `src/lib/sanity.ts`.**

```ts
import { createClient } from '@sanity/client'
import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImage } from './types'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

if (!projectId || !dataset) {
  throw new Error(
    'Missing Sanity configuration: set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET. ' +
      'Locally: copy .env.example to .env.local. In CI: repository Settings → Secrets and variables → ' +
      'Actions → Variables. See README.md.',
  )
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-10-01',
  // Build-time only: never read through the CDN, so a webhook-triggered rebuild
  // always sees the publish it was triggered by.
  useCdn: false,
})

const builder = createImageUrlBuilder(client)

/** CDN URL for a Sanity image, format-optimised; undefined when no image is set. */
export function imageUrl(image: SanityImage | undefined, width: number): string | undefined {
  if (!image?.asset?._ref) return undefined
  return builder.image(image).width(width).auto('format').quality(80).url()
}
```

- [ ] **Step 5: create `src/lib/content.ts`.** All fetchers; singleton documents fail loudly with an actionable message, navigation degrades to code defaults.

```ts
import { client, imageUrl } from './sanity'
import { mergeNavigation } from './sections'
import type {
  Achievement, ClubEvent, Member, NavItem, Photo, Project, SanityImage, Section, SiteSettings, Slide, Story,
} from './types'

export const STUDIO_URL = 'https://hack-kuet.sanity.studio'

function required(what: string): never {
  throw new Error(
    `Sanity: ${what} is missing. Open the Studio (${STUDIO_URL}) and create or restore it before building.`,
  )
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const doc = await client.fetch<SiteSettings | null>(`*[_id == "siteSettings"][0]{
    short, name, university, tagline, description, founded, email, room, address, mapUrl, meets, intake, intakeCloses, keywords
  }`)
  if (!doc) required('the "Site settings" document')
  return doc
}

type SlideDoc = Omit<Slide, 'id' | 'image'> & { _id: string; image?: SanityImage }

export async function getSlides(): Promise<Slide[]> {
  const docs = await client.fetch<SlideDoc[]>(`*[_type == "heroSlide"] | order(orderRank asc) {
    _id, label, eyebrow, title, body, figure, seed, hue, image
  }`)
  return docs.map(({ _id, image, ...rest }) => ({ ...rest, id: _id, image: imageUrl(image, 1920) }))
}

type StoryDoc = {
  historyTitle: string
  historyLede: string
  milestones?: Story['history']['milestones']
  missionStatement: string
  missionItems?: Story['mission']['items']
  visionStatement: string
  visionItems?: Story['vision']['items']
}

export async function getStory(): Promise<Story> {
  const doc = await client.fetch<StoryDoc | null>(`*[_id == "homeStory"][0]{
    historyTitle, historyLede, milestones[]{ year, title, body },
    missionStatement, missionItems[]{ title, body },
    visionStatement, visionItems[]{ title, body }
  }`)
  if (!doc) required('the "Home story" document')
  return {
    history: { title: doc.historyTitle, lede: doc.historyLede, milestones: doc.milestones ?? [] },
    mission: { statement: doc.missionStatement, items: doc.missionItems ?? [] },
    vision: { statement: doc.visionStatement, items: doc.visionItems ?? [] },
  }
}

type MemberDoc = Omit<Member, 'id' | 'image'> & { _id: string; image?: SanityImage }

export async function getTeam(): Promise<Member[]> {
  const docs = await client.fetch<MemberDoc[]>(`*[_type == "teamMember"] | order(orderRank asc) {
    _id, name, title, department, batch, seed, hue, image
  }`)
  return docs.map(({ _id, image, ...rest }) => ({ ...rest, id: _id, image: imageUrl(image, 800) }))
}

export async function getEvents(): Promise<ClubEvent[]> {
  const docs = await client.fetch<(Omit<ClubEvent, 'id'> & { _id: string })[]>(`*[_type == "event"] {
    _id, date, when, title, place, body
  }`)
  return docs.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
}

type PhotoDoc = Omit<Photo, 'id' | 'image'> & { _id: string; image?: SanityImage }

export async function getGallery(): Promise<Photo[]> {
  const docs = await client.fetch<PhotoDoc[]>(`*[_type == "galleryPhoto"] | order(orderRank asc) {
    _id, title, date, category, seed, hue, image
  }`)
  return docs.map(({ _id, image, ...rest }) => ({ ...rest, id: _id, image: imageUrl(image, 1600) }))
}

type ProjectDoc = {
  _id: string
  title: string
  body: string
  seed: number
  hue: Project['hue']
  images?: SanityImage[]
  links?: { label: string; url: string }[]
}

export async function getProjects(): Promise<Project[]> {
  const docs = await client.fetch<ProjectDoc[]>(`*[_type == "project"] | order(orderRank asc) {
    _id, title, body, seed, hue, images[]{ asset }, links[]{ label, url }
  }`)
  return docs.map((doc) => ({
    id: doc._id,
    title: doc.title,
    body: doc.body,
    seed: doc.seed,
    hue: doc.hue,
    images: (doc.images ?? []).map((image) => imageUrl(image, 1600)).filter((url): url is string => Boolean(url)),
    links: doc.links ?? [],
  }))
}

export async function getAchievements(): Promise<Achievement[]> {
  const docs = await client.fetch<(Omit<Achievement, 'id'> & { _id: string })[]>(`*[_type == "achievement"] | order(orderRank asc) {
    _id, year, title, event, result
  }`)
  return docs.map(({ _id, ...rest }) => ({ ...rest, id: _id }))
}

export async function getRegistrationOptions(): Promise<RegistrationOptions> {
  const doc = await client.fetch<RegistrationOptions | null>(`*[_id == "registrationOptions"][0]{
    departments, batches, tracks[]{ id, title, note }
  }`)
  if (!doc) required('the "Registration options" document')
  return { departments: doc.departments ?? [], batches: doc.batches ?? [], tracks: doc.tracks ?? [] }
}

/** Navigation tolerates a missing document: code-level default labels apply. */
export async function getNavigation(): Promise<Section[]> {
  const items = await client.fetch<NavItem[] | null>(`*[_id == "navigation"][0].items[]{ key, label, blurb }`)
  return mergeNavigation(items ?? [])
}
```

Add `RegistrationOptions` to the type imports of `content.ts`.

- [ ] **Step 6: environment files.** Create `.env.example`:

```bash
# Public Sanity identifiers (safe to expose; they appear in every CDN image URL).
# Local development: copy to .env.local and fill in from sanity.io/manage.
# CI: add both as repository Actions variables (Settings → Secrets and variables → Actions → Variables).
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
```

Then create the untracked `.env.local` with the real project ID from Task 1:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=<PROJECT_ID>
NEXT_PUBLIC_SANITY_DATASET=production
```

- [ ] **Step 7: verify.**

```bash
npm run typecheck
npm run build
git status --short    # .env.local must NOT appear (it is gitignored)
```

Both commands pass; the site still renders the old `club.ts` content at this point — that file is untouched, only the new modules are added.

- [ ] **Step 8: commit.**

```bash
git add package.json package-lock.json src/lib .env.example
git commit -m "feat: add Sanity client, content types and typed fetchers"
```

---

### Task 5: First-data import from the report

**Files:**
- Create: `~/Documents/hack-report/import-to-sanity.mjs` (**outside the repo** — it embeds captions and mappings; the repo stays content-free)
- Create: `~/Documents/hack-report/package.json` + `node_modules` (via `npm init -y` & install)

**Interfaces:**
- Consumes: the production dataset + a write token; `images/manifest.json`; `images/figure-*.jpeg`.
- Produces: uploaded assets and documents with deterministic IDs — `siteSettings`, `homeStory`, `registrationOptions`, `navigation` singletons; `heroSlide-1..4`; `event-krpc|ros2|servo|vla|ignition|webinar|farewell`; `project-<slug>` × 9; `gallery-fig-NN` × 24 (only figures whose image file exists; the manifest's 7 placeholder entries are skipped). Re-running is safe: every write is `createOrReplace`.

- [ ] **Step 1: prepare the folder.**

```bash
cd ~/Documents/hack-report
npm init -y
npm install @sanity/client
```

- [ ] **Step 2 (USER): create a write token.** sanity.io/manage → HACK KUET → **API → Tokens → Add API token** → name `import script`, permissions **Editor**. Copy the `sk…` value.

- [ ] **Step 3: write the import script.** Create `~/Documents/hack-report/import-to-sanity.mjs`:

```js
// One-time importer: uploads the report's photos and seeds the first Sanity
// documents for the HACK site. Run from this folder:
//   SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=skxxxx node import-to-sanity.mjs
// Re-running is safe: every document has a deterministic _id and is replaced.
import { createClient } from '@sanity/client'
import { createReadStream, readFileSync } from 'node:fs'
import { basename, dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const { SANITY_PROJECT_ID, SANITY_DATASET = 'production', SANITY_WRITE_TOKEN } = process.env
if (!SANITY_PROJECT_ID || !SANITY_WRITE_TOKEN) {
  console.error('Set SANITY_PROJECT_ID and SANITY_WRITE_TOKEN (see Step 2).')
  process.exit(1)
}

const client = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-10-01',
  token: SANITY_WRITE_TOKEN,
  useCdn: false,
})

const here = dirname(fileURLToPath(import.meta.url))
const manifest = JSON.parse(readFileSync(resolve(here, 'images/manifest.json'), 'utf8'))
const HUES = ['navy', 'blue', 'cyan', 'sky']
const rank = (n) => `0|${n.toString(36).padStart(6, '0')}:`
const imageRef = (assetId) => ({ _type: 'image', asset: { _type: 'reference', _ref: assetId } })
const counts = {}
const put = async (doc) => {
  await client.createOrReplace(doc)
  counts[doc._type] = (counts[doc._type] ?? 0) + 1
}

// figure number -> [date label, category]
const PHOTO_META = {
  1: ['3 October 2026', 'workshop'], 2: ['3 October 2026', 'workshop'],
  4: ['26 September 2026', 'workshop'], 5: ['26 September 2026', 'workshop'], 6: ['26 September 2026', 'workshop'],
  7: ['1 August 2026', 'workshop'], 8: ['1 August 2026', 'workshop'], 9: ['1 August 2026', 'workshop'], 10: ['1 August 2026', 'workshop'],
  11: ['9 June 2026', 'workshop'],
  12: ['2026', 'project'], 13: ['2026', 'project'], 14: ['2026', 'project'], 15: ['2026', 'project'],
  17: ['2026', 'project'], 19: ['2026', 'project'], 20: ['2026', 'project'], 21: ['2026', 'project'],
  26: ['October 2026', 'farewell'], 27: ['October 2026', 'farewell'], 28: ['October 2026', 'farewell'],
  29: ['October 2026', 'farewell'], 30: ['October 2026', 'farewell'], 31: ['October 2026', 'farewell'],
}

const EVENTS = [
  { id: 'event-krpc', date: '2026-10-10', when: '10 Oct 2026', title: 'KRPC and upcoming competition', place: 'KUET', body: 'A meeting on the Kibo Robot Programming Challenge, competition strategy and the design and collection of the relevant learning materials.' },
  { id: 'event-ros2', date: '2026-10-03', when: '3 Oct 2026', title: 'Introduction to ROS 2 and RTOS', place: 'KUET', body: 'The session introduced ROS 2 nodes, topics and actions, and RTOS task scheduling. Session materials were distributed to support continued learning.' },
  { id: 'event-servo', date: '2026-09-26', when: '26 Sep 2026', title: 'Servo motor control workshop', place: 'KUET', body: 'A hands-on workshop on servo motor control and precision positioning, ending with the construction and logic of a Smart Dustbin prototype.' },
  { id: 'event-vla', date: '2026-09-21', when: '21 Sep 2026', title: 'Competition preparation and VLA discussion', place: 'KUET', body: 'Upcoming competitions, session logistics for batch 2K25, ROS 2 and RTOS preparation, VLA learning, and collection of the robot car from the laboratory.' },
  { id: 'event-ignition', date: '2026-08-01', when: '1 Aug 2026', title: 'HACK IGNITION 2K25', place: 'KUET', body: 'The orientation introduced the club’s vision, goals and activities to the 2K25 batch, together with basic Arduino programming and electronics.' },
  { id: 'event-webinar', date: '2026-06-09', when: '9 Jun 2026', title: 'Firmware development webinar', place: 'KUET', body: 'Wired communication protocols — I2C, SPI and UART — alongside low-level memory management concepts relevant to firmware engineering.' },
  { id: 'event-farewell', date: '2026-10-12', when: 'October 2026 — update date in Studio', title: 'Farewell and reception ceremony', place: 'KUET', body: 'A farewell and reception programme honouring outgoing senior executives and members for their leadership, mentorship and contributions to the club’s technical milestones.' },
]

const PROJECTS = [
  { slug: 'eyemech', title: 'EyeMech', figures: [12], body: 'A robotic-eye project that moves eye components in response to commands from a PC, exploring controlled movement and the mechanical and electronic principles of human eyeball motion.' },
  { slug: 'robotic-arm', title: 'Robotic Arm', figures: [13], body: 'Controlled arm movement in response to commands from a PC, with a specified task of identifying and grasping a particular object using computer vision.' },
  { slug: 'solar-plant-watering', title: 'Solar-Powered Plant Watering System', figures: [14, 15], body: 'A plant-watering mechanism powered by solar energy, exploring renewable energy and electronics for small-scale irrigation.' },
  { slug: 'eyewear-assistance', title: 'Eyewear Assistance System', figures: [], body: 'A wearable system built on a Raspberry Pi Zero 2 W with optical character recognition for text and video-calling support, exploring assistive technology.' },
  { slug: 'vehicle-monitoring', title: 'Low-Cost Vehicle Monitoring System', figures: [17], body: 'Vehicle monitoring through fuel tracking, GPS-based location, crash detection and OBD reading, with TLS-secured communication and offline data persistence.' },
  { slug: 'iot-microservices', title: 'IoT Microservices Platform', figures: [], body: 'An IoT platform using MQTT, Apache Kafka and microservices for real-time telemetry processing, architected to support up to one million concurrent users.' },
  { slug: 'posture-corrector', title: 'IoT-Enabled Posture Corrector', figures: [19], body: 'A wearable system intended to identify improper posture and provide feedback that encourages better posture habits.' },
  { slug: 'drunk-driving-prevention', title: 'Drunk Driving Prevention System', figures: [20], body: 'An IoT-enabled safety project for two-wheelers that detects alcohol consumption and helps prevent impaired riding through electronic control.' },
  { slug: 'offline-voice-assistant', title: 'Speech-Activated Offline Device Assistant', figures: [21], body: 'A portable voice assistant built on Raspberry Pi and ESP32 for wireless control of lights, door locks and other devices without depending on cloud services.' },
]

const SLIDES = [
  { label: 'The club', eyebrow: 'Hardware Acceleration Club of KUET', title: 'Hands-on hardware, from first principles.', body: 'HACK is where KUET students build embedded systems, robots and IoT devices — and learn the electronics and firmware underneath them.', figure: 'The club during HACK IGNITION 2K25', seed: 11, hue: 'navy' },
  { label: 'Learn', eyebrow: 'Weekly sessions', title: 'From your first circuit to a working prototype.', body: 'Workshops run through the term — Arduino and electronics, servo control, ROS 2 and RTOS — with hardware in hand before you leave.', figure: 'Servo motor control workshop, September 2026', seed: 23, hue: 'blue' },
  { label: 'Build', eyebrow: 'Member projects', title: 'Small teams, real devices.', body: 'Members design and prototype robots, assistive devices and monitoring systems, then present them at campus showcases.', figure: 'EyeMech robotic eye prototype', seed: 37, hue: 'cyan' },
  { label: 'Compete', eyebrow: 'Competitions', title: 'Taking KUET hardware to national stages.', body: 'Club teams prepare for contests such as the Kibo Robot Programming Challenge, with senior members mentoring every squad.', figure: 'Competition preparation session, October 2026', seed: 52, hue: 'sky' },
]

async function main() {
  // 1. Upload every photo that exists in the report.
  const assets = new Map()
  for (const figure of manifest.filter((f) => f.file)) {
    const asset = await client.assets.upload('image', createReadStream(resolve(here, figure.file)), {
      filename: basename(figure.file),
    })
    assets.set(figure.figure, asset._id)
    console.log(`uploaded figure ${figure.figure}`)
  }

  // 2. Gallery: one entry per photo, captions from the manifest.
  for (const figure of manifest.filter((f) => f.file)) {
    const [date, category] = PHOTO_META[figure.figure] ?? ['2026', 'other']
    await put({
      _id: `gallery-fig-${String(figure.figure).padStart(2, '0')}`,
      _type: 'galleryPhoto',
      title: figure.title,
      date,
      category,
      orderRank: rank(figure.figure),
      seed: 100 + figure.figure,
      hue: HUES[figure.figure % HUES.length],
      image: imageRef(assets.get(figure.figure)),
    })
  }

  // 3. Projects (photo-less ones fall back to generated artwork on the site).
  let order = 0
  for (const project of PROJECTS) {
    order += 1
    await put({
      _id: `project-${project.slug}`,
      _type: 'project',
      title: project.title,
      body: project.body,
      orderRank: rank(order),
      seed: 300 + order,
      hue: HUES[order % HUES.length],
      images: project.figures.filter((f) => assets.has(f)).map((f) => imageRef(assets.get(f))),
    })
  }

  // 4. Events and hero slides.
  for (const event of EVENTS) {
    await put({ _id: event.id, _type: 'event', date: event.date, when: event.when, title: event.title, place: event.place, body: event.body })
  }
  for (const [i, slide] of SLIDES.entries()) {
    await put({ _id: `heroSlide-${i + 1}`, _type: 'heroSlide', orderRank: rank(i + 1), ...slide })
  }

  // 5. Singletons. Values marked TODO are placeholders the club must replace in
  // the Studio (email also fails Studio validation until it is a real address).
  await put({
    _id: 'siteSettings',
    _type: 'siteSettings',
    short: 'HACK',
    name: 'Hardware Acceleration Club of KUET',
    university: 'Khulna University of Engineering & Technology',
    tagline: 'Learn hardware by building it.',
    description: 'The student club at KUET for embedded systems, robotics and IoT: workshops, hands-on assignments and member-built projects.',
    email: 'TODO — set in Studio',
    room: 'TODO — set in Studio',
    address: 'KUET, Fulbarigate, Khulna 9203',
    mapUrl: 'https://www.google.com/maps/search/?api=1&query=Khulna+University+of+Engineering+%26+Technology',
    meets: 'TODO — set in Studio',
    intake: 'TODO — set in Studio',
    intakeCloses: 'TODO — set in Studio',
    keywords: ['Embedded systems', 'Robotics', 'ROS 2', 'RTOS', 'Arduino', 'ESP32', 'Raspberry Pi', 'IoT', 'PCB design', 'Computer vision'],
  })

  await put({
    _id: 'homeStory',
    _type: 'homeStory',
    historyTitle: 'About HACK',
    historyLede: 'HACK is the student-led hardware club of KUET: embedded systems, robotics, IoT and prototyping, taught hands-on and built by members.',
    milestones: [],
    missionStatement: 'Enable KUET students to turn theoretical engineering coursework into working hardware, embedded systems and IoT prototypes.',
    missionItems: [
      { title: 'Bridge theory and practice', body: 'Apply concepts from coursework to tangible hardware, embedded systems and IoT prototypes.' },
      { title: 'Foster innovation and research', body: 'Drive student-led work in robotics, AI–hardware integration and autonomous systems.' },
      { title: 'Expand the collaborative ecosystem', body: 'Unite students across engineering departments and build inter-university collaborations.' },
      { title: 'Promote open knowledge sharing', body: 'Document and archive workshop materials, circuit designs and project repositories.' },
    ],
    visionStatement: 'A KUET where building real hardware is part of every engineering student’s education, and where student teams reach national and international competition stages.',
    visionItems: [
      { title: 'Kibo Robot Programming Challenge', body: 'Provide technical guidance, workshops and mentoring to prepare student teams.' },
      { title: 'Escape from Phobos', body: 'Encourage participation and team formation for the University Space Design Competition.' },
      { title: 'Real-world hardware and IoT', body: 'Develop practical projects that address local and industry challenges.' },
      { title: 'Campus-wide showcases', body: 'Organise hardware exhibitions and project showcases across KUET.' },
      { title: 'Expanded lab access', body: 'Secure more regular access to laboratory equipment and development kits.' },
      { title: 'Inter-university bootcamps', body: 'Organise joint workshops, robotics bootcamps and hardware hackathons.' },
      { title: 'Knowledge repositories', body: 'Maintain organised repositories of workshop materials, circuits and firmware.' },
    ],
  })

  await put({
    _id: 'registrationOptions',
    _type: 'registrationOptions',
    departments: ['CSE', 'EEE', 'ECE', 'ME', 'CE', 'IEM', 'BME', 'MSE', 'MTE', 'ESE', 'ChE', 'TE', 'LE', 'URP', 'BECM', 'Arch'],
    batches: ['2k25', '2k24', '2k23', '2k22', '2k21'],
    tracks: [
      { id: 'embedded', title: 'Embedded systems & microcontrollers', note: 'AVR/Arduino, ESP32, Raspberry Pi — sensors, firmware and control.' },
      { id: 'robotics', title: 'Robotics & simulation', note: 'ROS 2, RTOS task scheduling, Gazebo and motor control.' },
      { id: 'prototyping', title: 'Hardware prototyping', note: 'PCB design, sensor interfacing, motors and rapid prototyping.' },
      { id: 'ai', title: 'AI & software integration', note: 'Computer vision, edge AI and hardware–software protocols.' },
    ],
  })

  await put({
    _id: 'navigation',
    _type: 'navigation',
    items: [
      { key: 'about', label: 'About', blurb: 'How the club started and why it exists.' },
      { key: 'projects', label: 'Projects', blurb: 'Member-built hardware, robots and IoT systems.' },
      { key: 'achievements', label: 'Achievements', blurb: 'Contest results and published work.' },
      { key: 'events', label: 'Events', blurb: 'Workshops, sessions and what is coming next.' },
      { key: 'gallery', label: 'Gallery', blurb: 'Sessions, builds and contest days.' },
      { key: 'executive-board', label: 'Executive Board', blurb: 'The students running the club this year.' },
      { key: 'contact', label: 'Contact', blurb: 'Where to find us, and how to write.' },
    ],
  })

  console.log('Done:', counts)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
```

- [ ] **Step 4 (USER): run the import.**

```bash
cd ~/Documents/hack-report
SANITY_PROJECT_ID=<PROJECT_ID> SANITY_WRITE_TOKEN=sk... node import-to-sanity.mjs
```

Expected: 24 `uploaded figure` lines, then `Done: { heroSlide: 4, galleryPhoto: 24, project: 9, event: 7, siteSettings: 1, homeStory: 1, registrationOptions: 1, navigation: 1 }`.

- [ ] **Step 5: verify idempotency.** Run the same command again. Expected: same counts, no duplicates — open the Studio: Gallery shows 24 photos with captions, Projects 9 (EyeMech first), Events 7 (farewell last with a “update date” note), Hero slides 4, and the four pinned singletons.

- [ ] **Step 6: hand the follow-up list to the user** — values only they can supply (edit in the Studio):

  - `siteSettings`: email, room, weekly session time, intake label, intake closing date (all currently literal `TODO — set in Studio`; the email also fails Studio validation until replaced), and the founded year (optional, omit until known).
  - `event-farewell`: the real date.
  - `homeStory`: milestones are empty — add club history entries; refine history heading/lede if wanted.
  - `heroSlide`s: refine the four drafted slides.
  - Executive board members: not seeded (names unknown) — add once the committee is confirmed; each needs name, role, department, batch, and a portrait.
  - Achievements: empty on purpose; add when there are results.

No commit in this task — nothing in the repo changed.

---

### Task 6: Site chrome, metadata, sitemap and llms.txt read from Sanity

**Files:**
- Modify: `src/lib/seo.ts`, `src/components/Header.tsx`, `src/components/Footer.tsx`, `src/components/Page.tsx`, `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/manifest.ts`, `src/app/llms.txt/route.ts`
- Modify (metadata exports only): `src/app/page.tsx`, `src/app/events/page.tsx`, `src/app/achievements/page.tsx`, `src/app/gallery/page.tsx`, `src/app/executive-board/page.tsx`, `src/app/register/page.tsx`

**Interfaces:**
- Consumes: `getSiteSettings()`, `getNavigation()`, `getStory()`, `getRegistrationOptions()`, `getEvents()`, `getAchievements()`, `getTeam()`, `getGallery()`; `mergeNavigation()` output (`Section[]`).
- Produces: `pageMeta({ title, description, path, club })`; `organizationLd(club: SiteSettings)`; `websiteLd(club: SiteSettings)`; `Header({ club, nav })`; `Footer({ club, nav })`; async `Page` (signature otherwise unchanged — it now fetches navigation itself); every page exports `generateMetadata` instead of a static `metadata` object. Page meta descriptions become generic code templates over Sanity values (no club-specific claims left in code).

- [ ] **Step 1: `src/lib/seo.ts`.** Replace the `club` import and the three data-carrying exports; keep `orgId`, `websiteId`, `breadcrumbLd`, `JsonLdScript` unchanged.

```ts
import type { Metadata } from 'next'
import type { SiteSettings } from './types'
import { siteUrl } from './site'

export const orgId = `${siteUrl}/#organization`
export const websiteId = `${siteUrl}/#website`

type MetaClub = Pick<SiteSettings, 'short' | 'name'>

/** Per-route metadata: unique title and description, canonical URL, and matching social cards. */
export function pageMeta({
  title,
  description,
  path,
  club,
}: {
  title: string
  description: string
  path: string
  club: MetaClub
}): Metadata {
  const url = path === '/' ? '/' : `${path}/`
  const fullTitle = path === '/' ? title : `${title} | ${club.short}, KUET`
  return {
    title: path === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      siteName: club.name,
      locale: 'en_BD',
      title: fullTitle,
      description,
      url,
    },
    twitter: { card: 'summary', title: fullTitle, description },
  }
}

export function organizationLd(club: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'EducationalOrganization'],
    '@id': orgId,
    name: club.name,
    alternateName: [club.short, 'HACK KUET'],
    url: `${siteUrl}/`,
    logo: { '@type': 'ImageObject', url: `${siteUrl}/logo.png`, width: 383, height: 286 },
    image: `${siteUrl}/opengraph-image.jpg`,
    description: club.description,
    slogan: club.tagline,
    ...(club.founded ? { foundingDate: String(club.founded) } : {}),
    email: club.email,
    knowsAbout: club.keywords,
    parentOrganization: {
      '@type': 'CollegeOrUniversity',
      name: club.university,
      alternateName: 'KUET',
      url: 'https://www.kuet.ac.bd/',
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.room,
      addressLocality: 'Khulna',
      postalCode: '9203',
      addressCountry: 'BD',
    },
    contactPoint: { '@type': 'ContactPoint', contactType: 'membership enquiries', email: club.email, availableLanguage: ['en', 'bn'] },
  }
}

export function websiteLd(club: SiteSettings) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': websiteId,
    url: `${siteUrl}/`,
    name: club.name,
    alternateName: club.short,
    description: club.description,
    inLanguage: 'en',
    publisher: { '@id': orgId },
  }
}
```

- [ ] **Step 2: `src/app/layout.tsx`.** Replace the `club` import with `getSiteSettings`/`getNavigation`, convert the static `metadata` export to `generateMetadata`, make the layout async, and pass props down. Keep fonts, `viewport`, scripts and JSON-LD structure; JSON-LD now calls `organizationLd(club)` / `websiteLd(club)`:

```tsx
import { getNavigation, getSiteSettings } from '@/lib/content'
// …existing imports, minus '@/data/club'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return {
    metadataBase: new URL(siteUrl),
    title: { default: `${club.short}: ${club.name}`, template: `%s | ${club.short}, KUET` },
    description: club.description,
    applicationName: club.short,
    authors: [{ name: club.name, url: siteUrl }],
    creator: club.name,
    publisher: club.name,
    category: 'education',
    keywords: club.keywords,
    formatDetection: { telephone: false },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1, 'max-video-preview': -1 },
    },
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [club, nav] = await Promise.all([getSiteSettings(), getNavigation()])
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        {/* …unchanged: script, LazyBackground, skip link… */}
        <Header club={club} nav={nav} />
        <main id="main">{children}</main>
        <Footer club={club} nav={nav} />
        <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(organizationLd(club))} />
        <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(websiteLd(club))} />
      </body>
    </html>
  )
}
```

- [ ] **Step 3: `src/components/Header.tsx`.** Convert from data imports to props — only the signature and the `club`/`nav` references change; keep the dev banner until Task 11:

```tsx
import type { Section, SiteSettings } from '@/lib/types'
// …
export function Header({ club, nav }: { club: SiteSettings; nav: Section[] }) {
```

Inside, `nav` items already carry `href`, `label`, `addr` — the two `nav.map` blocks and the brand/logo references need no other change.

- [ ] **Step 4: `src/components/Footer.tsx`.** Same treatment:

```tsx
import type { Section, SiteSettings } from '@/lib/types'
// …
export function Footer({ club, nav }: { club: SiteSettings; nav: Section[] }) {
```

- [ ] **Step 5: `src/components/Page.tsx`.** Make it async and self-sufficient: fetch navigation, keep the pager over route sections only, and guard the unknown-path case:

```tsx
import { getNavigation } from '@/lib/content'
// …
export async function Page({ path, title, lede, jsonLd, children }: {
  path: string
  title: string
  lede?: string
  jsonLd?: object
  children: ReactNode
}) {
  const routes = (await getNavigation()).filter((section) => section.href.startsWith('/'))
  const index = routes.findIndex((item) => item.href === path)
  const current = routes[index] ?? { key: path, href: path, addr: '0x00', label: title }
  const prev = routes[index - 1] ?? { href: '/', label: 'Home' }
  const next = routes[index + 1] ?? { href: '/register', label: 'Register' }
  // …unchanged JSX
}
```

- [ ] **Step 6: `src/app/sitemap.ts`.** Use the code-side section list (adds `/projects` automatically in Task 8):

```ts
import type { MetadataRoute } from 'next'
import { routeSections } from '@/lib/sections'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    { url: `${siteUrl}/register/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    ...routeSections().map((item) => ({
      url: `${siteUrl}${item.href}/`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
```

- [ ] **Step 7: `src/app/manifest.ts`.**

```ts
import type { MetadataRoute } from 'next'
import { getSiteSettings } from '@/lib/content'

export const dynamic = 'force-static'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const club = await getSiteSettings()
  return {
    name: club.name,
    short_name: club.short,
    description: club.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1672c4',
    icons: [{ src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' }],
  }
}
```

- [ ] **Step 6b: `src/app/llms.txt/route.ts`.** Full replacement; every section tolerates empty collections:

```ts
import { getAchievements, getEvents, getProjects, getRegistrationOptions, getSiteSettings, getStory, getTeam } from '@/lib/content'
import { siteUrl } from '@/lib/site'

export const dynamic = 'force-static'

// /llms.txt: a plain-Markdown summary of the site for language models and AI crawlers,
// generated from the same Sanity documents the pages use so it can never drift from them.
export async function GET() {
  const [club, story, options, achievements, events, team, projects] = await Promise.all([
    getSiteSettings(),
    getStory(),
    getRegistrationOptions(),
    getAchievements(),
    getEvents(),
    getTeam(),
    getProjects(),
  ])

  const founded = club.founded ? ` Founded in ${club.founded}.` : ''
  const lines = (items: string[], empty: string) => (items.length ? items.join('\n') : empty)

  const body = `# ${club.name} (${club.short})

> ${club.description} Based at ${club.university}, Khulna, Bangladesh.${founded}

## Key facts

- Full name: ${club.name}
- Short name: ${club.short}
- University: ${club.university} (KUET)
- Location: ${club.room}, ${club.address}
- Weekly sessions: ${club.meets}
- Membership: free, open to students of every KUET department, no experience required
- Current intake: ${club.intake}, closes ${club.intakeCloses}
- Contact: ${club.email}

## What members work on

${lines(options.tracks.map((t) => `- ${t.title}: ${t.note}`), '- (to be announced)')}

## Mission

${story.mission.statement}

${lines(story.mission.items.map((c) => `- ${c.title}: ${c.body}`), '')}

## Vision

${story.vision.statement}

${lines(story.vision.items.map((g) => `- ${g.title}: ${g.body}`), '')}

## History

${lines(story.history.milestones.map((m) => `- ${m.year}, ${m.title}: ${m.body}`), '- (to be announced)')}

## Projects

${lines(projects.map((p) => `- ${p.title}: ${p.body}`), '- (to be announced)')}

## Achievements

${lines(achievements.map((a) => `- ${a.year}: ${a.title}. ${a.result}, ${a.event}.`), 'None published yet.')}

## Events

${lines(events.map((e) => `- ${e.when}: ${e.title}, ${e.place}. ${e.body}`), 'None announced yet.')}

## Executive Board

${lines(team.map((m) => `- ${m.title}: ${m.name} (${m.department}, batch ${m.batch})`), 'To be announced.')}

## Pages

- [Home](${siteUrl}/): overview of the club
- [Projects](${siteUrl}/projects/): member-built hardware, robots and IoT systems
- [Achievements](${siteUrl}/achievements/): contest results and published work
- [Events](${siteUrl}/events/): workshops, sprints and what is coming next
- [Gallery](${siteUrl}/gallery/): sessions, builds and contest days
- [Executive Board](${siteUrl}/executive-board/): the students running the club this year
- [Register](${siteUrl}/register/): join the club
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
```

- [ ] **Step 8: page metadata handoff.** In each page below, replace the static `export const metadata = pageMeta({...})` with an async `generateMetadata`, add `import type { Metadata } from 'next'` where missing, and keep the rest of the file untouched for now (bodies still render from `@/data/club` until their own task). The pattern:

```tsx
export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({ title: '…', description: '…', path: '…', club })
}
```

with, per file — note the descriptions are now generic templates over Sanity values (the old copy claimed FPGA/Verilog/GPU work the real club does not do):

| File | title | description | path |
|---|---|---|---|
| `src/app/page.tsx` | `` `${club.short}: ${club.name} \| Embedded systems, robotics and IoT at KUET` `` | `club.description` | `/` |
| `src/app/events/page.tsx` | `'Events'` | `` `Upcoming and past events from ${club.name}: workshops, sessions and project showcases at KUET.` `` | `/events` |
| `src/app/achievements/page.tsx` | `'Achievements'` | `` `Contest results and published work from ${club.short}, KUET.` `` | `/achievements` |
| `src/app/gallery/page.tsx` | `'Photo gallery'` | `` `Photos from ${club.name}: workshops, builds and club events at KUET.` `` | `/gallery` |
| `src/app/executive-board/page.tsx` | `'Executive Board'` | `` `The Executive Board of ${club.name}: the students running the club this year.` `` | `/executive-board` |
| `src/app/register/page.tsx` | `'Register'` | `` `Join ${club.name}. Registration for the ${club.intake} is free, open to every KUET department, and closes ${club.intakeCloses}.` `` | `/register` |

- [ ] **Step 9: verify.**

```bash
npm run typecheck
npm run build
grep -o "Learn hardware by building it." out/index.html          # footer tagline comes from Sanity
grep -o "None published yet." out/llms.txt                        # achievements empty state in llms.txt
grep -o "/achievements/" out/sitemap.xml                          # sitemap still lists sections
NEXT_PUBLIC_SANITY_PROJECT_ID= npm run build                      # expected: FAIL with "Missing Sanity configuration…" naming both vars
NEXT_PUBLIC_SANITY_DATASET=staging npm run build                  # expected: FAIL with 'Sanity: the "Site settings" document is missing…'
```

The two failure builds must fail fast with those exact messages — that is Review Focus #1 and #4 covered.

- [ ] **Step 10: commit.**

```bash
git add -A
git commit -m "refactor: read site chrome, metadata, sitemap and llms.txt from Sanity"
```

---

### Task 7: Home page and hero carousel from Sanity

**Files:**
- Modify: `src/app/page.tsx` (body), `src/components/HeroCarousel.tsx`

**Interfaces:**
- Consumes: `getSiteSettings()`, `getSlides()`, `getStory()`, `getNavigation()`.
- Produces: `HeroCarousel({ slides }: { slides: Slide[] })` — client component, all data by props; empty slide list renders nothing instead of crashing.

- [ ] **Step 1: `src/components/HeroCarousel.tsx`.** Replace the `slides` import with a prop and add the guard. Keep every existing hook and handler; add `if (!slides.length) return null` immediately before the main `return (` (after all hooks, so hook order never changes):

```tsx
import type { Slide } from '@/lib/types'
// …
export function HeroCarousel({ slides }: { slides: Slide[] }) {
  // …all existing state/refs/handlers unchanged…
  if (!slides.length) return null
  return (
    // …existing JSX unchanged…
  )
}
```

- [ ] **Step 2: `src/app/page.tsx` body.** Replace the `@/data/club` imports with the fetchers and thread the values through. The `generateMetadata` from Task 6 stays. Full body head:

```tsx
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { HeroCarousel } from '@/components/HeroCarousel'
import { Reveal } from '@/components/motion'
import { SectionHead } from '@/components/ui'
import { getNavigation, getSiteSettings, getSlides, getStory } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata() {
  const club = await getSiteSettings()
  return pageMeta({
    title: `${club.short}: ${club.name} | Embedded systems, robotics and IoT at KUET`,
    description: club.description,
    path: '/',
    club,
  })
}

export default async function HomePage() {
  const [club, slides, story, nav] = await Promise.all([
    getSiteSettings(),
    getSlides(),
    getStory(),
    getNavigation(),
  ])
  const sections = nav.filter((item) => item.href.startsWith('/'))
  return (
    <>
      <HeroCarousel slides={slides} />
      {/* History: story.history.title / .lede; milestones rendered only when present */}
      {/* Mission: story.mission.statement / .items (key c.title) */}
      {/* Vision: story.vision.statement / .items (key g.title) */}
      {/* Explore: sections.map — item.href / item.addr / item.label / item.blurb */}
      {/* Contact: club.intake / club.intakeCloses / club.email / club.mapUrl / club.room / club.address / club.meets */}
    </>
  )
}
```

Concrete substitutions inside the JSX (everything else byte-identical):

| Current | Replace with |
|---|---|
| `<HeroCarousel />` | `<HeroCarousel slides={slides} />` |
| `history.title` / `history.lede` | `story.history.title` / `story.history.lede` |
| `{history.milestones.map(...)}` | wrap in `{story.history.milestones.length > 0 && (<ol className="timeline">…{story.history.milestones.map(...)}</ol>)}` — the `<ol>` wrapper is omitted when empty |
| `mission.statement` / `mission.commitments.map` | `story.mission.statement` / `story.mission.items.map` |
| `vision.statement` / `vision.goals.map` | `story.vision.statement` / `story.vision.items.map` |
| `routes.map(...)` in the Explore section | `sections.map(...)` |
| contact `addr="0x09"` | `addr="0x0A"` (register takes 0x0B; see `src/lib/sections.ts`) |

- [ ] **Step 3: verify against real data.**

```bash
npm run typecheck
npm run build
grep -o "Hands-on hardware, from first principles." out/index.html     # slide 1 title from Sanity
grep -o "About HACK" out/index.html                                     # history heading from Sanity
grep -o "Enable KUET students" out/index.html                           # mission statement from Sanity
```

Then Review Focus #2 — the empty-slides guard: delete all four hero slides in the Studio (they are restored by re-running the import script), run `npm run build`, and confirm the build succeeds and home renders without the hero section (no crash, no `NaN`). Restore the slides:

```bash
cd ~/Documents/hack-report && SANITY_PROJECT_ID=<PROJECT_ID> SANITY_WRITE_TOKEN=sk... node import-to-sanity.mjs
```

- [ ] **Step 4: commit.**

```bash
git add src/app/page.tsx src/components/HeroCarousel.tsx
git commit -m "refactor: home page renders hero, story and contact from Sanity"
```

---

### Task 8: The Projects section

**Files:**
- Create: `src/app/projects/page.tsx`
- Modify: `src/lib/sections.ts` (one line), `src/styles/pages.css` (append a block)

**Interfaces:**
- Consumes: `getProjects()`, `Page`, `Reveal`, `Media`, `EmptyState`, `pageMeta`.
- Produces: `/projects` route; the `projects` entry in `ROUTE_DEFS` (nav + sitemap + pager pick it up automatically).

- [ ] **Step 1: enable the route in `src/lib/sections.ts`.** Insert between the `about` and `achievements` entries of `ROUTE_DEFS`, matching the address map:

```ts
  { key: 'projects', href: '/projects', addr: '0x05', label: 'Projects', blurb: 'Member-built hardware, robots and IoT systems.' },
```

- [ ] **Step 2: create `src/app/projects/page.tsx`.**

```tsx
import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState, Media } from '@/components/ui'
import { getProjects, getSiteSettings } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Projects',
    description: `Member-built hardware from ${club.name}: embedded systems, robotics and IoT projects.`,
    path: '/projects',
    club,
  })
}

export default async function ProjectsPage() {
  const projects = await getProjects()
  return (
    <Page
      path="/projects"
      title="Built by members, on real benches."
      lede="Robots, wearables, monitoring systems and other devices HACK members have designed and prototyped."
    >
      {projects.length ? (
        <ul className="projects page-body">
          {projects.map((project, i) => (
            <Reveal as="li" key={project.id} delay={i * 60}>
              <article className="project">
                <div className="project__frame">
                  <Media image={project.images[0]} alt={project.title} seed={project.seed} hue={project.hue} />
                </div>
                <h2>{project.title}</h2>
                <p>{project.body}</p>
                {project.images.length > 1 && (
                  <div className="project__more">
                    {project.images.slice(1).map((src) => (
                      <img key={src} className="media" src={src} alt="" loading="lazy" decoding="async" />
                    ))}
                  </div>
                )}
                {project.links.length > 0 && (
                  <div className="project__links">
                    {project.links.map((link) => (
                      <a key={link.url} className="btn btn--secondary btn--sm" href={link.url} target="_blank" rel="noreferrer">
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="No projects published yet" body="Member projects will appear here as they are documented." />
      )}
    </Page>
  )
}
```

- [ ] **Step 3: append project styles to `src/styles/pages.css`** (same tokens as the existing `.mosaic`/`.team` blocks):

```css
/* ---- Projects ---- */

.projects {
  display: grid;
  gap: var(--s-7) var(--s-6);
}

@media (min-width: 760px) {
  .projects {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.project__frame {
  aspect-ratio: 16 / 10;
  border-radius: var(--r-sm);
  overflow: hidden;
  background: var(--bg-tint);
}

.project h2 {
  margin-top: var(--s-4);
}

.project p {
  margin-top: var(--s-2);
  color: var(--ink-2);
}

.project__more {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--s-4);
  margin-top: var(--s-4);
}

.project__more .media {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--r-sm);
}

.project__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--s-3);
  margin-top: var(--s-4);
}
```

- [ ] **Step 4: verify.**

```bash
npm run typecheck
npm run build
grep -o "EyeMech" out/projects/index.html                            # real project in built HTML
grep -o "Eyewear Assistance System" out/projects/index.html          # photo-less project still renders
grep -o "die-[a-z]*-3" out/projects/index.html | head -3             # generated artwork for photo-less projects (Review Focus #3)
grep -o "/projects/" out/sitemap.xml                                 # sitemap picked the route up
grep -o ">Projects<" out/projects/index.html                         # nav item (label from Sanity)
```

- [ ] **Step 5: commit.**

```bash
git add src/app/projects src/lib/sections.ts src/styles/pages.css
git commit -m "feat: add the Projects section reading from Sanity"
```

### Task 9: Events, achievements, gallery and board pages from Sanity

**Files:**
- Modify: `src/app/events/page.tsx`, `src/app/achievements/page.tsx`, `src/app/gallery/page.tsx`, `src/app/executive-board/page.tsx`, `src/components/EventsView.tsx`

**Interfaces:**
- Consumes: `getEvents()`, `getAchievements()`, `getGallery()`, `getTeam()`, `getSiteSettings()`.
- Produces: `EventsView({ initialUpcoming, initialPast, allEvents, meets }: { …; meets: string })` — the only component signature change; `TeamGrid` and `Media` are already prop-driven and stay untouched.

- [ ] **Step 1: `src/components/EventsView.tsx`.** Replace the `@/data/club` import with the `ClubEvent` type from `@/lib/types`, add the `meets` prop, and use it in the empty state:

```tsx
import type { ClubEvent } from '@/lib/types'
// …
export function EventsView({ initialUpcoming, initialPast, allEvents, meets }: {
  initialUpcoming: ClubEvent[]
  initialPast: ClubEvent[]
  allEvents: ClubEvent[]
  meets: string
}) {
  // …state/effects unchanged…
  // empty state:
  //   body={`Weekly sessions still run ${meets}. New events are announced to members first.`}
}
```

- [ ] **Step 2: replace `src/app/events/page.tsx` entirely.**

```tsx
import type { Metadata } from 'next'
import { EventsView } from '@/components/EventsView'
import { Page } from '@/components/Page'
import { getEvents, getSiteSettings } from '@/lib/content'
import { orgId, pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Events',
    description: `Upcoming and past events from ${club.name}: workshops, sessions and project showcases at KUET.`,
    path: '/events',
    club,
  })
}

export default async function EventsPage() {
  const [club, events] = await Promise.all([getSiteSettings(), getEvents()])

  // Build-time split for initial HTML and Event JSON-LD structured data.
  const today = new Date().toISOString().slice(0, 10)
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))
  const past = events.filter((e) => e.date < today).sort((a, b) => b.date.localeCompare(a.date))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': upcoming.map((e) => ({
      '@type': 'EducationEvent',
      name: e.title,
      description: e.body,
      startDate: e.date,
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      isAccessibleForFree: true,
      location: {
        '@type': 'Place',
        name: e.place,
        address: { '@type': 'PostalAddress', addressLocality: 'Khulna', postalCode: '9203', addressCountry: 'BD' },
      },
      organizer: { '@id': orgId },
    })),
  }

  return (
    <Page
      path="/events"
      title="What is on, and what was."
      lede="Every event is free for KUET students. Members get first claim on hardware."
      jsonLd={upcoming.length ? jsonLd : undefined}
    >
      <EventsView initialUpcoming={upcoming} initialPast={past} allEvents={events} meets={club.meets} />
    </Page>
  )
}
```

- [ ] **Step 3: replace `src/app/gallery/page.tsx` entirely.** (The old title claimed “Thursdays in Room 304”, which is mock copy no longer known to be true.)

```tsx
import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState, Media } from '@/components/ui'
import { getGallery, getSiteSettings } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Photo gallery',
    description: `Photos from ${club.name}: workshops, builds and club events at KUET.`,
    path: '/gallery',
    club,
  })
}

export default async function GalleryPage() {
  const gallery = await getGallery()
  return (
    <Page
      path="/gallery"
      title="Workshops, builds and club days."
      lede="Photos from the club’s sessions, projects and ceremonies."
    >
      {gallery.length ? (
        <ul className="mosaic">
          {gallery.map((photo, i) => (
            <Reveal as="li" key={photo.id} delay={(i % 2) * 80}>
              <figure>
                <div className="mosaic__frame">
                  <Media image={photo.image} alt={photo.title} seed={photo.seed} hue={photo.hue} />
                </div>
                <figcaption>
                  {photo.title}
                  <span>{photo.date}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="No photos yet" body="Photos from sessions, builds and club events will appear here." />
      )}
    </Page>
  )
}
```

- [ ] **Step 4: replace `src/app/achievements/page.tsx` entirely.**

```tsx
import type { Metadata } from 'next'
import { Reveal } from '@/components/motion'
import { Page } from '@/components/Page'
import { EmptyState } from '@/components/ui'
import { getAchievements, getSiteSettings } from '@/lib/content'
import { pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Achievements',
    description: `Contest results and published work from ${club.short}, KUET.`,
    path: '/achievements',
    club,
  })
}

export default async function AchievementsPage() {
  const [club, achievements] = await Promise.all([getSiteSettings(), getAchievements()])

  const jsonLd = achievements.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${club.name} achievements`,
        itemListElement: achievements.map((a, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: `${a.title} (${a.result}, ${a.year})`,
          description: a.event,
        })),
      }
    : undefined

  return (
    <Page
      path="/achievements"
      title="Work that left the lab."
      lede="Results from contests and conferences our members have taken their hardware to."
      jsonLd={jsonLd}
    >
      {achievements.length ? (
        <ul className="rows results page-body">
          {achievements.map((a, i) => (
            <Reveal as="li" key={a.id} delay={i * 60}>
              <span className="results__year">{a.year}</span>
              <div>
                <h2>{a.title}</h2>
                <p>{a.event}</p>
              </div>
              <span className="results__result">{a.result}</span>
            </Reveal>
          ))}
        </ul>
      ) : (
        <EmptyState title="No results published yet" body="Contest results and published work will appear here." />
      )}
    </Page>
  )
}
```

- [ ] **Step 5: replace `src/app/executive-board/page.tsx` entirely.**

```tsx
import type { Metadata } from 'next'
import { Page } from '@/components/Page'
import { TeamGrid } from '@/components/TeamGrid'
import { EmptyState } from '@/components/ui'
import { getSiteSettings, getTeam } from '@/lib/content'
import { orgId, pageMeta } from '@/lib/seo'

export async function generateMetadata(): Promise<Metadata> {
  const club = await getSiteSettings()
  return pageMeta({
    title: 'Executive Board',
    description: `The Executive Board of ${club.name}: the students running the club this year.`,
    path: '/executive-board',
    club,
  })
}

export default async function ExecutiveBoardPage() {
  const [club, team] = await Promise.all([getSiteSettings(), getTeam()])

  const jsonLd = team.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': orgId,
        member: team.map((m) => ({
          '@type': 'Person',
          name: m.name,
          jobTitle: m.title,
          affiliation: { '@type': 'CollegeOrUniversity', name: club.university },
        })),
      }
    : undefined

  return (
    <Page
      path="/executive-board"
      title="The people running HACK."
      lede="This year’s Executive Board. Hover or tap a portrait for name, title, department and batch."
      jsonLd={jsonLd}
    >
      {team.length ? (
        <TeamGrid members={team} />
      ) : (
        <EmptyState title="The board is being formed" body="Executive board profiles will appear here once the committee is confirmed." />
      )}
    </Page>
  )
}
```

- [ ] **Step 6: verify.**

```bash
npm run typecheck
npm run build
grep -o "HACK IGNITION 2K25" out/events/index.html            # real event from Sanity
grep -o "Nothing on the calendar yet" out/events/index.html   # all imported events are past → upcoming empty state
grep -o "No results published yet" out/achievements/index.html
grep -o "The board is being formed" out/executive-board/index.html
grep -o "Introduction to ROS 2 architecture" out/gallery/index.html   # manifest caption
grep -o "cdn.sanity.io" out/gallery/index.html | head -1              # images served from the CDN
```

- [ ] **Step 7: commit.**

```bash
git add src/app/events src/app/achievements src/app/gallery src/app/executive-board src/components/EventsView.tsx
git commit -m "refactor: events, achievements, gallery and board pages read from Sanity"
```

---

### Task 10: Registration flow options from Sanity

**Files:**
- Modify: `src/lib/registration.ts`, `src/components/RegisterForm.tsx`, `src/components/MemberPass.tsx`, `src/app/register/page.tsx`

**Interfaces:**
- Consumes: `getRegistrationOptions()`, `getSiteSettings()`, `REGISTER_ADDR`.
- Produces: `validateField(field, v, options)`, `validate(v, options)`, `isIssuedPass(obj, options)`, `loadPass(options)` — all take `RegistrationOptions`; `RegisterForm({ club, options })`; `MemberPass({ data, issued, tracks })`. `Registration.track` becomes plain `string`.

- [ ] **Step 1: `src/lib/registration.ts`.** Remove the `@/data/club` import; import `type { RegistrationOptions } from '@/lib/types'`. Delete the `TrackId` type (`Registration.track: string`). Change the four functions to accept the options:

```ts
export type Registration = {
  name: string
  roll: string
  department: string
  batch: string
  email: string
  phone: string
  track: string
  note: string
}
// …
export function validateField(field: keyof Registration, v: Registration, options: RegistrationOptions): string | undefined {
  switch (field) {
    // …unchanged cases for name, roll, email, phone, note…
    case 'department':
      if (!options.departments.includes(v.department)) return 'Choose your department.'
      return
    case 'batch':
      if (!options.batches.includes(v.batch)) return 'Choose your batch.'
      return
    case 'track':
      if (!options.tracks.some((t) => t.id === v.track)) return 'Pick the track you want to start with.'
      return
  }
}

export function validate(v: Registration, options: RegistrationOptions): Errors {
  const errors: Errors = {}
  for (const field of Object.keys(v) as (keyof Registration)[]) {
    const message = validateField(field, v, options)
    if (message) errors[field] = message
  }
  return errors
}

export function isIssuedPass(obj: unknown, options: RegistrationOptions): obj is IssuedPass {
  // …unchanged checks except:
  //   options.departments.includes(p.department)
  //   options.batches.includes(p.batch)
  //   options.tracks.some((t) => t.id === p.track)
}

export function loadPass(options: RegistrationOptions): IssuedPass | null {
  // …unchanged body, calling isIssuedPass(parsed, options)…
}
```

- [ ] **Step 2: `src/components/RegisterForm.tsx`.** Replace the `@/data/club` import and thread the options through:

```tsx
import type { RegistrationOptions, SiteSettings } from '@/lib/types'
// …
export function RegisterForm({ club, options }: { club: SiteSettings; options: RegistrationOptions }) {
  // …
  useEffect(() => {
    const saved = loadPass(options)
    setPass(saved)
    setStatus(saved ? 'issued' : 'form')
  }, [options])
```

Every other call site inside this file changes mechanically: `validateField(field, next)` → `validateField(field, next, options)`; `validateField(field, values)` → `validateField(field, values, options)`; `validate(values)` → `validate(values, options)`; `departments.map` → `options.departments.map`; `batches.map` → `options.batches.map`; `tracks.map` → `options.tracks.map`. The focus-by-id line stays: `const target = first === 'track' ? \`reg-track-${options.tracks[0]?.id ?? ''}\` : \`reg-${first}\``. The two `<MemberPass … />` usages gain `tracks={options.tracks}`.

- [ ] **Step 3: `src/components/MemberPass.tsx`.** Take tracks by prop:

```tsx
import type { Track } from '@/lib/types'
// …
export function MemberPass({ data, issued, tracks }: { data: Registration; issued: boolean; tracks: Track[] }) {
  // …unchanged except: const track = tracks.find((t) => t.id === data.track)
}
```

- [ ] **Step 4: `src/app/register/page.tsx` body.** Fetch both documents, pass props, and use the register address constant:

```tsx
export default async function RegisterPage() {
  const [club, options] = await Promise.all([getSiteSettings(), getRegistrationOptions()])
  return (
    <article className="page-top" aria-labelledby="register-title">
      <div className="wrap">
        <header className="page-head">
          <nav className="crumbs" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link href="/">Home</Link>
              </li>
              <li aria-current="page">
                <span className="crumbs__addr">{REGISTER_ADDR}</span>Register
              </li>
            </ol>
          </nav>
          <Typewriter id="register-title" text="Join HACK." />
          <Reveal>
            <p className="lede">
              Open to every KUET department, no experience needed. {club.intake} closes {club.intakeCloses}.
            </p>
          </Reveal>
        </header>
        <RegisterForm club={club} options={options} />
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={JsonLdScript(breadcrumbLd('/register', 'Register'))} />
    </article>
  )
}
```

Imports: `getRegistrationOptions`, `getSiteSettings` from `@/lib/content`; `REGISTER_ADDR` from `@/lib/sections`. (`generateMetadata` from Task 6 stays.)

- [ ] **Step 5: verify.**

```bash
npm run typecheck
npm run build
grep -o "Embedded systems &amp; microcontrollers" out/register/index.html   # track title from Sanity in built HTML
grep -o "2k25" out/register/index.html                                      # batch option from Sanity
```

Then run `npm run dev` and walk the flow manually: dropdowns show the 16 departments / 5 batches / 4 tracks; submitting issues a pass; the pass shows the chosen track title. Review Focus #5 — a stored pass with a track id that no longer exists is cleared instead of crashing: open /register, run in the browser console

```js
localStorage.setItem('hack:pass:v1', JSON.stringify({ id: 'HACK-25-00001', name: 'Test User', roll: '2500001', department: 'CSE', batch: '2k25', email: 'test@example.com', phone: '', track: 'fpga', note: '', issuedAt: new Date().toISOString() }))
```

reload → the form appears (stale pass discarded) with no crash.

- [ ] **Step 6: commit.**

```bash
git add src/app/register src/components/RegisterForm.tsx src/components/MemberPass.tsx src/lib/registration.ts
git commit -m "refactor: registration options and member pass come from Sanity"
```

---

### Task 11: Delete the demo data, drop the banner, document the workflow

**Files:**
- Delete: `src/data/club.ts` (and the now-empty `src/data/` directory)
- Modify: `src/components/Header.tsx`, `src/styles/tokens.css`, `src/styles/components.css`
- Replace: `README.md`

**Interfaces:**
- Consumes: nothing new — this task completes the “no data in the repo” guarantee.
- Produces: a repo where a `git grep` for club content finds only schemas, generic code templates, and fallback labels.

- [ ] **Step 1: delete the mock data.** Nothing should import it anymore:

```bash
git grep -l "@/data/club"   # expect no output; if a file remains, migrate it first
rm src/data/club.ts
rmdir src/data 2>/dev/null
```

- [ ] **Step 2: remove the development banner** from `src/components/Header.tsx` — delete exactly these lines inside the `<header>` (they sit between the opening `<header …>` tag and `<div className="wrap header__in">`):

```tsx
      <div className="dev-banner" role="status" aria-label="Development site announcement">
        <div className="dev-banner__in">
          <span className="dev-banner__badge">Under Development</span>
          <span>This site is currently in active development. Displayed content and member details are placeholder data.</span>
        </div>
      </div>
```

- [ ] **Step 3: retire the banner’s height token.** In `src/styles/tokens.css` replace:

```css
  --banner-h: 36px;
  --header-h: calc(64px + var(--banner-h));
```

with:

```css
  --header-h: 64px;
```

- [ ] **Step 4: delete the banner styles.** In `src/styles/components.css`, remove the whole block from `/* ---- Dev Banner ---- */` through the closing brace of `.dev-banner__badge` (about 40 lines; the next rule is `/* ---- Header ---- */`).

- [ ] **Step 5: replace `README.md`** with:

```md
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
```

- [ ] **Step 6: final sweep for stale content and boundary violations.**

```bash
git grep -n "@/data/club"                       # expect nothing
grep -rniE "fpga|verilog|gpu|cuda|risc-v|room 304|thursdays" src/   # expect nothing; if a hit is copy, fix it in the owning component
grep -rn "dev-banner" src/                      # expect nothing
grep -rln "from '@/lib/content'\|from '@/lib/sanity'" src/components   # expect only src/components/Page.tsx
```

- [ ] **Step 7: verify.**

```bash
npm run typecheck
npm run build
grep -o "Hands-on hardware, from first principles." out/index.html   # still building from Sanity
```

Then `npm run dev` and eyeball the header: no banner, no gap — the fixed header sits flush at the top of the page.

- [ ] **Step 8: commit.**

```bash
git add -A
git commit -m "chore: move all club content to Sanity, remove demo data and development banner"
```

---

### Task 12: CI environment, publish webhook, end-to-end check

**Files:**
- Modify: `.github/workflows/deploy.yml`
- User inputs needed: repository Actions variables, a fine-grained GitHub PAT, a Sanity webhook

**Interfaces:**
- Consumes: everything built above.
- Produces: the full loop — Studio publish → webhook → GitHub `repository_dispatch` → rebuild → live site (~2–3 minutes).

- [ ] **Step 1: `.github/workflows/deploy.yml`.** Two edits. Add the dispatch trigger to the `on:` block:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
  repository_dispatch:
    types: [sanity-publish]
```

and add the variables to the build step’s `env`:

```yaml
      - name: Build Next.js static export
        run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://hackuet.github.io
          NEXT_PUBLIC_SANITY_PROJECT_ID: ${{ vars.NEXT_PUBLIC_SANITY_PROJECT_ID }}
          NEXT_PUBLIC_SANITY_DATASET: ${{ vars.NEXT_PUBLIC_SANITY_DATASET }}
```

Everything else in the file stays as is.

- [ ] **Step 2 (USER): add repository variables.** GitHub → the repo → **Settings → Secrets and variables → Actions → Variables → New repository variable**, twice:

  - `NEXT_PUBLIC_SANITY_PROJECT_ID` = `<PROJECT_ID>`
  - `NEXT_PUBLIC_SANITY_DATASET` = `production`

- [ ] **Step 3 (USER): create a fine-grained PAT.** GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token**:

  - Name: `sanity rebuild webhook`; expiration: 1 year (set a reminder to rotate it).
  - Repository access: **Only select repositories → hackuet/hackuet.github.io**.
  - Permissions: **Contents → Read and write** (nothing else).
  - Copy the token (starts with `github_pat_`).

- [ ] **Step 4 (USER): create the Sanity webhook.** sanity.io/manage → HACK KUET → **API → Webhooks → Create webhook**:

  - Name: `Rebuild site`
  - URL: `https://api.github.com/repos/hackuet/hackuet.github.io/dispatches`
  - Dataset: `production`
  - Trigger on: **Create, Update, Delete**
  - Filter: `!(_id in path("drafts.**"))`
  - HTTP method: **POST**
  - HTTP headers: `Authorization: Bearer <PAT>` and `Accept: application/vnd.github+json`
  - HTTP body: `{"event_type": "sanity-publish"}`

  Save. (Leave API-version/secret fields at their defaults.)

- [ ] **Step 5: commit the workflow change.**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: rebuild the site when content is published in Sanity"
```

- [ ] **Step 6: merge to main.** Open a PR from the working branch to `main` and merge it — this brings the workflow change to the default branch (`repository_dispatch` only works once the file exists there). Confirm the merge triggered a Pages deploy and the site came back up.

- [ ] **Step 7: verify the loop end to end.** In the Studio, change the Site settings tagline to a temporary value and **Publish**. Within ~30 seconds the repo’s **Actions** tab shows a new run named `repository_dispatch`; after it completes (~2 min), the live site shows the new tagline. In Sanity’s webhook page, the delivery log should show HTTP `204` responses from GitHub. Then set the tagline back to its real value and publish again.

---

## Definition of done

- [ ] `npm run typecheck` and `npm run build` pass locally and in CI with the real environment.
- [ ] The repository contains no club content: `git grep -l "@/data/club"` is empty; the only club-specific strings left in code are schemas, generic templates over Sanity values, and fallback labels in `src/lib/sections.ts`.
- [ ] Every page renders real Sanity data; empty collections show empty states; photo-less entries render generated artwork (Verified in Tasks 7–9).
- [ ] The registration flow works end to end, and a stale stored pass (unknown track id) is discarded instead of crashing (Task 10).
- [ ] The Studio is deployed at `hack-kuet.sanity.studio`, singletons cannot be deleted or duplicated, and orderable lists drag correctly (Task 3).
- [ ] Publishing in the Studio automatically rebuilds the live site (Task 12, verified once).
- [ ] The user checklist is closed: `TODO — set in Studio` values replaced, farewell date corrected, history milestones added, executive board added, achievements to be added as they happen.

