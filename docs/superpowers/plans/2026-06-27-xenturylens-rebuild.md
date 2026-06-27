# Xenturylens Next.js Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `Xenturylens (standalone).html` mockup as a production Next.js 16 marketing site with a dual-personality (Apple-light / Linear-dark) theme system and Linear-grade motion.

**Architecture:** App Router with five real routes plus a shared layout (sticky frosted nav + footer) and animated route transitions. All design decisions are CSS custom properties keyed off a `data-theme` attribute on `<html>`; a pre-hydration inline script prevents theme flash. Content is a single typed data module. Motion is isolated to client-component islands. The contact form posts to a Server Action that emails via Resend.

**Tech Stack:** Next.js 16.2 (App Router, React 19, TypeScript) · Tailwind CSS v4 · Motion (`motion` package) · next/font (Schibsted Grotesk + IBM Plex Mono) · Resend + Zod · Vitest + React Testing Library · pnpm · Vercel.

## Global Constraints

- **Package manager:** pnpm. All install commands use `pnpm`.
- **Next.js:** 16.x, App Router only. React Server Components by default; client components only where interactivity/motion requires it (`'use client'`).
- **Node runtime** for Server Actions (default). Do not set Edge runtime.
- **Theming:** every color/surface/border/glow value is a CSS custom property under `:root` (light) and `[data-theme=dark]` (dark). No hardcoded hex in components. Default theme = follow OS, fall back to **dark**. Persist choice in `localStorage` key `xl-theme`. No theme flash on load.
- **Tailwind v4:** CSS-first config (`@import "tailwindcss"`, `@theme`, `@custom-variant`). No `tailwind.config.js` unless a step explicitly needs it.
- **Motion import path:** `motion/react` (never `framer-motion`).
- **Accessibility:** semantic landmarks, visible focus states, labeled controls, and `prefers-reduced-motion` honored in every animated component.
- **Copy is verbatim** from the mockup content extracted in the spec — do not invent or paraphrase marketing copy.
- **Brand color tokens (light / dark):**
  `--surface` `#fbfbfd` / `#08090a` · `--surface-2` `#f5f5f7` / `#111214` · `--ink` `#1d1d1f` / `#f5f5f7` · `--ink-soft` `#6e6e73` / `#a0a0a8` · `--grey` `#86868b` / `#86868b` · `--border` `rgba(0,0,0,.08)` / `rgba(255,255,255,.08)` · `--accent` `#0071e3` / `#2a8cff`.
- **Display font** `Schibsted Grotesk` via `--font-display`; **mono font** `IBM Plex Mono` via `--font-mono`.
- **Content max width** 1280px; **gutter** 40px (24px on mobile).

---

## File Structure

```
package.json, pnpm-lock.yaml, tsconfig.json, next.config.ts
postcss.config.mjs
vitest.config.ts, vitest.setup.ts
.env.example
app/
  layout.tsx              Root layout: fonts, theme provider, header/footer
  template.tsx            Animated route transition wrapper
  globals.css             Tailwind import, tokens, custom-variant, base styles
  fonts.ts                next/font definitions (display + mono)
  page.tsx                Home (/)
  work/page.tsx           Work
  services/page.tsx       Services
  studio/page.tsx         Studio
  contact/page.tsx        Contact
  contact/actions.ts      'use server' Resend submit action
  opengraph-image.tsx     (optional, Task 13) site OG image
lib/
  content.ts              Typed content: nav, services, work, people, stats, copy
  theme.ts                Theme types + storage helpers (pure, testable)
  cn.ts                   className join helper
components/
  theme/ThemeProvider.tsx Client provider + no-flash script
  theme/ThemeToggle.tsx   Toggle button
  layout/SiteHeader.tsx   Sticky frosted nav
  layout/SiteFooter.tsx
  primitives/Reveal.tsx   Scroll-in wrapper (motion)
  primitives/Eyebrow.tsx  Mono label
  primitives/Section.tsx  Section + container
  primitives/Button.tsx   Link/button, magnetic variant
  primitives/Stat.tsx     Count-up stat (motion)
  primitives/ImageSlot.tsx Designed placeholder
  sections/Hero.tsx
  sections/WhatWeDo.tsx
  sections/SelectedWork.tsx
  sections/TheName.tsx    Scroll-pinned moment
  sections/Stats.tsx
  sections/CTA.tsx
  sections/ServiceList.tsx
  sections/ProcessSteps.tsx
  sections/Values.tsx
  sections/People.tsx
  sections/WorkGrid.tsx
  sections/ContactForm.tsx Client form -> server action
  Aurora.tsx              Dark-mode ambient gradient
```

---

## Testing Strategy

Pure logic (theme storage, Zod schema, content integrity) gets real unit tests with **Vitest**. Components get **React Testing Library** render/smoke tests asserting required copy and roles are present (not pixel styling). Every task additionally gates on `pnpm typecheck` passing, and the final task gates on `pnpm build`. Visual styling is verified by the human reviewer between tasks — the plan does not claim to test appearance.

---

### Task 1: Scaffold project, Tailwind v4, fonts, theme tokens

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `.gitignore`, `.env.example`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `app/fonts.ts`
- Create: `lib/cn.ts`

**Interfaces:**
- Produces: `app/fonts.ts` exports `display` and `mono` (next/font objects, each with `.variable`). `lib/cn.ts` exports `cn(...classes: Array<string | false | null | undefined>): string`.

- [ ] **Step 1: Scaffold Next.js app into the current directory**

The repo already contains files; scaffold into a temp dir and move, to avoid `create-next-app` refusing a non-empty dir.

```bash
cd /Users/yasirgaji/Downloads/xenturylens-new
pnpm dlx create-next-app@latest .xl-scaffold --ts --app --eslint --no-src-dir --import-alias "@/*" --use-pnpm --turbopack --no-tailwind
rsync -a --exclude node_modules --exclude .git .xl-scaffold/ ./
rm -rf .xl-scaffold
```

Expected: `app/`, `package.json`, `tsconfig.json`, `next.config.ts` now exist at repo root.

- [ ] **Step 2: Install Tailwind v4, Motion, fonts deps**

```bash
pnpm add tailwindcss @tailwindcss/postcss postcss motion resend zod
```

Expected: dependencies added to `package.json`.

- [ ] **Step 3: Configure PostCSS**

Create `postcss.config.mjs`:

```javascript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

- [ ] **Step 4: Define fonts in `app/fonts.ts`**

```ts
import { Schibsted_Grotesk, IBM_Plex_Mono } from "next/font/google";

