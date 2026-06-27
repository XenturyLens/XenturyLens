# Xenturylens — Next.js Rebuild Design

**Date:** 2026-06-27
**Status:** Approved (pending spec review)

## Summary

Rebuild the `Xenturylens (standalone).html` mockup as a production Next.js site.
The mockup is a **guide, not a specification** — it provides the content, story,
structure, and design taste. The goal is to out-build it: cleaner architecture,
elevated motion, and a dual-personality theming system.

Xenturylens is a "hundred-year" product engineering studio. The site is a
five-view marketing site with editorial, Apple-grade typography and Linear-grade
interaction polish.

## Goals

- Faithful **in spirit** to the mockup's content and story; free to improve
  layout, add sections, and execute better.
- **Two-personality theming:** Light channels Apple (bright, spacious,
  authoritative). Dark channels Linear (deep, layered, cinematic). Each mode owns
  its own glow, border treatment, accent weight, and ambient effects — not a
  color inversion.
- Apple-grade typographic discipline + Linear-grade speed and finish.
- Real, shareable, SEO-friendly routes with SPA-smooth transitions.
- Functional contact form via email.
- Accessible, responsive, performance-minded.

## Non-Goals

- No CMS — content is hardcoded/typed in the repo (single edit point).
- No blog, no auth, no e-commerce.
- No real brand imagery yet — designed placeholders with a clean swap-in API.
- No 1:1 pixel reproduction of the mockup.

## Tech Stack

- **Next.js 16** (App Router, React Server Components) + **TypeScript** + React 19.
- **Tailwind CSS v4**, token-driven via CSS custom properties.
- **Motion** (the `motion` package) for scroll reveals, route transitions, and
  micro-interactions.
- **next/font** self-hosting `Schibsted Grotesk` (display) + `IBM Plex Mono`
  (labels/meta).
- **Resend** + Server Action + **Zod** for the contact form.
- **Vercel** deploy target. **pnpm** package manager.

> All library APIs (Next.js 16 App Router, Tailwind v4, Motion, Resend) MUST be
> verified against current official docs during implementation — not written from
> memory.

## Theming Architecture (centerpiece)

- `data-theme` attribute on `<html>`; every design decision is a CSS custom
  property so a theme is one variable set, not scattered conditionals.
- **Default:** follow OS `prefers-color-scheme`; when unknown, default to **dark**.
- **Persistence:** manual toggle stored in `localStorage`. An inline
  pre-hydration script in `<head>` sets the theme before first paint so there is
  **no flash** of the wrong theme.
- **Transition:** smooth cross-fade of color tokens on toggle.

### Token sets

| Token            | Light (Apple)                | Dark (Linear)                       |
| ---------------- | ---------------------------- | ----------------------------------- |
| `--surface`      | `#fbfbfd`                    | `#08090a`                           |
| `--surface-2`    | `#f5f5f7`                    | layered elevated (`#111214`-ish)    |
| `--ink`          | `#1d1d1f`                    | `#f5f5f7`                           |
| `--ink-soft`     | `#6e6e73`                    | `#a0a0a8`                           |
| `--grey`         | `#86868b`                    | `#86868b`                           |
| `--border`       | `rgba(0,0,0,.07)` hairline   | `rgba(255,255,255,.08)` light-catch |
| `--accent`       | `#0071e3`                    | brightened `#0071e3`                |
| `--glow`         | none / minimal               | ambient aurora behind hero          |

- **Light = Apple:** near-zero color, flat and bright, hairline grey borders.
- **Dark = Linear:** layered surfaces, borders that catch light, ambient aurora
  gradient behind the hero, accent carrying real weight.

### Typography & scale

- Display: `Schibsted Grotesk`, tight tracking (~ -0.04em) on large headings.
- Mono: `IBM Plex Mono` for eyebrow labels, stats, nav meta.
- Heroes ~88 / 68 / 60px; 1280px max content width; ~40px gutters; generous
  section padding (90–110px).

## Routes

