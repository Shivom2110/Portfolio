# Shivom Vinayak Raskar — Portfolio

A personal portfolio built in Astro + TypeScript + Tailwind CSS (v4), with GSAP/ScrollTrigger and Lenis for motion. Design direction follows a luxury-editorial reference (cream hero, near-black sections, single gold accent) captured in the Phase 2 chat history — not checked into this repo.

## Stack

- **Astro** (static output) + TypeScript
- **Tailwind CSS v4** (CSS-first config via `@theme` in `src/styles/global.css`)
- **GSAP + ScrollTrigger** for the project-stack scroll effect
- **Lenis** for smooth scroll
- Content collections (`src/content/projects/*.mdx`) for case studies
- Self-hosted, subsetted fonts (`public/fonts/`): Anton (hero word), Archivo Black (WORK), Manrope (everything else)

## Commands

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output to dist/
npm run preview  # preview the production build
npx astro check  # TypeScript diagnostics
```

## Adding a project

Add one `.mdx` file to `src/content/projects/`. Frontmatter schema is defined in `src/content.config.ts`:

```yaml
---
title: Project Name
summary: One-sentence summary shown on project cards.
org: Optional — company/org/context
date: "2026-01"          # optional
tags: [Tag One, Tag Two]
featured: true            # true = gets the full sticky-stack case-study card on the homepage; false = compact list
order: 1                  # sort order within its group
repoUrl: https://github.com/Shivom2110/repo-name   # optional
---

## Problem
## Constraints
## What I built
## Key decision & tradeoff
## Result
```

Only `featured: true` projects get the five-section case-study treatment above; everything else can just be a sentence or two — see `src/content/projects/hand-gesture-bot.mdx` for a minimal example. A `featured: true` project also gets its own page at `/work/<filename-without-extension>` automatically (`src/pages/work/[slug].astro`).

## Known TODOs

Search the codebase for `TODO(shivom)` — currently:
- `astro.config.mjs` — `site` is a placeholder domain, swap for the real one once picked
- `src/content/projects/lawn-mower.mdx` — needs a real "Result" (bench-tested? on the mower? field data?)
- `src/content/projects/planetsos-backend.mdx` — needs one line on what prompted the project
- `src/components/About.astro` — the "Mindset" stat in the stats grid has no value yet
- Contact form (`src/components/ContactSection.astro`) currently falls back to a pre-filled `mailto:` — no backend (Formspree/Resend/Vercel function) is wired up yet
- `/resume.pdf` is not yet linked anywhere — no file has been supplied

## Deploy

No deploy config has been added yet (Vercel, per the original brief, but nothing is wired up). `npm run build` produces a static `dist/` that any static host can serve.