export const display = Schibsted_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-mono",
});
```

- [ ] **Step 5: Write `app/globals.css` with tokens + dark variant**

```css
@import "tailwindcss";

@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

:root {
  --surface: #fbfbfd;
  --surface-2: #f5f5f7;
  --ink: #1d1d1f;
  --ink-soft: #6e6e73;
  --grey: #86868b;
  --border: rgba(0, 0, 0, 0.08);
  --accent: #0071e3;
  --glow: transparent;
}

[data-theme="dark"] {
  --surface: #08090a;
  --surface-2: #111214;
  --ink: #f5f5f7;
  --ink-soft: #a0a0a8;
  --grey: #86868b;
  --border: rgba(255, 255, 255, 0.08);
  --accent: #2a8cff;
  --glow: rgba(42, 140, 255, 0.18);
}

@theme inline {
  --font-display: var(--font-display);
  --font-mono: var(--font-mono);
  --color-surface: var(--surface);
  --color-surface-2: var(--surface-2);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-grey: var(--grey);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
}

html {
  background: var(--surface);
  color: var(--ink);
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-display), -apple-system, BlinkMacSystemFont, sans-serif;
  /* Color tokens cross-fade on theme toggle */
  transition: background-color 0.4s var(--ease-out-expo), color 0.4s var(--ease-out-expo);
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 6: Write `lib/cn.ts`**

```ts
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
```

- [ ] **Step 7: Replace `app/layout.tsx`**

```tsx
import type { Metadata } from "next";
import { display, mono } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xenturylens — Product engineering studio",
  description: "Software built to last a hundred years.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${display.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

- [ ] **Step 8: Replace `app/page.tsx` with a token smoke test**

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-surface text-ink p-10">
      <p className="font-mono text-grey">Scaffold OK</p>
      <h1 className="font-display text-5xl tracking-tight">Xenturylens</h1>
    </main>
  );
}
```

- [ ] **Step 9: Add `.env.example`**

```bash
RESEND_API_KEY=
CONTACT_TO_EMAIL=studio@xenturylens.com
CONTACT_FROM_EMAIL="Xenturylens <onboarding@resend.dev>"
```

- [ ] **Step 10: Run dev server and verify it boots**

Run: `pnpm dev` (then stop it). Expected: compiles with no errors; visiting `/` shows "Xenturylens" with grey mono subtext on a near-black background (default dark).

- [ ] **Step 11: Typecheck**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js 16 app with Tailwind v4, fonts, theme tokens"
```

---

### Task 2: Theme system (storage logic, provider, no-flash, toggle)

**Files:**
- Create: `lib/theme.ts`, `components/theme/ThemeProvider.tsx`, `components/theme/ThemeToggle.tsx`
- Create: `vitest.config.ts`, `vitest.setup.ts`, `lib/theme.test.ts`
- Modify: `app/layout.tsx`, `package.json` (scripts)

**Interfaces:**
- Produces: `lib/theme.ts` exports `type Theme = "light" | "dark"`, `THEME_KEY = "xl-theme"`, `resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme`, and `THEME_SCRIPT: string` (the stringified no-flash IIFE).
- Produces: `ThemeProvider` (default export, client) wrapping children and providing `useTheme(): { theme: Theme; toggle: () => void }`.
- Produces: `ThemeToggle` (default export, client) — a button using `useTheme`.

- [ ] **Step 1: Add test tooling and scripts**

```bash
pnpm add -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add to `package.json` `"scripts"`:

```json
"test": "vitest run",
"typecheck": "tsc --noEmit"
```

- [ ] **Step 2: Write `vitest.config.ts` and `vitest.setup.ts`**

```ts
// vitest.config.ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", setupFiles: ["./vitest.setup.ts"], globals: true },
  resolve: { alias: { "@": fileURLToPath(new URL("./", import.meta.url)) } },
});
```

```ts
// vitest.setup.ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write failing test `lib/theme.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { resolveInitialTheme } from "./theme";

describe("resolveInitialTheme", () => {
  it("uses stored value when present", () => {
    expect(resolveInitialTheme("light", true)).toBe("light");
    expect(resolveInitialTheme("dark", false)).toBe("dark");
  });
  it("ignores invalid stored values", () => {
    expect(resolveInitialTheme("purple", false)).toBe("light");
  });
  it("falls back to system preference when unset", () => {
    expect(resolveInitialTheme(null, true)).toBe("dark");
    expect(resolveInitialTheme(null, false)).toBe("light");
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `pnpm test lib/theme.test.ts`
Expected: FAIL — cannot find module `./theme`.

- [ ] **Step 5: Write `lib/theme.ts`**

```ts
export type Theme = "light" | "dark";
export const THEME_KEY = "xl-theme";

export function resolveInitialTheme(stored: string | null, prefersDark: boolean): Theme {
  if (stored === "light" || stored === "dark") return stored;
  return prefersDark ? "dark" : "light";
}

// Runs before hydration to set data-theme and avoid a flash.
export const THEME_SCRIPT = `(function(){try{
  var s=localStorage.getItem("${THEME_KEY}");
  var d=window.matchMedia("(prefers-color-scheme: dark)").matches;
  var t=(s==="light"||s==="dark")?s:(d?"dark":"light");
  document.documentElement.setAttribute("data-theme",t);
}catch(e){document.documentElement.setAttribute("data-theme","dark");}})();`;
```

- [ ] **Step 6: Run test to verify it passes**

Run: `pnpm test lib/theme.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 7: Write `components/theme/ThemeProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { THEME_KEY, type Theme } from "@/lib/theme";

const ThemeContext = createContext<{ theme: Theme; toggle: () => void } | null>(null);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Read the value the no-flash script already applied to <html>.
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "light" || current === "dark") setTheme(current);
  }, []);

  function toggle() {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch {}
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}
```

- [ ] **Step 8: Write `components/theme/ThemeToggle.tsx`**

```tsx
"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className="font-mono text-xs text-ink-soft hover:text-ink transition-colors px-3 py-2 rounded-full border border-border"
    >
      {isDark ? "Light" : "Dark"}
    </button>
  );
}
```

- [ ] **Step 9: Wire provider + no-flash script into `app/layout.tsx`**

Replace the body of the root layout (keep fonts/metadata) so it reads:

```tsx
import type { Metadata } from "next";
import { display, mono } from "./fonts";
import { THEME_SCRIPT } from "@/lib/theme";
import ThemeProvider from "@/components/theme/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xenturylens — Product engineering studio",
  description: "Software built to last a hundred years.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 10: Add the toggle to the smoke page and verify manually**

