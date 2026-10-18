# Hardware Acceleration Club of KUET (HACK) — Official Website

[![Deploy Next.js to GitHub Pages](https://github.com/hackuet/hackuet.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/hackuet/hackuet.github.io/actions/workflows/deploy.yml)
[![Static Site](https://img.shields.io/badge/Next.js-16%20Static%20Export-black?style=flat&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0%20Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev)

The official website for **HACK** (**Hardware Acceleration Club of KUET**), based at Khulna University of Engineering & Technology (KUET), Bangladesh.

Live Site: [https://hackuet.github.io](https://hackuet.github.io)

---

## ⚡ About HACK

HACK is the student hardware engineering club at KUET dedicated to FPGAs, digital logic, GPU kernel acceleration, computer architecture, and embedded systems. Members learn Verilog/SystemVerilog, synthesize custom hardware circuits on development boards, build RISC-V cores, and compete in national design competitions.

---

## 🌟 Key Features

- **Generative Die Art (`DieArt.tsx`):**
  Algorithmic, deterministic silicon chip floorplans generated via seed-based pseudo-random numbers (Mulberry32). Color hues (`navy`, `blue`, `cyan`, `sky`) are automatically derived from member name hashes, providing custom procedural artwork for members without portraits.
- **Auto-Generated Initials Monograms:**
  Members without real photos display their algorithmic 2-letter initials badge (e.g. Tasmir Hossain Zihad $\rightarrow$ `"TZ"`, Arnob Dam $\rightarrow$ `"AD"`, Bandhon Kumar Sutrodhar $\rightarrow$ `"BS"`).
- **Interactive Registration & Pass Generator (`/register`):**
  Client-side registration form with KUET roll number and department validation. Automatically generates an authentic, downloadable digital membership pass with unique visual die art seeded from the applicant's student roll. Saved in local storage.
- **Executive Board (`/executive-board`):**
  Comprehensive roster of club moderators, advisors, executive board members, batch representatives, and manager divisions loaded dynamically from Sanity Content Lake with resilient static fallback.
- **Event Scheduling (`/events`):**
  Interactive schedule of upcoming workshops, hardware sprints, and design reviews, complete with past event archives and Schema.org `EducationEvent` JSON-LD markup.
- **Achievements & Projects (`/achievements`, `/projects`):**
  Showcase of contest championships, publications, and student-designed hardware accelerators.
- **Photo Gallery (`/gallery`):**
  Visual collection of club workshops, build sessions, and contest delegations.
- **Sanity.io Integration & Media Pipeline:**
  Portraits and photo assets hosted on the Sanity CDN, managed via Sanity Studio in `studio/`.
- **Privacy Guaranteed:**
  Zero student roll numbers, phone numbers, or private emails are committed to GitHub or rendered publicly on member cards.
- **LLM/Crawler Friendly (`/llms.txt`):**
  Static Markdown site index specifically formatted for consumption by language models and AI assistants.
- **Zero-Server Architecture:**
  100% static HTML/CSS/JS export deployed seamlessly to GitHub Pages with automated prefetch path normalization.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js](https://nextjs.org/) (App Router, static export `output: 'export'`)
- **CMS:** [Sanity.io](https://www.sanity.io/) (Content Lake, Studio in `studio/`)
- **UI Library:** [React 19](https://react.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling:** Vanilla CSS with custom design tokens (`tokens.css`, `base.css`, `components.css`, `pages.css`), Bricolage Grotesque, Instrument Sans, and JetBrains Mono typography.
- **Icons:** [Lucide React](https://lucide.dev/)
- **Hosting:** GitHub Pages via GitHub Actions

---

## 📁 Repository Structure

```text
hackuet.github.io/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Pages CI/CD workflow
├── assets/                     # Raw image staging (gitignored)
│   ├── raw-team/               # Original uncommitted portraits
│   └── pics/                   # High-res club event photography
├── public/                     # Static public assets (logos, OG image, manifest)
├── scripts/
│   ├── postexport.mjs          # Post-export prefetch path normalizer for static hosts
│   ├── upload_to_sanity.py     # Multithreaded Sanity asset uploader with SHA-1 deduplication
│   ├── seed_sanity_team.py     # Executive panel document sync to Sanity Content Lake
│   └── seed_sanity_site.py     # Full site settings, story, and registration options seeder
├── studio/                     # Standalone Sanity Studio v6 (React / TypeScript)
│   ├── schemaTypes/            # Studio document & object schemas
│   └── sanity.config.ts        # Sanity project configuration
├── src/
│   ├── app/
│   │   ├── achievements/       # /achievements route
│   │   ├── events/             # /events route
│   │   ├── executive-board/    # /executive-board route
│   │   ├── gallery/            # /gallery route
│   │   ├── projects/           # /projects route
│   │   ├── llms.txt/           # LLM site summary endpoint
│   │   ├── register/           # Member registration & pass generation
│   │   ├── layout.tsx          # Root layout, meta, JSON-LD schemas
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── page.tsx            # Home page with hero carousel & timeline
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # XML Sitemap generator
│   ├── components/
│   │   ├── CircuitBackground.tsx # Canvas background circuit animation
│   │   ├── DieArt.tsx          # Algorithmic silicon die generator with name hash hue
│   │   ├── EventsView.tsx      # Upcoming/past events tabbed list
│   │   ├── HeroCarousel.tsx    # Interactive home carousel
│   │   ├── MemberPass.tsx      # Renderable & downloadable membership card
│   │   ├── RegisterForm.tsx    # Registration form with live preview
│   │   ├── TeamGrid.tsx        # Member card grid with auto initials & auto hue
│   │   ├── motion.tsx          # Scroll reveal and typewriter primitives
│   │   └── ui.tsx              # Reusable UI controls and wrappers
│   ├── data/
│   │   ├── club.ts             # Central fallback data store for offline builds
│   │   └── sanity-assets.json  # Canonical SHA-1 registry of uploaded Sanity CDN assets
│   ├── lib/
│   │   ├── content.ts          # Sanity GROQ query fetcher with fallback resilience
│   │   ├── sanity.ts           # Sanity client & image builder
│   │   ├── registration.ts     # Client validation & pass storage logic
│   │   ├── seo.ts              # OpenGraph, Twitter, and Schema.org metadata
│   │   └── site.ts             # Site domain & environment resolution
│   └── styles/
│       ├── tokens.css          # Color variables, typography, layout tokens
│       ├── base.css            # Base element resets and shared styles
│       ├── components.css      # Component-level styles
│       └── pages.css           # Route-specific layout styles
├── next.config.ts              # Next.js configuration (static export)
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20 or higher
- **npm**: v10 or higher
- **Python**: 3.10+ (for asset upload and sync scripts)

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hackuet/hackuet.github.io.git
cd hackuet.github.io
npm install
```

### Development Server

Run the local Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

To run the Sanity Studio locally:

```bash
npm run studio
```

### Type Check

Verify TypeScript compilation:

```bash
npm run typecheck
```

### Production Build & Static Export

Build the production static export:

```bash
npm run build
```

The static files will be exported to the `out/` directory, followed by `scripts/postexport.mjs` to ensure route prefetch compatibility across static CDNs.

To preview the exported build locally:

```bash
npm run start
```

---

## ⚙️ Content Management & Sanity Workflow

Content is hosted on **Sanity.io Content Lake** (`xcn3cj7z` / `production`).

1. **Sanity Studio:**
   - Launch locally via `npm run studio` or edit in cloud.
   - Edit Site Settings, Home Story, Executive Board, Events, Projects, and Gallery items.
2. **Uploading New Assets:**
   - Place raw photos in `assets/raw-team/` or `assets/pics/` (automatically gitignored).
   - Run the upload script:
     ```bash
     python3 scripts/upload_to_sanity.py assets/raw-team/
     ```
   - Duplicate photos are automatically skipped using SHA-1 hashing against `src/data/sanity-assets.json`.
3. **Resilient Offline Architecture:**
   - The site is designed to fetch live data from Sanity at build time, while retaining `src/data/club.ts` as a reliable fallback if network is unavailable.

---

## 📄 License

This project is open-source under the MIT License. Developed and maintained by the Hardware Acceleration Club of KUET (HACK).
