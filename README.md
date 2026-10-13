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
  Algorithmic, deterministic silicon chip floorplans generated via seed-based pseudo-random numbers (Mulberry32). Serves as aesthetic placeholder artwork matching the club's corporate palette until custom photography is supplied.
- **Interactive Registration & Pass Generator (`/register`):**
  Client-side registration form with KUET roll number and department validation. Automatically generates an authentic, downloadable digital membership pass with unique visual die art seeded from the applicant's student roll. Saved in local storage.
- **Organizing Committee & Executive Directory (`/executive-board`):**
  Comprehensive roster of club moderators, advisors, executive board members, batch representatives, and manager divisions.
- **Event Scheduling (`/events`):**
  Interactive schedule of upcoming workshops, hardware sprints, and design reviews, complete with past event archives and Schema.org `EducationEvent` JSON-LD markup.
- **Achievements & Projects (`/achievements`):**
  Showcase of contest championships, publications, and hardware design finalists.
- **Photo Gallery (`/gallery`):**
  Visual collection of club workshops, build sessions, and contest delegations.
- **LLM/Crawler Friendly (`/llms.txt`):**
  Static Markdown site index specifically formatted for consumption by language models and AI assistants.
- **Zero-Server Architecture:**
  100% static HTML/CSS/JS export deployed seamlessly to GitHub Pages with automated prefetch path normalization.

---

## 🛠️ Tech Stack & Architecture

- **Framework:** [Next.js](https://nextjs.org/) (App Router, static export `output: 'export'`)
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
├── public/                     # Static assets (logos, OG image, manifest)
├── scripts/
│   └── postexport.mjs          # Post-export prefetch path normalizer for static hosts
├── src/
│   ├── app/
│   │   ├── achievements/       # /achievements route
│   │   ├── events/             # /events route
│   │   ├── executive-board/    # /executive-board route
│   │   ├── gallery/            # /gallery route
│   │   ├── llms.txt/           # LLM site summary endpoint
│   │   ├── register/           # Member registration & pass generation
│   │   ├── layout.tsx          # Root layout, meta, JSON-LD schemas
│   │   ├── not-found.tsx       # Custom 404 page
│   │   ├── page.tsx            # Home page with hero carousel & timeline
│   │   ├── robots.ts           # Dynamic robots.txt
│   │   └── sitemap.ts          # XML Sitemap generator
│   ├── components/
│   │   ├── CircuitBackground.tsx # Canvas background circuit animation
│   │   ├── DieArt.tsx          # Algorithmic silicon die generator
│   │   ├── EventsView.tsx      # Upcoming/past events tabbed list
│   │   ├── HeroCarousel.tsx    # Interactive home carousel
│   │   ├── MemberPass.tsx      # Renderable & downloadable membership card
│   │   ├── RegisterForm.tsx    # Registration form with live preview
│   │   ├── TeamGrid.tsx        # Member card grid
│   │   ├── motion.tsx          # Scroll reveal and typewriter primitives
│   │   └── ui.tsx              # Reusable UI controls and wrappers
│   ├── data/
│   │   └── club.ts             # Central single source of truth for site content
│   ├── lib/
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

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hackuet/hackuet.github.io.git
cd hackuet.github.io
npm install
```

### Development Server

Run the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

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

## ⚙️ Content Management

All club information, committee lists, events, achievements, and copy reside in:

```text
src/data/club.ts
```

Updating this single file automatically propagates changes across all pages, SEO metadata, JSON-LD schemas, and `/llms.txt`.

---

## 📄 License

This project is open-source under the MIT License. Developed and maintained by the Hardware Acceleration Club of KUET (HACK).