Temporarily add `<ThemeToggle />` to `app/page.tsx` (import from `@/components/theme/ThemeToggle`). Run `pnpm dev`, click the toggle: theme flips, surfaces cross-fade, refresh keeps the choice, and there is no flash on reload. Remove the temporary toggle import after verifying (the header will own it in Task 4).

- [ ] **Step 11: Typecheck + test**

Run: `pnpm typecheck && pnpm test`
Expected: no type errors; all tests pass.

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat: dual-mode theme system with no-flash and persisted toggle"
```

---

### Task 3: Content data layer

**Files:**
- Create: `lib/content.ts`, `lib/content.test.ts`

**Interfaces:**
- Produces: typed exports consumed by every page/section:
  - `nav: { label: string; href: string }[]`
  - `hero: { eyebrow: string; title: string; body: string; primaryCta: { label: string; href: string }; secondaryCta: { label: string; href: string } }`
  - `services: { no: string; title: string; body: string }[]` (4 items)
  - `process: { no: string; title: string; body: string }[]` (4 items: Frame/Design/Build/Endure)
  - `work: { slug: string; name: string; meta: string; blurb: string; featured?: boolean }[]`
  - `stats: { value: string; label: string }[]` (3 items)
  - `values: { title: string; body: string }[]` (3 items)
  - `people: { name: string; role: string }[]` (4 items)
  - `theName: { lead: string; century: string; lens: string; body: string }`
  - `contact: { email: string; workingWith: string }`

- [ ] **Step 1: Write failing test `lib/content.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { services, process, work, stats, people, hero, nav } from "./content";

