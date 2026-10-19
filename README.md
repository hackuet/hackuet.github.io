# Hardware Acceleration Club of KUET (HACK)

[![Deploy Next.js to GitHub Pages](https://github.com/hackuet/hackuet.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/hackuet/hackuet.github.io/actions/workflows/deploy.yml)
[![Next.js 16](https://img.shields.io/badge/Next.js-16%20Static%20Export-black?style=flat&logo=next.js)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0%20Strict-blue?style=flat&logo=typescript)](https://www.typescriptlang.org)

The official website for **HACK** (**Hardware Acceleration Club of KUET**), based at Khulna University of Engineering & Technology (KUET), Bangladesh.

🌐 **Live Site:** [https://hackuet.github.io](https://hackuet.github.io)  
🎨 **Design System & Visual Spec:** [DESIGN.md](DESIGN.md)

---

## 🚀 Running Guide

### Prerequisites
- **Node.js**: v20 or higher
- **npm**: v10 or higher

### Setup & Local Development

```bash
# Clone the repository
git clone https://github.com/hackuet/hackuet.github.io.git
cd hackuet.github.io

# Install dependencies
npm install

# Start Next.js local development server (http://localhost:3000)
npm run dev

# Start Sanity Studio locally (http://localhost:3333)
npm run studio
```

### Build & Verification Commands

| Command | Description |
| :--- | :--- |
| `npm run typecheck` | Validates TypeScript in strict mode (`tsc --noEmit`) |
| `npm run build` | Generates full static HTML export to `out/` via `next build` |
| `npm run start` | Serves the exported static build locally on `http://localhost:3000` |

---

## ⚡ Core Principles & Architecture

1. **Static-First & Zero Server Overhead:**
   - The site operates on a 100% pre-rendered static export architecture (`output: 'export'`) deployed to GitHub Pages. All Sanity queries execute at build time without runtime server dependencies.
2. **Hardware Engineering Design Language:**
   - The visual identity simulates physical electronics: silicon die floorplans (`DieArt.tsx`), Manhattan PCB trace routing (`CircuitBackground.tsx`), and oscilloscope logic probes. Complete specifications are documented in [DESIGN.md](DESIGN.md).
3. **Privacy First:**
   - Zero student roll numbers, phone numbers, or private contact details are rendered publicly on member cards or committed to git.
4. **Resilient Data Fallbacks:**
   - Dynamic content is fetched from Sanity Content Lake (`ky8bcwum` / `production`), while local data modules serve as static offline fallbacks.

---

## 📁 Project Structure

```text
hackuet.github.io/
├── DESIGN.md          # Comprehensive design system, canvas & animation specifications
├── studio/            # Sanity Studio CMS schemas and config
├── src/
│   ├── app/           # Next.js App Router static pages & metadata
│   ├── components/    # Reusable UI, CircuitBackground, and DieArt components
│   ├── lib/           # Sanity client, data fetchers, and utilities
│   └── styles/        # Design tokens and modular CSS stylesheets
├── public/            # Static assets (logos, manifest, icons)
└── scripts/           # Static build and asset helper scripts
```

---

## 🤝 Contributing & Available Skills

- **Contributing Guidelines:** Please read [CONTRIBUTING.md](CONTRIBUTING.md) before submitting pull requests.
- **Agent Guidelines & Conventions:** AI coding assistants and developers should consult [agents.md](agents.md) for architecture rules and data boundaries.
- **Available Autonomous Skills:**
  - [**Sanity Media Uploader**](skills/sanity-media-uploader/SKILL.md) (`skills/sanity-media-uploader`): Tooling and protocol to batch-upload executive board portraits, workshop graphics, and event photography directly to the Sanity Content Lake with automatic SHA-1 deduplication while keeping raw staging assets gitignored.

---

## 📄 License & Credits

- Crafted with 🤍 by [@ettisafxrup](https://github.com/ettisafxrup).
- Maintained by the **Hardware Acceleration Club of KUET (HACK)**.
- Licensed under the [MIT License](LICENSE).
