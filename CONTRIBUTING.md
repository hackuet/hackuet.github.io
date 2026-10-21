# Contributing to HACK KUET Website

Thank you for contributing to the official website of the **Hardware Acceleration Club of KUET (HACK)**!

---

## 🛠️ Development Workflow

1. **Fork & Branch**:
   - Create a feature or fix branch from `main` (e.g. `feat/new-event` or `fix/nav-styling`).
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Setup**:
   - Copy `.env.example` to `.env.local` if needed for Sanity Studio.
4. **Development Servers**:
   - Next.js web application: `npm run dev`
   - Sanity Studio: `npm run studio`
5. **Quality Checks**:
   - TypeScript must pass with zero errors:
     ```bash
     npm run typecheck
     ```
   - Build static export cleanly:
     ```bash
     npm run build
     ```

---

## 📐 Design & Agent Guidelines

- **Design Philosophy**: Review [DESIGN.md](DESIGN.md) before altering visual styles, canvas routing, or animations.
- **Agent Context & Conventions**: Review [AGENTS.md](agents.md) for architectural constraints, data store structure, and privacy policies.
- **Media Uploads**: If uploading new executive portraits or event photos, use the [Sanity Media Uploader skill](skills/sanity-media-uploader/SKILL.md) and ensure raw assets remain gitignored in `assets/`.