describe("content", () => {
  it("has the four services in order", () => {
    expect(services.map((s) => s.title)).toEqual([
      "Strategy", "Design", "Engineering", "Stewardship",
    ]);
  });
  it("has the four process steps", () => {
    expect(process.map((p) => p.title)).toEqual(["Frame", "Design", "Build", "Endure"]);
  });
  it("has three featured-capable work items including Africarstruck", () => {
    expect(work.length).toBeGreaterThanOrEqual(3);
    expect(work.some((w) => w.name === "Africarstruck")).toBe(true);
  });
  it("has three stats and four people", () => {
    expect(stats).toHaveLength(3);
    expect(people).toHaveLength(4);
  });
  it("has hero copy and nav links to all routes", () => {
    expect(hero.title).toMatch(/hundred years/i);
    expect(nav.map((n) => n.href)).toEqual(
      expect.arrayContaining(["/work", "/services", "/studio", "/contact"])
    );
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test lib/content.test.ts`
Expected: FAIL — cannot find module `./content`.

- [ ] **Step 3: Write `lib/content.ts`** (copy verbatim from the mockup)

```ts
export const nav = [
  { label: "Work", href: "/work" },
  { label: "Services", href: "/services" },
  { label: "Studio", href: "/studio" },
  { label: "Contact", href: "/contact" },
];

export const hero = {
  eyebrow: "Product engineering studio",
  title: "Software built to last a hundred years.",
  body: "We design and engineer digital products with the patience of architecture and the precision of a lens. We see beyond the product — to the system beneath it, and the decade after it.",
  primaryCta: { label: "See our work", href: "/work" },
  secondaryCta: { label: "How we build", href: "/services" },
};

export const services = [
  { no: "01", title: "Strategy", body: "Product direction, scoping and architecture before a line is written." },
  { no: "02", title: "Design", body: "Interface and system design with obsessive attention to detail." },
  { no: "03", title: "Engineering", body: "Resilient, maintainable builds across web, mobile and platform." },
  { no: "04", title: "Stewardship", body: "We stay — evolving products long after the first release." },
];

export const process = [
  { no: "01", title: "Frame", body: "We define the real problem, the constraints and the hundred-year intent before committing to a direction." },
  { no: "02", title: "Design", body: "Systems and interfaces designed in the open, refined until every detail earns its place." },
  { no: "03", title: "Build", body: "Engineering in tight loops — shippable, tested and documented from the first commit." },
  { no: "04", title: "Endure", body: "We measure, maintain and evolve — so the product keeps earning its keep for years." },
];

export const work = [
  { slug: "africarstruck", name: "Africarstruck", meta: "Mobility platform · Product + Engineering", blurb: "A mobility platform rebuilt from the ground up — new product architecture, design system and engineering for scale across markets.", featured: true },
  { slug: "bafsta", name: "Bafsta", meta: "Fintech · Design system + Build", blurb: "A fintech product and design system engineered for trust, clarity and long-term maintainability." },
  { slug: "highstreet", name: "HighStreet", meta: "Commerce · Product + Engineering", blurb: "Commerce product and engineering built to scale with the business, not against it." },
];

export const stats = [
  { value: "100", label: "Year horizon" },
  { value: "40+", label: "Products shipped" },
  { value: "12", label: "Countries served" },
];

export const theName = {
  lead: "The name",
  century: "century",
  lens: "lens",
  body: "Xenturylens — a century seen through a lens. We make decisions for the version of your product that exists a hundred years from now.",
};

export const values = [
  { title: "Craft over speed", body: "We'd rather ship one thing properly than five things we'd be embarrassed by in a year." },
  { title: "Own the outcome", body: "We measure ourselves by what the product does in the world, not by hours billed." },
  { title: "Build to last", body: "Every decision is made for the version of the product that exists long after we're gone." },
];

export const people = [
  { name: "Founder", role: "Direction & Engineering" },
  { name: "Design Lead", role: "Product & Systems" },
  { name: "Engineer", role: "Platform & Mobile" },
  { name: "Engineer", role: "Frontend & Craft" },
];

export const contact = {
  email: "studio@xenturylens.com",
  workingWith: "Founders & teams, worldwide",
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test lib/content.test.ts`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: typed content data layer from mockup copy"
```

---

### Task 4: Primitives — Eyebrow, Section, Button, Reveal

**Files:**
- Create: `components/primitives/Eyebrow.tsx`, `components/primitives/Section.tsx`, `components/primitives/Button.tsx`, `components/primitives/Reveal.tsx`
- Create: `components/primitives/primitives.test.tsx`

**Interfaces:**
- Produces:
  - `Eyebrow({ children, className? })` — `<p>` with mono label styling.
  - `Section({ children, className?, id? })` — `<section>` wrapping a centered 1280px container with standard padding.
  - `Button({ href, children, variant?, className? })` — renders a Next `<Link>`; `variant: "primary" | "ghost"` (default `"primary"`).
  - `Reveal({ children, delay?, className?, as? })` — client component; fades + rises children on scroll into view; respects reduced motion.

- [ ] **Step 1: Write `Eyebrow.tsx`**

```tsx
import { cn } from "@/lib/cn";

export default function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs uppercase tracking-[0.18em] text-grey", className)}>
      {children}
    </p>
  );
}
```

- [ ] **Step 2: Write `Section.tsx`**

```tsx
import { cn } from "@/lib/cn";

export default function Section({
  children, className, id,
}: { children: React.ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={cn("py-20 md:py-28", className)}>
      <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">{children}</div>
    </section>
  );
}
```

- [ ] **Step 3: Write `Button.tsx`**

```tsx
import Link from "next/link";
import { cn } from "@/lib/cn";

export default function Button({
  href, children, variant = "primary", className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300 ease-[var(--ease-out-expo)] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const styles = {
    primary: "bg-ink text-surface hover:opacity-90",
    ghost: "border border-border text-ink hover:bg-surface-2",
  }[variant];
  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 4: Write `Reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Reveal({
  children, delay = 0, className,
}: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 5: Write render test `components/primitives/primitives.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Eyebrow from "./Eyebrow";
import Button from "./Button";

describe("primitives", () => {
  it("Eyebrow renders its label", () => {
    render(<Eyebrow>Selected work</Eyebrow>);
    expect(screen.getByText("Selected work")).toBeInTheDocument();
  });
  it("Button renders a link to its href", () => {
    render(<Button href="/work">See our work</Button>);
    const link = screen.getByRole("link", { name: "See our work" });
    expect(link).toHaveAttribute("href", "/work");
  });
});
```

- [ ] **Step 6: Run test**

Run: `pnpm test components/primitives/primitives.test.tsx`
Expected: PASS (2 tests).

- [ ] **Step 7: Typecheck + commit**

```bash
pnpm typecheck
git add -A
git commit -m "feat: layout primitives (Eyebrow, Section, Button, Reveal)"
```

---

### Task 5: Stat (count-up) and ImageSlot primitives

**Files:**
- Create: `components/primitives/Stat.tsx`, `components/primitives/ImageSlot.tsx`
- Create: `components/primitives/Stat.test.tsx`

**Interfaces:**
- Produces:
  - `Stat({ value, label })` — client; renders the final `value` string immediately (count-up is a visual enhancement) and animates a numeric portion when in view + motion allowed. Non-numeric values like `"40+"` render verbatim.
  - `ImageSlot({ label, className?, ratio? })` — designed gradient/typographic placeholder. `ratio` default `"16/10"`. Accepts `className` for sizing in a grid.

- [ ] **Step 1: Write failing test `components/primitives/Stat.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Stat from "./Stat";

describe("Stat", () => {
  it("renders the value and label", () => {
    render(<Stat value="40+" label="Products shipped" />);
    expect(screen.getByText("40+")).toBeInTheDocument();
    expect(screen.getByText("Products shipped")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test components/primitives/Stat.test.tsx`
Expected: FAIL — cannot find module `./Stat`.

- [ ] **Step 3: Write `Stat.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

export default function Stat({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const match = value.match(/^(\d+)(\D*)$/);
  const target = match ? parseInt(match[1], 10) : null;
  const suffix = match ? match[2] : "";
  const [display, setDisplay] = useState(target && !reduce ? "0" : value);

  useEffect(() => {
    if (target === null || reduce || !inView) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(String(Math.round(eased * target)) + suffix);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, suffix, value, reduce]);

  return (
    <div ref={ref}>
      <div className="font-display text-6xl md:text-7xl tracking-[-0.03em] text-ink">{display}</div>
      <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-grey">{label}</div>
    </div>
  );
}
```

Note: the test environment may not run the animation frames; the component renders `value` verbatim for non-numeric values and settles on `value` otherwise, so the assertion on `"40+"` holds.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test components/primitives/Stat.test.tsx`
Expected: PASS.

- [ ] **Step 5: Write `ImageSlot.tsx`**

```tsx
import { cn } from "@/lib/cn";

export default function ImageSlot({
  label, className, ratio = "16/10",
}: { label: string; className?: string; ratio?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-surface-2",
        className
      )}
      style={{ aspectRatio: ratio }}
    >
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(120% 120% at 0% 0%, color-mix(in oklab, var(--accent) 22%, transparent), transparent 55%), radial-gradient(120% 120% at 100% 100%, color-mix(in oklab, var(--accent) 14%, transparent), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 flex items-end p-5">
        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft">{label}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: Typecheck + test + commit**

```bash
pnpm typecheck && pnpm test
git add -A
git commit -m "feat: Stat count-up and ImageSlot placeholder primitives"
```

---

### Task 6: Layout — SiteHeader, SiteFooter, route transition template

**Files:**
- Create: `components/layout/SiteHeader.tsx`, `components/layout/SiteFooter.tsx`, `app/template.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `nav`, `contact` from `lib/content.ts`; `ThemeToggle`; `Button`.
- Produces: `SiteHeader` (client — scroll/active-link state), `SiteFooter` (server). `app/template.tsx` default export wrapping children in a motion crossfade.

- [ ] **Step 1: Write `SiteHeader.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/lib/content";
import { cn } from "@/lib/cn";
import ThemeToggle from "@/components/theme/ThemeToggle";

export default function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300 ease-[var(--ease-out-expo)]",
        scrolled
          ? "backdrop-blur-xl bg-[color-mix(in_oklab,var(--surface)_72%,transparent)] border-b border-border"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="font-display text-lg tracking-[-0.02em] text-ink">
          Xenturylens
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm transition-colors",
                  active ? "text-ink" : "text-ink-soft hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link
            href="/contact"
            className="hidden rounded-full bg-ink px-4 py-2 text-sm font-medium text-surface transition-opacity hover:opacity-90 sm:inline-flex"
          >
            Start a project
          </Link>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Write `SiteFooter.tsx`**

```tsx
import Link from "next/link";
import { nav, contact } from "@/lib/content";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="font-display text-2xl tracking-[-0.02em] text-ink">Xenturylens</p>
            <p className="mt-3 max-w-sm text-ink-soft">
              A global product engineering studio. We see beyond the product.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Explore</p>
              <ul className="mt-4 space-y-2">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-ink-soft hover:text-ink transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Connect</p>
              <ul className="mt-4 space-y-2 text-ink-soft">
                <li><a href={`mailto:${contact.email}`} className="hover:text-ink transition-colors">{contact.email}</a></li>
                <li><span>LinkedIn</span></li>
                <li><span>X / Twitter</span></li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.18em] text-grey">
          © 2026 Xenturylens. Built to last. · A hundred-year studio
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 3: Write `app/template.tsx` (route transition)**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Wire header/footer into `app/layout.tsx`**

Update the `<body>` content so it wraps children with header and footer:

```tsx
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
// ...within <body>, inside <ThemeProvider>:
<ThemeProvider>
  <SiteHeader />
  <div className="pt-16">{children}</div>
  <SiteFooter />
</ThemeProvider>
```

- [ ] **Step 5: Manual verify**

Run `pnpm dev`. Header is transparent at top, frosts + shows a border after scrolling 8px. Active nav link is full-ink. Theme toggle still works. Footer renders with email link.

- [ ] **Step 6: Typecheck + commit**

```bash
pnpm typecheck
git add -A
git commit -m "feat: site header, footer, and animated route transitions"
```

---

### Task 7: Home page sections (Hero, WhatWeDo, SelectedWork, Stats, CTA)

**Files:**
- Create: `components/sections/Hero.tsx`, `components/sections/WhatWeDo.tsx`, `components/sections/SelectedWork.tsx`, `components/sections/Stats.tsx`, `components/sections/CTA.tsx`, `components/Aurora.tsx`
- Modify: `app/page.tsx`
- Create: `app/page.test.tsx`

**Interfaces:**
- Consumes: `hero`, `services`, `work`, `stats` from content; `Eyebrow`, `Section`, `Button`, `Reveal`, `Stat`, `ImageSlot`.
- Produces: the five section components (server components except where noted) and `Aurora` (client, dark-only ambient glow). `TheName` is added in Task 11.

- [ ] **Step 1: Write `Aurora.tsx`**

```tsx
"use client";

export default function Aurora() {
  // Visible only in dark mode (token --glow is transparent in light).
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute left-1/2 top-[-10%] h-[600px] w-[900px] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: "var(--glow)" }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Write `Hero.tsx`**

```tsx
import { hero } from "@/lib/content";
import Eyebrow from "@/components/primitives/Eyebrow";
import Button from "@/components/primitives/Button";
import Aurora from "@/components/Aurora";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <Aurora />
      <div className="mx-auto max-w-[1280px] px-6 pb-24 pt-32 md:px-10 md:pb-32 md:pt-44">
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="mt-6 max-w-[15ch] font-display text-5xl font-semibold leading-[1.02] tracking-[-0.04em] text-ink md:text-7xl lg:text-[88px]">
          {hero.title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-soft">{hero.body}</p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
          <Button href={hero.secondaryCta.href} variant="ghost">{hero.secondaryCta.label}</Button>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write `WhatWeDo.tsx`**

```tsx
import { services } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/primitives/Reveal";

export default function WhatWeDo() {
  return (
    <Section className="border-t border-border">
      <Eyebrow>What we do</Eyebrow>
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
        {services.map((s, i) => (
          <Reveal key={s.no} delay={i * 0.05}>
            <div className="h-full bg-surface p-8 md:p-10">
              <span className="font-mono text-xs text-grey">{s.no}</span>
              <h3 className="mt-4 font-display text-2xl tracking-[-0.02em] text-ink">{s.title}</h3>
              <p className="mt-3 text-ink-soft">{s.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 4: Write `SelectedWork.tsx`**

```tsx
import Link from "next/link";
import { work } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function SelectedWork() {
  return (
    <Section>
      <div className="flex items-end justify-between">
        <Eyebrow>Selected work</Eyebrow>
        <Link href="/work" className="text-sm text-ink-soft hover:text-ink transition-colors">
          View all →
        </Link>
      </div>
      <div className="mt-12 grid gap-8 md:grid-cols-2">
        {work.slice(0, 2).map((w, i) => (
          <Reveal key={w.slug} delay={i * 0.06}>
            <Link href="/work" className="group block">
              <ImageSlot label={w.name} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-xl tracking-[-0.02em] text-ink">{w.name}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{w.meta}</p>
            </Link>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 5: Write `Stats.tsx`**

```tsx
import { stats } from "@/lib/content";
import Section from "@/components/primitives/Section";
import Stat from "@/components/primitives/Stat";

export default function Stats() {
  return (
    <Section className="bg-surface-2">
      <div className="grid gap-12 sm:grid-cols-3">
        {stats.map((s) => (
          <Stat key={s.label} value={s.value} label={s.label} />
        ))}
      </div>
    </Section>
  );
}
```

- [ ] **Step 6: Write `CTA.tsx`**

```tsx
import Section from "@/components/primitives/Section";
import Button from "@/components/primitives/Button";

export default function CTA() {
  return (
    <Section className="border-t border-border">
      <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
        <h2 className="max-w-[18ch] font-display text-4xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
          Let&apos;s build something that outlives the trend cycle.
        </h2>
        <Button href="/contact">Start a project →</Button>
      </div>
    </Section>
  );
}
```

- [ ] **Step 7: Compose `app/page.tsx`** (TheName added in Task 11)

```tsx
import Hero from "@/components/sections/Hero";
import WhatWeDo from "@/components/sections/WhatWeDo";
import SelectedWork from "@/components/sections/SelectedWork";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <SelectedWork />
      <Stats />
      <CTA />
    </main>
  );
}
```

- [ ] **Step 8: Write `app/page.test.tsx`**

```tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the hero headline and section labels", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { name: /hundred years/i })).toBeInTheDocument();
    expect(screen.getByText("What we do")).toBeInTheDocument();
    expect(screen.getByText("Selected work")).toBeInTheDocument();
  });
});
```

- [ ] **Step 9: Run test, typecheck, manual verify**

Run: `pnpm test app/page.test.tsx && pnpm typecheck`
Expected: PASS. Then `pnpm dev`: hero shows aurora glow in dark mode only; cards reveal on scroll; stats count up; hover lifts work cards.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: home page sections (hero, what we do, work, stats, CTA)"
```

---

### Task 8: Work page

**Files:**
- Create: `components/sections/WorkGrid.tsx`, `app/work/page.tsx`

**Interfaces:**
- Consumes: `work` from content; `Section`, `Eyebrow`, `Reveal`, `ImageSlot`.
- Produces: `WorkGrid` (server) and the `/work` route. `generateMetadata`/`metadata` export on the page.

- [ ] **Step 1: Write `WorkGrid.tsx`**

```tsx
import { work } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function WorkGrid() {
  const [featured, ...rest] = work;
  return (
    <div className="space-y-16">
      <Reveal>
        <article>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Featured · Mobility</p>
          <ImageSlot label={featured.name} ratio="21/9" className="mt-5" />
          <h2 className="mt-6 font-display text-3xl tracking-[-0.03em] text-ink md:text-4xl">{featured.name}</h2>
          <p className="mt-3 max-w-2xl text-ink-soft">{featured.blurb}</p>
        </article>
      </Reveal>
      <div className="grid gap-10 md:grid-cols-2">
        {rest.map((w, i) => (
          <Reveal key={w.slug} delay={i * 0.06}>
            <article className="group">
              <ImageSlot label={w.name} className="transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1" />
              <h3 className="mt-5 font-display text-xl tracking-[-0.02em] text-ink">{w.name}</h3>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{w.meta}</p>
              <p className="mt-3 text-ink-soft">{w.blurb}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Write `app/work/page.tsx`**

```tsx
import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import WorkGrid from "@/components/sections/WorkGrid";

export const metadata: Metadata = {
  title: "Work — Xenturylens",
  description: "Products we shipped, and still tend to.",
};

export default function WorkPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Selected work</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          Products we shipped, and still tend to.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          A studio is judged by what survives. These are built to.
        </p>
      </Section>
      <Section className="pt-0">
        <WorkGrid />
      </Section>
    </main>
  );
}
```

- [ ] **Step 3: Typecheck + manual verify + commit**

```bash
pnpm typecheck
# pnpm dev -> visit /work
git add -A
git commit -m "feat: work page with featured + grid"
```

---

### Task 9: Services page (ServiceList + ProcessSteps)

**Files:**
- Create: `components/sections/ServiceList.tsx`, `components/sections/ProcessSteps.tsx`, `app/services/page.tsx`

**Interfaces:**
- Consumes: `services`, `process` from content; `Section`, `Eyebrow`, `Reveal`.
- Produces: `ServiceList`, `ProcessSteps` (server) and `/services` route with metadata.

- [ ] **Step 1: Write `ServiceList.tsx`**

```tsx
import { services } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function ServiceList() {
  return (
    <div className="divide-y divide-border border-y border-border">
      {services.map((s, i) => (
        <Reveal key={s.no} delay={i * 0.04}>
          <div className="grid gap-4 py-10 md:grid-cols-[120px_1fr] md:py-12">
            <span className="font-mono text-sm text-grey">{s.no}</span>
            <div>
              <h3 className="font-display text-2xl tracking-[-0.02em] text-ink md:text-3xl">{s.title}</h3>
              <p className="mt-3 max-w-2xl text-ink-soft">{s.body}</p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `ProcessSteps.tsx`**

```tsx
import { process } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function ProcessSteps() {
  return (
    <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2 lg:grid-cols-4">
      {process.map((p, i) => (
        <Reveal key={p.no} delay={i * 0.05}>
          <div className="h-full bg-surface p-8">
            <span className="font-mono text-xs text-grey">{p.no}</span>
            <h3 className="mt-4 font-display text-xl tracking-[-0.02em] text-ink">{p.title}</h3>
            <p className="mt-3 text-sm text-ink-soft">{p.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write `app/services/page.tsx`**

```tsx
import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import ServiceList from "@/components/sections/ServiceList";
import ProcessSteps from "@/components/sections/ProcessSteps";

export const metadata: Metadata = {
  title: "Services — Xenturylens",
  description: "How we build. One team, end to end.",
};

export default function ServicesPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>How we build</Eyebrow>
        <h1 className="mt-6 max-w-[16ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          How we build.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          One team, end to end — from the first question to the products that outlast us. No hand-offs, no dilution.
        </p>
      </Section>
      <Section className="pt-0"><ServiceList /></Section>
      <Section className="bg-surface-2">
        <Eyebrow>The process</Eyebrow>
        <div className="mt-12"><ProcessSteps /></div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Typecheck + manual verify + commit**

```bash
pnpm typecheck
git add -A
git commit -m "feat: services page with service list and process steps"
```

---

### Task 10: Studio page (Values + People)

**Files:**
- Create: `components/sections/Values.tsx`, `components/sections/People.tsx`, `app/studio/page.tsx`

**Interfaces:**
- Consumes: `values`, `people` from content; `Section`, `Eyebrow`, `Reveal`, `ImageSlot`.
- Produces: `Values`, `People` (server) and `/studio` route with metadata.

- [ ] **Step 1: Write `Values.tsx`**

```tsx
import { values } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";

export default function Values() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {values.map((v, i) => (
        <Reveal key={v.title} delay={i * 0.05}>
          <div className="rounded-2xl border border-border p-8">
            <h3 className="font-display text-xl tracking-[-0.02em] text-ink">{v.title}</h3>
            <p className="mt-3 text-ink-soft">{v.body}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write `People.tsx`**

```tsx
import { people } from "@/lib/content";
import Reveal from "@/components/primitives/Reveal";
import ImageSlot from "@/components/primitives/ImageSlot";

export default function People() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {people.map((p, i) => (
        <Reveal key={`${p.name}-${i}`} delay={i * 0.05}>
          <div>
            <ImageSlot label={p.name} ratio="1/1" />
            <h3 className="mt-4 font-display text-lg tracking-[-0.02em] text-ink">{p.name}</h3>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.14em] text-grey">{p.role}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write `app/studio/page.tsx`**

```tsx
import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import Values from "@/components/sections/Values";
import People from "@/components/sections/People";

export const metadata: Metadata = {
  title: "Studio — Xenturylens",
  description: "A small team with a long horizon.",
};

export default function StudioPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>The studio</Eyebrow>
        <h1 className="mt-6 max-w-[18ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          A small team with a long horizon.
        </h1>
      </Section>
      <Section className="pt-0"><Values /></Section>
      <Section className="border-t border-border">
        <Eyebrow>The people</Eyebrow>
        <div className="mt-12"><People /></div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 4: Typecheck + manual verify + commit**

```bash
pnpm typecheck
git add -A
git commit -m "feat: studio page with values and people"
```

---

### Task 11: Scroll-pinned "The name" moment

**Files:**
- Create: `components/sections/TheName.tsx`
- Modify: `app/page.tsx` (insert `TheName` between `SelectedWork` and `Stats`)

**Interfaces:**
- Consumes: `theName` from content; `motion/react` (`useScroll`, `useTransform`, `useReducedMotion`).
- Produces: `TheName` (client). Reduced-motion path renders a static centered version.

- [ ] **Step 1: Write `TheName.tsx`**

```tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { theName } from "@/lib/content";

export default function TheName() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 1, 0.2]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  if (reduce) {
    return (
      <section className="border-t border-border py-28">
        <div className="mx-auto max-w-[1280px] px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">{theName.lead}</p>
          <p className="mt-8 max-w-3xl font-display text-3xl leading-tight tracking-[-0.02em] text-ink md:text-4xl">
            {theName.body}
          </p>
        </div>
      </section>
    );
  }

  // Tall track; inner content pins to viewport center and reacts to scroll.
  return (
    <section ref={ref} className="relative h-[180vh] border-t border-border">
      <div className="sticky top-0 flex h-screen items-center">
        <div className="mx-auto w-full max-w-[1280px] px-6 md:px-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">{theName.lead}</p>
          <motion.p
            style={{ opacity, scale, transformOrigin: "left center" }}
            className="mt-8 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-ink md:text-6xl"
          >
            Xenturylens — a <span className="text-accent">{theName.century}</span> seen through a{" "}
            <span className="text-accent">{theName.lens}</span>. We make decisions for the version of
            your product that exists a hundred years from now.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Insert into `app/page.tsx`**

```tsx
import Hero from "@/components/sections/Hero";
import WhatWeDo from "@/components/sections/WhatWeDo";
import SelectedWork from "@/components/sections/SelectedWork";
import TheName from "@/components/sections/TheName";
import Stats from "@/components/sections/Stats";
import CTA from "@/components/sections/CTA";

export default function Home() {
  return (
    <main>
      <Hero />
      <WhatWeDo />
      <SelectedWork />
      <TheName />
      <Stats />
      <CTA />
    </main>
  );
}
```

- [ ] **Step 3: Manual verify (both motion settings)**

Run `pnpm dev`. Normal: scrolling through "The name" pins the text and scales/fades it; "century" and "lens" are accent-colored. With OS reduced-motion on: a static, non-pinned version renders, no tall track.

- [ ] **Step 4: Typecheck + commit**

```bash
pnpm typecheck
git add -A
git commit -m "feat: scroll-pinned 'The name' moment with reduced-motion fallback"
```

---

### Task 12: Contact form + Resend Server Action

**Files:**
- Create: `app/contact/actions.ts`, `lib/contact-schema.ts`, `components/sections/ContactForm.tsx`, `app/contact/page.tsx`
- Create: `lib/contact-schema.test.ts`

**Interfaces:**
- Produces:
  - `lib/contact-schema.ts` exports `contactSchema` (Zod) and `type ContactInput`.
  - `app/contact/actions.ts` exports `submitEnquiry(prev: ContactState, formData: FormData): Promise<ContactState>` where `type ContactState = { status: "idle" | "success" | "error"; message?: string; fieldErrors?: Record<string, string> }`.
  - `ContactForm` (client) uses `useActionState(submitEnquiry, { status: "idle" })`.

- [ ] **Step 1: Write failing test `lib/contact-schema.test.ts`**

```ts
import { describe, it, expect } from "vitest";
import { contactSchema } from "./contact-schema";

describe("contactSchema", () => {
  it("accepts a valid enquiry", () => {
    const r = contactSchema.safeParse({
      name: "Ada", email: "ada@example.com", company: "Analytical", message: "We are building a platform.",
    });
    expect(r.success).toBe(true);
  });
  it("rejects a bad email", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "nope", company: "", message: "Hello there friend." });
    expect(r.success).toBe(false);
  });
  it("requires a message of reasonable length", () => {
    const r = contactSchema.safeParse({ name: "Ada", email: "ada@example.com", company: "", message: "hi" });
    expect(r.success).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test lib/contact-schema.test.ts`
Expected: FAIL — cannot find module `./contact-schema`.

- [ ] **Step 3: Write `lib/contact-schema.ts`**

```ts
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Please enter your name."),
  email: z.string().email("Please enter a valid email."),
  company: z.string().optional().default(""),
  message: z.string().min(10, "Tell us a little more (at least 10 characters)."),
});

export type ContactInput = z.infer<typeof contactSchema>;
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm test lib/contact-schema.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Write `app/contact/actions.ts`**

```ts
"use server";

import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitEnquiry(_prev: ContactState, formData: FormData): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    company: formData.get("company") ?? "",
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Please fix the highlighted fields.", fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    return { status: "error", message: "Email isn't configured yet. Reach us at studio@xenturylens.com." };
  }

  const { name, email, company, message } = parsed.data;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [to],
    replyTo: email,
    subject: `New enquiry from ${name}`,
    html: `<h2>New enquiry</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Company:</strong> ${company || "—"}</p>
      <p><strong>Building:</strong></p><p>${message}</p>`,
  });

  if (error) {
    return { status: "error", message: "Something went wrong sending your enquiry. Please email us directly." };
  }
  return { status: "success", message: "Thank you — we reply to every serious enquiry within two business days." };
}
```

- [ ] **Step 6: Write `ContactForm.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { submitEnquiry, type ContactState } from "@/app/contact/actions";

const initial: ContactState = { status: "idle" };

function Field({
  label, name, type = "text", error,
}: { label: string; name: string; type?: string; error?: string }) {
  return (
    <label className="block">
      <span className="font-mono text-xs uppercase tracking-[0.16em] text-grey">{label}</span>
      <input
        name={name}
        type={type}
        className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink outline-none focus:border-accent"
      />
      {error && <span className="mt-1 block text-sm text-accent">{error}</span>}
    </label>
  );
}

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(submitEnquiry, initial);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-border bg-surface-2 p-8">
        <p className="font-display text-2xl tracking-[-0.02em] text-ink">Enquiry sent.</p>
        <p className="mt-3 text-ink-soft">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-6 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.fieldErrors?.name} />
        <Field label="Email" name="email" type="email" error={state.fieldErrors?.email} />
      </div>
      <Field label="Company" name="company" error={state.fieldErrors?.company} />
      <label className="block">
        <span className="font-mono text-xs uppercase tracking-[0.16em] text-grey">What are you building?</span>
        <textarea
          name="message"
          rows={5}
          className="mt-2 w-full rounded-xl border border-border bg-surface px-4 py-3 text-ink outline-none focus:border-accent"
        />
        {state.fieldErrors?.message && (
          <span className="mt-1 block text-sm text-accent">{state.fieldErrors.message}</span>
        )}
      </label>
      {state.status === "error" && !state.fieldErrors && (
        <p className="text-sm text-accent">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-surface transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
```

- [ ] **Step 7: Write `app/contact/page.tsx`**

```tsx
import type { Metadata } from "next";
import Section from "@/components/primitives/Section";
import Eyebrow from "@/components/primitives/Eyebrow";
import ContactForm from "@/components/sections/ContactForm";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — Xenturylens",
  description: "Let's build something that lasts.",
};

export default function ContactPage() {
  return (
    <main>
      <Section className="pt-32 md:pt-40">
        <Eyebrow>Contact</Eyebrow>
        <h1 className="mt-6 max-w-[14ch] font-display text-5xl font-semibold leading-[1.04] tracking-[-0.035em] text-ink md:text-6xl">
          Let&apos;s build something that lasts.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-ink-soft">
          Tell us what you&apos;re making. We reply to every serious enquiry within two business days.
        </p>
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <ContactForm />
          <aside className="space-y-8">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Email</p>
              <a href={`mailto:${contact.email}`} className="mt-2 block text-ink hover:text-accent transition-colors">
                {contact.email}
              </a>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-grey">Working with</p>
              <p className="mt-2 text-ink">{contact.workingWith}</p>
            </div>
          </aside>
        </div>
      </Section>
    </main>
  );
}
```

- [ ] **Step 8: Verify validation + degraded state**

Run `pnpm dev`, visit `/contact`. Submitting empty shows field errors. With no `RESEND_API_KEY`, a valid submit shows the "Email isn't configured yet" message (not a crash). (Real send is verified once a key is set in Task 13/deploy.)

- [ ] **Step 9: Typecheck + test + commit**

```bash
pnpm typecheck && pnpm test
git add -A
git commit -m "feat: contact form with Zod validation and Resend server action"
```

---

### Task 13: Motion polish, metadata/OG, a11y & responsive pass, build, deploy

**Files:**
- Create: `components/primitives/MagneticButton.tsx` (optional enhancement), `app/opengraph-image.tsx`
- Modify: `app/layout.tsx` (metadataBase, themeColor, OG defaults), various components for responsive/a11y fixes found during the pass.

**Interfaces:**
- Consumes: existing components.
- Produces: site-wide metadata defaults and an OG image; verified production build.

- [ ] **Step 1: Add metadata base, themeColor, and OG defaults in `app/layout.tsx`**

```tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://xenturylens.com"),
  title: { default: "Xenturylens — Product engineering studio", template: "%s · Xenturylens" },
  description: "Software built to last a hundred years.",
  openGraph: {
    title: "Xenturylens",
    description: "Software built to last a hundred years.",
    type: "website",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};
```

- [ ] **Step 2: Add `app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%", display: "flex", flexDirection: "column",
          justifyContent: "center", padding: 80, background: "#08090a", color: "#f5f5f7",
        }}
      >
        <div style={{ fontSize: 28, color: "#86868b", letterSpacing: 4 }}>XENTURYLENS</div>
        <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1.05, marginTop: 24, maxWidth: 900 }}>
          Software built to last a hundred years.
        </div>
      </div>
    ),
    { ...size }
  );
}
```

- [ ] **Step 3: Accessibility & responsive pass (checklist)**

Walk every route at 375px, 768px, 1280px and verify, fixing inline:
- No horizontal scroll; hero/headlines wrap and scale down on mobile.
- The mobile nav: since the desktop `<nav>` is `hidden md:flex`, add a minimal mobile affordance — show the primary links inline below the logo OR keep "Start a project" + toggle visible (acceptable for v1; note if a full mobile menu is wanted).
- All interactive elements show a visible focus ring (the `focus-visible:outline-accent` is present on Button; confirm header links and form controls too — add `focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent` where missing).
- Color contrast: verify `--ink-soft` on `--surface` meets AA in both themes; darken light `--ink-soft` if needed.
- Run with OS reduced-motion enabled: no pinned track, reveals instant, route transition skipped.

- [ ] **Step 4: Lint + typecheck + test + production build**

Run:
```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```
Expected: all pass; `pnpm build` completes with all five routes prerendered and no type/lint errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: metadata, OG image, accessibility and responsive polish"
```

- [ ] **Step 6: Deploy to Vercel**

```bash
pnpm dlx vercel@latest link
pnpm dlx vercel@latest env add RESEND_API_KEY production
pnpm dlx vercel@latest env add CONTACT_TO_EMAIL production
pnpm dlx vercel@latest env add CONTACT_FROM_EMAIL production
pnpm dlx vercel@latest --prod
```
Expected: production URL returned. Verify each route loads, theme toggle persists, and (with a verified Resend domain) the contact form sends a real email. If the Resend sending domain isn't verified yet, the form shows the degraded message until it is.

---

## Self-Review

**Spec coverage:**
- Dual-personality theming → Task 1 (tokens) + Task 2 (system). ✓
- No-flash + persisted toggle → Task 2. ✓
- Five real routes + shared layout + transitions → Tasks 6–12. ✓
- Apple typography / whitespace → Task 1 fonts + Task 7 hero scale. ✓
- Scroll-pinned "The name" → Task 11. ✓
- Count-up stats → Task 5/7. ✓
- Ambient aurora (dark) → Task 7 (`Aurora`, `--glow`). ✓
- Magnetic/hover/animated reveals → Reveal (Task 4), hover lifts (Tasks 7–8), magnetic button noted optional (Task 13). ✓
- Contact via Resend + Zod + degraded state → Task 12. ✓
- Content hardcoded, single module → Task 3. ✓
- Metadata/OG per route → page-level metadata (Tasks 8–12) + defaults/OG (Task 13). ✓
- Reduced-motion honored → globals.css (Task 1), Reveal/Stat/TheName/template guards. ✓
- Designed placeholders w/ swap-in → ImageSlot (Task 5). ✓

**Placeholder scan:** No "TBD"/"add error handling here" without code. The one explicitly optional item (MagneticButton) is marked optional and the site is complete without it. Mobile-menu decision is flagged for the reviewer in Task 13 Step 3 rather than left silently incomplete.

**Type consistency:** `Theme`, `THEME_KEY`, `resolveInitialTheme`, `THEME_SCRIPT` consistent across Task 2. `ContactState` defined in `actions.ts` and imported by `ContactForm` (Task 12). `contactSchema`/`ContactInput` consistent (Task 12). Content export names used by sections match Task 3 definitions (`hero`, `services`, `process`, `work`, `stats`, `values`, `people`, `theName`, `contact`, `nav`).

**Known follow-ups (not blockers):** real brand assets to replace ImageSlot; full mobile menu if desired; Resend domain verification for production sends.