| Route       | View     | Contents                                                                 |
| ----------- | -------- | ------------------------------------------------------------------------ |
| `/`         | Home     | Hero, "What we do", Selected work, "The name" (pinned), stats, CTA       |
| `/work`     | Work     | Featured + Africarstruck / Bafsta / HighStreet grid                      |
| `/services` | Services | 4 services + Frame → Design → Build → Endure process                     |
| `/studio`   | Studio   | Values + 4 people                                                        |
| `/contact`  | Contact  | Enquiry form (Resend)                                                    |

Shared `layout.tsx`: frosted, contracting sticky nav with theme toggle + footer.
Animated route transitions (`template.tsx` + Motion) for the SPA-smooth feel
while keeping real URLs.

## Component Architecture

- **Layout:** `SiteHeader` (sticky, blur-on-scroll), `SiteFooter`.
- **Primitives:** `ThemeToggle`, `Reveal` (scroll-in wrapper replacing the
  mockup's `data-reveal`), `Eyebrow` (mono label), `Section`, `Button`
  (magnetic), `Stat` (count-up), `ImageSlot` (styled gradient/typographic
  placeholder with clean swap-in API).
- **Sections:** `Hero`, `WhatWeDo`, `SelectedWork`, `TheName`, `Stats`, `CTA`,
  `ProcessSteps`, `ServiceList`, `Values`, `People`, `ContactForm`.
- **Data:** `lib/content.ts` — typed objects for nav, services, work, people,
  stats, copy. Pages map over this; one edit point.

## Motion Plan (Linear-grade, tasteful)

Governance rule: **Apple governs layout and the big scroll moments (calm
ease-out); Linear governs the speed and finish of transitions, hovers, and
depth.** One shared easing/timing token set keeps both coherent.

- Scroll reveals: fade + 12–16px rise, staggered, ~0.4–0.6s (quick, not floaty).
- Route transitions: crossfade + subtle rise.
- Header blur/contract on scroll.
- **Scroll-pinned "The name" moment** (century → lens) — the Apple signature the
  mockup lacks.
- **Count-up stats** (100 / 40+ / 12) while pinned.
- **Ambient aurora** behind the hero in dark mode.
- Magnetic buttons, hover-lift work cards, animated link underlines, visible
  focus rings.
- `prefers-reduced-motion` honored throughout (reveals become instant, pins
  release, no parallax).

## Contact Form

Client form → Server Action, **Zod**-validated → **Resend** email to
`studio@xenturylens.com`. Inline validation; pending / success / error states.
`RESEND_API_KEY` via env. If the key is absent (e.g. local dev), the form
degrades to a clear "email not configured" message rather than failing silently.

Fields (from mockup): Name, Email, Company, "What are you building?".

## Quality Bar

- Responsive: mobile → 1280px, fluid type and spacing.
- Accessible: semantic landmarks, focus states, reduced-motion, sufficient
  contrast in both themes, labeled form controls.
- Performance: RSC by default, `next/font`, `next/image`, minimal client JS
  (motion + theme + form are the client islands).
- Metadata + Open Graph per route.

## Build Order

1. Scaffold (Next.js 16, TS, Tailwind v4, pnpm) + token/theme system + fonts.
2. Root layout + theme toggle (no-flash inline script) + header/footer.
3. Primitives (`Reveal`, `Eyebrow`, `Section`, `Button`, `Stat`, `ImageSlot`).
4. Home, including the pinned "The name" moment and count-up stats.
5. Work / Services / Studio views.
6. Contact form + Resend Server Action.
7. Motion polish pass (route transitions, magnetic/hover, aurora).
8. Responsive / accessibility / performance pass.
9. Deploy to Vercel.

## Risks & Open Questions

- **Scroll-pinned sections** add complexity and must degrade cleanly under
  reduced-motion and on mobile — budget time for this.
- **Resend** requires an API key and a verified sending domain for production;
  dev works with the degraded state until configured.
- Brand assets are placeholders until real ones are supplied; `ImageSlot` API
  must make swapping in real images trivial.
