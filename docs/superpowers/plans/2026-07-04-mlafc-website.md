# Mumbai London AF Clinic Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the full 6-page "Midnight Atlas" website for the Mumbai London AF Clinic (Prof Dhiraj Gupta) in Next.js + Tailwind v4, per the approved spec `docs/superpowers/specs/2026-07-04-mlafc-website-design.md`.

**Architecture:** Static Next.js App Router site. All content lives in `data/` files; components are dumb renderers. One shared reveal/animation system, one shared Leaflet map component used on the homepage and `/locations`. The only server code is a single enquiry-form server action stub.

**Tech Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Leaflet + react-leaflet + leaflet.markercluster · Vitest + Testing Library.

## Global Constraints

Every task's requirements implicitly include all of these:

1. **GMC/ASA guardrail (non-negotiable):** Never state RFA is better, safer, or more effective than PFA (or vice versa). All comparisons factual and non-superlative. Every clinical claim on the Evidence page carries a citation. Placeholder citations are marked `[CITATION - verify]`.
2. **Tone:** clean, professional, very easy to understand. Short sentences, plain English, no jargon without an immediate plain-language explanation. Patients may be older and non-technical.
3. **Palette:** exactly the 11 tokens from the spec (`--paper #F7F5F1`, `--ink #122B3A`, `--ink-soft #3A5468`, `--ink-mute #6B7F8E`, `--brass #B08D3E`, `--brass-deep #8F7231`, `--paper-soft #EFEBE3`, `--night #0C1F2B`, `--night-soft #16303F`, `--line #D9D3C7`, `--line-dark #2A4254`). Defined once as CSS variables in the Tailwind theme; never hardcode hexes in components.
4. **Contrast:** all text/background pairs must pass WCAG AA. On dark sections body text is `paper`. `brass` on dark is for accents and large display text only. `ink-mute` is only for text ≥ 19px or non-essential labels; secondary body text on light uses `ink-soft`.
5. **Dark rhythm:** maximum two `night` (`bg-night`) sections per page. The final CTA band uses `bg-ink` (dark but not "night") and does not count.
6. **Typography:** Newsreader (display serif, weights 400/500 + italic) and Archivo (sans, weights 400/500/600) via `next/font/google`. Body 17–18px, line-height ≥ 1.6.
7. **Motion:** every animation gated behind `prefers-reduced-motion: reduce`, when set, everything renders in its final state instantly. Nothing bouncy, no parallax.
8. **Content as data:** editing content (dates, locations, testimonials, milestones, FAQs, contact details) never requires touching components.
9. **Placeholders:** client-supplied assets/details use visible placeholder frames or the literal text `[placeholder]`. Contact details live only in `data/site.ts`.
10. **Commits:** conventional commits (`feat:`, `test:`, `chore:`), one commit per task minimum, run `npm test` and `npm run build` before each commit that touches code.
11. **Reference content:** the original pages live at `reference/mumbai-london-af-clinic.html`, `reference/journey.html`, `reference/testimonials.html` after Task 1. Line numbers cited in tasks refer to those files (content is unchanged by the move). They are deleted in Task 17.

---

### Task 1: Scaffold, design tokens, fonts, test harness

**Files:**
- Move: `mumbai-london-af-clinic.html`, `journey.html`, `testimonials.html`, `cursor-prompt-af-clinic.md`, `WhatsApp Image 2026-07-04 at 15.51.39.jpeg` → `reference/`
- Create: Next.js app at repo root (`app/`, `package.json`, `tsconfig.json`, …)
- Modify: `app/globals.css`, `app/layout.tsx`
- Create: `vitest.config.mts`, `vitest.setup.ts`, `test/mocks.ts`
- Test: `test/smoke.test.tsx`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: Tailwind utilities `bg-paper`, `text-ink`, `bg-night`, `text-brass`, etc. for every token; `font-serif` (Newsreader) and `font-sans` (Archivo) utilities; global CSS classes `.reveal` / `.reveal-visible`; `npm test` (vitest) and `npm run build` working; `@/*` import alias; `MockIntersectionObserver` helper in `test/mocks.ts`.

- [ ] **Step 1: Move reference files and scaffold**

```bash
mkdir -p reference
git mv mumbai-london-af-clinic.html journey.html testimonials.html cursor-prompt-af-clinic.md reference/
git mv "WhatsApp Image 2026-07-04 at 15.51.39.jpeg" reference/logo-original.jpeg
git commit -m "chore: move existing pages to reference/"

npx create-next-app@latest .scaffold --typescript --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
# CRITICAL: exclude .git, create-next-app inits its own repo and rsync would clobber ours
rsync -a --exclude='.git' --exclude='node_modules' .scaffold/ ./
rm -rf .scaffold
npm install
```

Check `.gitignore` after the copy: it must still ignore `node_modules`, `.next`, and `*.tsbuildinfo` (the scaffold's version covers these; merge in anything the original 36-byte `.gitignore` had that is missing).

Expected: `app/`, `package.json`, `next.config.ts` exist at repo root; `npm run build` succeeds.

- [ ] **Step 2: Install test harness**

```bash
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Create `vitest.config.mts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, '.') },
  },
});
```

Create `vitest.setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';

// Default matchMedia mock (reduced motion OFF). Tests can override.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
```

Create `test/mocks.ts`:

```ts
export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  elements = new Set<Element>();
  constructor(public callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) { this.elements.add(el); }
  unobserve(el: Element) { this.elements.delete(el); }
  disconnect() { this.elements.clear(); }
  takeRecords() { return []; }
  root = null; rootMargin = ''; thresholds = [];
  trigger(isIntersecting: boolean) {
    const entries = [...this.elements].map((target) => ({ target, isIntersecting } as IntersectionObserverEntry));
    this.callback(entries, this as unknown as IntersectionObserver);
  }
  static reset() { MockIntersectionObserver.instances = []; }
  static install() {
    MockIntersectionObserver.reset();
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = MockIntersectionObserver;
  }
}

export function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
```

Add to `package.json` scripts: `"test": "vitest run"`.

Add vitest globals to `tsconfig.json` → `compilerOptions`:

```json
"types": ["vitest/globals", "@testing-library/jest-dom"]
```

- [ ] **Step 3: Write failing smoke test**

Create `test/smoke.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';

test('test harness renders JSX', () => {
  render(<p>midnight atlas</p>);
  expect(screen.getByText('midnight atlas')).toBeInTheDocument();
});
```

Run: `npm test`, expected: PASS (this validates the harness; if it fails, fix config before continuing).

- [ ] **Step 4: Design tokens and fonts**

Replace `app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --color-paper: #F7F5F1;
  --color-ink: #122B3A;
  --color-ink-soft: #3A5468;
  --color-ink-mute: #6B7F8E;
  --color-brass: #B08D3E;
  --color-brass-deep: #8F7231;
  --color-paper-soft: #EFEBE3;
  --color-night: #0C1F2B;
  --color-night-soft: #16303F;
  --color-line: #D9D3C7;
  --color-line-dark: #2A4254;
  --font-sans: var(--font-archivo), system-ui, sans-serif;
  --font-serif: var(--font-newsreader), Georgia, serif;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-sans);
  font-size: 17px;
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}

@media (min-width: 768px) {
  body { font-size: 18px; }
}

:focus-visible {
  outline: 2px solid var(--color-brass-deep);
  outline-offset: 2px;
}

/* Shared reveal animation (driven by useReveal, Task 5) */
.reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity 0.6s cubic-bezier(0.22, 0.61, 0.36, 1),
    transform 0.6s cubic-bezier(0.22, 0.61, 0.36, 1);
}
.reveal-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  .reveal { opacity: 1; transform: none; transition: none; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from 'next';
import { Newsreader, Archivo } from 'next/font/google';
import './globals.css';

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500'],
  variable: '--font-newsreader',
});

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-archivo',
});

export const metadata: Metadata = {
  title: 'Mumbai London AF Clinic',
  description:
    'Specialist atrial fibrillation care in Mumbai from Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${newsreader.variable} ${archivo.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Delete the default `app/page.tsx` content and replace with a minimal placeholder (rebuilt in Task 10):

```tsx
export default function Home() {
  return <main className="min-h-screen bg-paper text-ink p-10 font-serif text-3xl">Mumbai London AF Clinic</main>;
}
```

- [ ] **Step 5: Verify build and tests**

Run: `npm test && npm run build`
Expected: smoke test PASS; build succeeds with no type errors.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with Midnight Atlas tokens, fonts, and test harness"
```

---

### Task 2: Content types, site config, locations and visits data

**Files:**
- Create: `data/types.ts`, `data/site.ts`, `data/locations.json`, `data/visits.json`, `data/README.md`
- Test: `test/data.locations.test.ts`

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `data/types.ts` exports `Location`, `Visit`, `Testimonial`, `TestimonialLetter`, `Milestone`, `Faq`, `Citation` (exact shapes below, later tasks import these).
  - `data/site.ts` exports `site` object: `{ name, tagline, phone, whatsappNumber, whatsappHref, email, address, gmcLine, disclaimer, responseDays }`.
  - `data/locations.json`: array of 12 `Location` entries.
  - `data/visits.json`: array of 3 `Visit` entries.

- [ ] **Step 1: Write failing data test**

Create `test/data.locations.test.ts`:

```ts
import locations from '@/data/locations.json';
import visits from '@/data/visits.json';
import { site } from '@/data/site';

test('locations: 12 entries with required fields', () => {
  expect(locations).toHaveLength(12);
  for (const l of locations) {
    expect(typeof l.id).toBe('string');
    expect(typeof l.name).toBe('string');
    expect(typeof l.country).toBe('string');
    expect(typeof l.lat).toBe('number');
    expect(typeof l.lng).toBe('number');
    expect(['operated', 'taught', 'proctored']).toContain(l.role);
    expect(typeof l.years).toBe('string');
    expect(l.blurb.length).toBeGreaterThan(20);
    expect(Array.isArray(l.images)).toBe(true);
  }
});

test('locations: Liverpool and Mumbai present; 5 UK pins', () => {
  const names = locations.map((l) => l.name);
  expect(names).toContain('Liverpool Heart and Chest Hospital');
  expect(names.some((n) => n.includes('Mumbai'))).toBe(true);
  expect(locations.filter((l) => l.country === 'United Kingdom')).toHaveLength(5);
});

test('visits: 3 entries with valid statuses', () => {
  expect(visits).toHaveLength(3);
  for (const v of visits) {
    expect(['open', 'waitlist', 'tbc']).toContain(v.status);
    expect(v.month).toMatch(/2026/);
  }
});

test('site config has contact placeholders', () => {
  expect(site.whatsappHref).toMatch(/^https:\/\/wa\.me\//);
  expect(site.email).toContain('@');
  expect(site.gmcLine).toMatch(/GMC/);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, cannot resolve `@/data/locations.json`.

- [ ] **Step 3: Create the data files**

Create `data/types.ts`:

```ts
export type LocationRole = 'operated' | 'taught' | 'proctored';

export type Location = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  role: LocationRole;
  years: string;
  blurb: string;
  images: string[];
  readMore?: string;
};

export type Visit = {
  id: string;
  month: string; // e.g. "[March] 2026" until client confirms
  status: 'open' | 'waitlist' | 'tbc';
  note: string;
};

export type TestimonialLetter = {
  tag: string;
  org: string;
  subtitle: string;
  date: string;
  body: string[];
  sigName: string;
  sigRole: string;
};

export type Testimonial = {
  id: string;
  category: 'hospital' | 'patient' | 'peer' | 'news';
  quote: string;
  attribution: string;
  detail?: string;
  masthead?: string; // news only
  date?: string; // news only
  headline?: string; // news only
  letter?: TestimonialLetter; // hospital only
};

export type Milestone = {
  markerYear: string; // "1988"
  markerSub: string; // "The beginning"
  yearLabel: string; // "1988 to 1994"
  tag: string; // "Foundation"
  title: string;
  body: string;
  meta?: string;
  photoTitle: string;
  photoCaption: string;
};

export type Faq = { question: string; answer: string };

export type Citation = { id: number; text: string };
```

Create `data/site.ts`:

```ts
export const site = {
  name: 'Mumbai London AF Clinic',
  tagline: 'London expertise. Mumbai care. Continuous follow-up.',
  phone: '+91 00000 00000 [placeholder]',
  whatsappNumber: '+91 00000 00000 [placeholder]',
  whatsappHref: 'https://wa.me/910000000000', // [placeholder, client supplies]
  email: 'hello@mumbailondonaf.com', // [placeholder, client confirms]
  address: 'Clinic address, Mumbai [placeholder]',
  gmcLine: 'Professor Dhiraj Gupta is registered with the UK General Medical Council (GMC no. 0000000 [placeholder]).',
  disclaimer:
    'Information on this site is for general education and is not a substitute for individual medical advice. Always consult a doctor about your own condition.',
  responseDays: 'X [placeholder]',
} as const;
```

Create `data/locations.json` (all 12 entries below, complete). JSON does not allow comments, so the spec's "clearly marked placeholder" requirement is met two ways: unverified entries carry `[placeholder]` in their `years`/`blurb` fields, and `data/README.md` (created below) states the file-level warning:

```json
[
  {
    "id": "liverpool",
    "name": "Liverpool Heart and Chest Hospital",
    "country": "United Kingdom",
    "lat": 53.4287,
    "lng": -2.9044,
    "role": "operated",
    "years": "2007 to present",
    "blurb": "Consultant cardiologist and electrophysiologist at the UK's largest specialist cardiothoracic centre, performing 200+ AF ablations a year.",
    "images": [],
    "readMore": "/journey"
  },
  {
    "id": "london-imperial",
    "name": "Imperial College London",
    "country": "United Kingdom",
    "lat": 51.4988,
    "lng": -0.1749,
    "role": "taught",
    "years": "2011 to present",
    "blurb": "Senior Lecturer, teaching a generation of UK trainees how to assess and treat atrial fibrillation.",
    "images": []
  },
  {
    "id": "manchester",
    "name": "Manchester Royal Infirmary",
    "country": "United Kingdom",
    "lat": 53.4631,
    "lng": -2.2339,
    "role": "proctored",
    "years": "2015 to 2023 [placeholder]",
    "blurb": "Proctored consultant colleagues through complex ablation cases as the unit expanded its arrhythmia service. [placeholder]",
    "images": []
  },
  {
    "id": "leeds",
    "name": "Leeds General Infirmary",
    "country": "United Kingdom",
    "lat": 53.8013,
    "lng": -1.5507,
    "role": "proctored",
    "years": "2016 to 2022 [placeholder]",
    "blurb": "Supported the cardiology team with hands-on proctoring for left atrial appendage occlusion procedures. [placeholder]",
    "images": []
  },
  {
    "id": "birmingham",
    "name": "Queen Elizabeth Hospital Birmingham",
    "country": "United Kingdom",
    "lat": 52.4536,
    "lng": -1.9385,
    "role": "taught",
    "years": "2018 [placeholder]",
    "blurb": "Delivered training sessions on cryoballoon and radiofrequency ablation technique. [placeholder]",
    "images": []
  },
  {
    "id": "brugge",
    "name": "AZ Sint-Jan, Brugge",
    "country": "Belgium",
    "lat": 51.2172,
    "lng": 3.2200,
    "role": "taught",
    "years": "2019 to present [placeholder]",
    "blurb": "Long-standing research and teaching collaboration on pulmonary vein isolation, including the VISTAX trial. [placeholder]",
    "images": []
  },
  {
    "id": "bordeaux",
    "name": "Hôpital Cardiologique Haut-Lévêque, Bordeaux",
    "country": "France",
    "lat": 44.8083,
    "lng": -0.6320,
    "role": "taught",
    "years": "2017 [placeholder]",
    "blurb": "Invited faculty at one of Europe's leading electrophysiology centres. [placeholder]",
    "images": []
  },
  {
    "id": "prague",
    "name": "IKEM, Prague",
    "country": "Czech Republic",
    "lat": 50.0299,
    "lng": 14.4632,
    "role": "proctored",
    "years": "2020 [placeholder]",
    "blurb": "Proctored complex ablation cases with the institute's arrhythmia team. [placeholder]",
    "images": []
  },
  {
    "id": "hamburg",
    "name": "Asklepios Klinik St. Georg, Hamburg",
    "country": "Germany",
    "lat": 53.5559,
    "lng": 10.0128,
    "role": "taught",
    "years": "2018 [placeholder]",
    "blurb": "Guest operator and lecturer on high-volume AF ablation practice. [placeholder]",
    "images": []
  },
  {
    "id": "boston",
    "name": "Massachusetts General Hospital, Boston",
    "country": "United States",
    "lat": 42.3632,
    "lng": -71.0686,
    "role": "taught",
    "years": "2019 [placeholder]",
    "blurb": "Visiting faculty, presenting trial data and ablation technique to the cardiac arrhythmia service. [placeholder]",
    "images": []
  },
  {
    "id": "austin",
    "name": "Texas Cardiac Arrhythmia Institute, Austin",
    "country": "United States",
    "lat": 30.2711,
    "lng": -97.7437,
    "role": "taught",
    "years": "2022 [placeholder]",
    "blurb": "Invited speaker and collaborator on multicentre AF ablation research. [placeholder]",
    "images": []
  },
  {
    "id": "mumbai",
    "name": "Mumbai London AF Clinic, Mumbai",
    "country": "India",
    "lat": 19.0760,
    "lng": 72.8777,
    "role": "operated",
    "years": "2026 to present",
    "blurb": "In-person consultations and ablation procedures during scheduled Mumbai visits, with local follow-up between visits.",
    "images": []
  }
]
```

Create `data/visits.json`:

```json
[
  { "id": "visit-1", "month": "[March] 2026", "status": "open", "note": "Consultations and procedures. Limited slots. [placeholder dates]" },
  { "id": "visit-2", "month": "[June] 2026", "status": "waitlist", "note": "Consultation list full, join the waitlist. [placeholder dates]" },
  { "id": "visit-3", "month": "[October] 2026", "status": "tbc", "note": "Dates to be confirmed. Register interest. [placeholder dates]" }
]
```

Create `data/README.md`:

```markdown
# Content data

Everything a client will ever edit lives here. **All entries marked `[placeholder]`
must be replaced with real data before launch**, especially `locations.json`
(realistic but unverified entries), `visits.json` (dates), and `site.ts` (contact
details, GMC number).
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add data test/data.locations.test.ts
git commit -m "feat: add content types, site config, locations and visits data"
```

---

### Task 3: Port the 24 testimonials to JSON

**Files:**
- Create: `data/testimonials.json`
- Read (source of truth): `reference/testimonials.html`, cards at lines 890–1185, full hospital letters in the `letters` JS object at lines ~1259–1340
- Test: `test/data.testimonials.test.ts`

**Interfaces:**
- Consumes: `Testimonial` type from `data/types.ts` (Task 2).
- Produces: `data/testimonials.json`, exactly 24 entries: 6 `hospital` (ids `hosp1`–`hosp6`, each with a complete `letter`), 8 `patient` (`pat1`–`pat8`), 6 `peer` (`peer1`–`peer6`), 4 `news` (`news1`–`news4`). Order: hospital, patient, peer, news, same as the reference page.

- [ ] **Step 1: Write failing test**

Create `test/data.testimonials.test.ts`:

```ts
import testimonials from '@/data/testimonials.json';

test('24 testimonials with exact category counts', () => {
  expect(testimonials).toHaveLength(24);
  const count = (c: string) => testimonials.filter((t) => t.category === c).length;
  expect(count('hospital')).toBe(6);
  expect(count('patient')).toBe(8);
  expect(count('peer')).toBe(6);
  expect(count('news')).toBe(4);
});

test('every hospital testimonial carries a full letter', () => {
  for (const t of testimonials.filter((t) => t.category === 'hospital')) {
    expect(t.letter).toBeDefined();
    expect(t.letter!.body.length).toBeGreaterThanOrEqual(2);
    expect(t.letter!.org.length).toBeGreaterThan(3);
    expect(t.letter!.sigName.length).toBeGreaterThan(2);
  }
});

test('news testimonials carry masthead, date and headline', () => {
  for (const t of testimonials.filter((t) => t.category === 'news')) {
    expect(t.masthead).toBeTruthy();
    expect(t.date).toBeTruthy();
    expect(t.headline).toBeTruthy();
  }
});

test('spot-check ported content is verbatim', () => {
  const hosp1 = testimonials.find((t) => t.id === 'hosp1')!;
  expect(hosp1.quote).toContain('most reliable and skilled electrophysiologists');
  expect(hosp1.letter!.org).toBe('Liverpool Heart and Chest Hospital NHS Foundation Trust');
  const pat1 = testimonials.find((t) => t.id === 'pat1')!;
  expect(pat1.quote).toContain('just stress');
  const news1 = testimonials.find((t) => t.id === 'news1')!;
  expect(news1.masthead).toBe('The Indian Express');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, `data/testimonials.json` does not exist.

- [ ] **Step 3: Port the content**

Read `reference/testimonials.html` and port every card **verbatim** (do not rewrite, summarise, or "improve" any quote). Field mapping:

- Hospital cards (lines ~909–967): `quote` ← `.letter-quote` text (strip surrounding curly quotes), `attribution` ← `<strong>` in `.letter-meta`, `detail` ← the line after it. `letter` ← the matching entry in the `letters` object in the `<script>` (same `hosp1`–`hosp6` keys): copy `tag`, `org`, `subtitle`, `date`, `body` (array of paragraphs), `sigName`, `sigRole` exactly.
- Patient cards (lines ~970–1073): `quote` ← `.patient-text`, `attribution` ← `<strong>`, `detail` ← the `<span>` (e.g. `"Treated 2023 · Mumbai"`).
- Peer cards (lines ~1075–1160): `quote` ← `.peer-text`, `attribution` ← `<strong>`, `detail` ← `.peer-affiliation`.
- News cards (lines ~1162–1180): `masthead` ← `.news-masthead` text (without the date span), `date` ← `.news-date`, `headline` ← `.news-headline` (strip outer quotes), `quote` ← `.news-quote`, `attribution` ← the `<strong>` in `.news-quote-source`, `detail` ← remaining source text (e.g. `"quoted in The Indian Express"`).

Example of the expected shape (first entry, complete):

```json
{
  "id": "hosp1",
  "category": "hospital",
  "quote": "Among the most reliable and skilled electrophysiologists we have worked with, patient outcomes consistently above the regional benchmark.",
  "attribution": "Liverpool Heart and Chest Hospital",
  "detail": "Medical Director",
  "letter": {
    "tag": "To whom it may concern",
    "org": "Liverpool Heart and Chest Hospital NHS Foundation Trust",
    "subtitle": "The largest specialist cardiothoracic centre in the United Kingdom",
    "date": "Issued 2024",
    "body": [
      "It gives me great pleasure to write in support of Professor Dhiraj Gupta, who has been a consultant cardiologist and electrophysiologist at this Trust since 2007.",
      "Over the past seventeen years, Professor Gupta has consistently been among the most reliable and skilled electrophysiologists we have worked with. His patient outcomes are consistently above the regional benchmark, his complication rates have been published in peer-reviewed journals, and his teaching of junior staff is exemplary.",
      "He has been a key driver of the LAA occlusion service which now serves a population of 2.8 million across the North West of England. He is, without reservation, a senior figure in UK arrhythmia care, and we are fortunate to have him."
    ],
    "sigName": "Medical Director",
    "sigRole": "Liverpool Heart and Chest Hospital NHS Foundation Trust"
  }
}
```

And a patient example (`pat1`, complete):

```json
{
  "id": "pat1",
  "category": "patient",
  "quote": "After years of being told my palpitations were \"just stress,\" Professor Gupta listened, ran proper tests, and treated me. I haven't had an episode in two years.",
  "attribution": "R. K.",
  "detail": "Treated 2023 · Mumbai"
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS. Also manually diff two random quotes against the reference file to confirm verbatim porting.

- [ ] **Step 5: Commit**

```bash
git add data/testimonials.json test/data.testimonials.test.ts
git commit -m "feat: port 24 testimonials with full hospital letters to JSON"
```

---

### Task 4: Port journey milestones; write FAQs and citations

**Files:**
- Create: `data/milestones.ts`, `data/faqs.ts`, `data/citations.ts`
- Read (source of truth): `reference/journey.html`, year markers lines ~610–653, photo frames ~655–726, milestone articles ~727 onward
- Test: `test/data.milestones.test.ts`

**Interfaces:**
- Consumes: `Milestone`, `Faq`, `Citation` types from `data/types.ts`.
- Produces:
  - `data/milestones.ts` exports `export const milestones: Milestone[]`, exactly 10 entries, markerYears `["1988","2000","2007","2009","2012","2014","2017","2022","2024","2026"]`. (The reference page merges 1988 and 1994 into one milestone whose `yearLabel` is `"1988 to 1994"`, keep that; the spec's 1994 MB BS point lives inside it as `meta: "MB BS qualified, 1994"`.)
  - `data/faqs.ts` exports `export const faqs: Faq[]`, the 6 FAQs below, verbatim.
  - `data/citations.ts` exports `export const citations: Citation[]`, 4 placeholder citations below.

- [ ] **Step 1: Write failing test**

Create `test/data.milestones.test.ts`:

```ts
import { milestones } from '@/data/milestones';
import { faqs } from '@/data/faqs';
import { citations } from '@/data/citations';

test('10 milestones covering 1988–2026', () => {
  expect(milestones).toHaveLength(10);
  expect(milestones.map((m) => m.markerYear)).toEqual([
    '1988', '2000', '2007', '2009', '2012', '2014', '2017', '2022', '2024', '2026',
  ]);
  expect(milestones[0].yearLabel).toBe('1988 to 1994');
  expect(milestones[0].meta).toBe('MB BS qualified, 1994');
  for (const m of milestones) {
    expect(m.title.length).toBeGreaterThan(3);
    expect(m.body.length).toBeGreaterThan(40);
    expect(m.photoTitle.length).toBeGreaterThan(2);
    expect(m.photoCaption.length).toBeGreaterThan(20);
  }
});

test('6 plain-language FAQs, none empty', () => {
  expect(faqs).toHaveLength(6);
  for (const f of faqs) {
    expect(f.question.endsWith('?')).toBe(true);
    expect(f.answer.length).toBeGreaterThan(60);
  }
});

test('citations are numbered and marked for verification', () => {
  expect(citations.length).toBeGreaterThanOrEqual(4);
  citations.forEach((c, i) => expect(c.id).toBe(i + 1));
  for (const c of citations) expect(c.text).toContain('[CITATION - verify]');
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL, modules not found.

- [ ] **Step 3: Create the data files**

**`data/milestones.ts`:** port all 10 milestone articles **verbatim** from `reference/journey.html`. Mapping per `<article class="milestone" data-milestone="YYYY">`: `markerYear` ← `data-milestone`; `markerSub` ← the matching `.year-marker .year-sub` text; `yearLabel` ← `.milestone-year`; `tag` ← `.milestone-tag`; `title` ← the `<h2>` text (keep the em-phrase as plain text); `body` ← the `<p>` text (flatten `<strong>` to plain text); `meta` ← the `.milestone-meta` value line if present (e.g. `"MB BS qualified, 1994"`); `photoTitle`/`photoCaption` ← the matching `.photo-frame[data-frame=YYYY]` `.photo-title` and `.photo-caption`. (There is an extra photo frame for 1994 with no article of its own, fold its caption into nothing; it is covered by the 1988 milestone.) First entry, complete and verbatim, port the remaining 9 the same way:

```ts
import type { Milestone } from './types';

export const milestones: Milestone[] = [
  {
    markerYear: '1988',
    markerSub: 'The beginning',
    yearLabel: '1988 to 1994',
    tag: 'Foundation',
    title: 'A medical student with a destination in mind.',
    body: 'Professor Gupta begins his MB BS in India in 1988. He set his sights on a career in cardiology early, long before specialisation was supposed to be on his mind, and qualified six years later as a doctor with a clear chosen path.',
    meta: 'MB BS qualified, 1994',
    photoTitle: 'Medical school',
    photoCaption:
      'A young student in India, beginning a six-year MB BS programme with cardiology already in mind.',
  },
  // …9 more entries, ported verbatim from reference/journey.html…
];
```

**`data/faqs.ts`**, this copy is final, use verbatim (it has been checked against the GMC guardrail; do not editorialise):

```ts
import type { Faq } from './types';

export const faqs: Faq[] = [
  {
    question: 'Is PFA newer and therefore better?',
    answer:
      'PFA (pulsed field ablation) is newer, but newer does not automatically mean better. In the largest studies directly comparing the two, published in 2025, PFA and RFA (radiofrequency ablation) produced broadly comparable results.\u00b9 What consistently makes the biggest difference to safety and success in published research is the experience of the doctor performing the procedure.\u00b2',
  },
  {
    question: 'Is catheter ablation safe?',
    answer:
      'Catheter ablation is a routine, well-established procedure carried out hundreds of thousands of times a year worldwide. Like any procedure it carries some risk, and your doctor will explain those risks for your situation. Published research shows complication rates are lower at centres and with doctors who perform a high volume of these procedures.\u00b2 Professor Gupta\u2019s published complication rate is below 1%.\u00b3',
  },
  {
    question: 'Which technology will I get, RFA or PFA?',
    answer:
      'Professor Gupta is trained and experienced in both. Neither is right for every patient. He will assess your heart, your history and your preferences, explain the options in plain language, and recommend the one that suits you, not the one that happens to be available.',
  },
  {
    question: 'How long does recovery take?',
    answer:
      'Most patients go home the same day or the next morning, and are back to normal light activity within a few days. Your care team will give you clear, written instructions for the first weeks, and follow-up is arranged with a trusted local cardiologist under Professor Gupta\u2019s supervision.',
  },
  {
    question: 'Do I need to travel to the UK?',
    answer:
      'No. Consultations and procedures take place in Mumbai during Professor Gupta\u2019s scheduled visits. Between visits, your follow-up happens locally, coordinated with cardiologists he works with, so you are never without a doctor close to home.',
  },
  {
    question: 'What happens at the first consultation?',
    answer:
      'An unhurried conversation. Professor Gupta will review your history, any recordings or scans you have, and explain what is happening in your heart in plain language, in English, Hindi or Punjabi. You will leave with a clear plan, whether or not that plan includes a procedure.',
  },
];
```

**`data/citations.ts`**, placeholder citations, clearly marked (real references swapped in by the client before launch):

```ts
import type { Citation } from './types';

export const citations: Citation[] = [
  { id: 1, text: 'Head-to-head randomised comparison of PFA vs RFA for paroxysmal AF, 2025. [CITATION - verify]' },
  { id: 2, text: 'Volume–outcome relationship in catheter ablation of atrial fibrillation: systematic review. [CITATION - verify]' },
  { id: 3, text: 'Published single-operator complication-rate series, Liverpool Heart and Chest Hospital. [CITATION - verify]' },
  { id: 4, text: 'National registry data on AF ablation complication rates by centre volume. [CITATION - verify]' },
];
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add data/milestones.ts data/faqs.ts data/citations.ts test/data.milestones.test.ts
git commit -m "feat: port journey milestones; add GMC-checked FAQs and placeholder citations"
```

---

### Task 5: Animation system, useReveal, Reveal, CountUp

**Files:**
- Create: `lib/useReveal.ts`, `components/Reveal.tsx`, `components/CountUp.tsx`
- Test: `test/animation.test.tsx`

**Interfaces:**
- Consumes: `.reveal` / `.reveal-visible` CSS from Task 1; `MockIntersectionObserver`, `mockReducedMotion` from `test/mocks.ts`.
- Produces (used by every later UI task):
  - `useReveal<T extends HTMLElement>(): { ref: RefObject<T | null>; visible: boolean }`
  - `usePrefersReducedMotion(): boolean`
  - `<Reveal as?: 'div'|'section'|'li'|'span', delay?: number (ms), className?: string>{children}</Reveal>`, client component, wraps children, applies `.reveal`/`.reveal-visible` and `transitionDelay`.
  - `<CountUp to: number, prefix?: string, suffix?: string, duration?: number />`, animates 0→`to` on first view, renders final value immediately under reduced motion. Formats with `toLocaleString('en-GB')`.

- [ ] **Step 1: Write failing tests**

Create `test/animation.test.tsx`:

```tsx
import { render, screen, act } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { Reveal } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(false);
});

test('Reveal becomes visible when intersecting', () => {
  render(<Reveal><p>hello</p></Reveal>);
  const wrapper = screen.getByText('hello').parentElement!;
  expect(wrapper.className).toContain('reveal');
  expect(wrapper.className).not.toContain('reveal-visible');
  act(() => MockIntersectionObserver.instances.at(-1)!.trigger(true));
  expect(wrapper.className).toContain('reveal-visible');
});

test('Reveal renders visible immediately under reduced motion', () => {
  mockReducedMotion(true);
  render(<Reveal><p>static</p></Reveal>);
  expect(screen.getByText('static').parentElement!.className).toContain('reveal-visible');
});

test('CountUp shows final value immediately under reduced motion', () => {
  mockReducedMotion(true);
  render(<CountUp to={5000} suffix="+" />);
  act(() => MockIntersectionObserver.instances.at(-1)?.trigger(true));
  expect(screen.getByText('5,000+')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL, components do not exist.

- [ ] **Step 3: Implement**

Create `lib/useReveal.ts`:

```ts
'use client';
import { useEffect, useRef, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return reduced;
}

export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}
```

Create `components/Reveal.tsx`:

```tsx
'use client';
import { createElement, type ReactNode } from 'react';
import { useReveal } from '@/lib/useReveal';

type Props = {
  children: ReactNode;
  as?: 'div' | 'section' | 'li' | 'span';
  delay?: number;
  className?: string;
};

export function Reveal({ children, as = 'div', delay = 0, className = '' }: Props) {
  const { ref, visible } = useReveal<HTMLElement>();
  return createElement(
    as,
    {
      ref,
      className: `reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}
```

Create `components/CountUp.tsx`:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { usePrefersReducedMotion, useReveal } from '@/lib/useReveal';

type Props = { to: number; prefix?: string; suffix?: string; duration?: number };

export function CountUp({ to, prefix = '', suffix = '', duration = 1400 }: Props) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (reduced) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible, reduced, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-GB')}
      {suffix}
    </span>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/useReveal.ts components/Reveal.tsx components/CountUp.tsx test/animation.test.tsx
git commit -m "feat: shared reveal/count-up animation system with reduced-motion gating"
```

---

### Task 6: Global shell, Logo, Nav, Footer, WhatsAppFab, layout

**Files:**
- Create: `components/Logo.tsx`, `components/Nav.tsx`, `components/Footer.tsx`, `components/WhatsAppFab.tsx`
- Modify: `app/layout.tsx`
- Test: `test/shell.test.tsx`

**Interfaces:**
- Consumes: `site` from `data/site.ts`.
- Produces:
  - `<Logo variant: 'mark' | 'full' | 'dark', className? />`, renders an inline-SVG fallback until Task 15 flips `USE_IMAGE_ASSETS` to `true` (exported const in `Logo.tsx`), after which it renders `/brand/logo-mark.png`, `/brand/logo-full.png`, `/brand/logo-dark.png`.
  - `<Nav />`, sticky, client component; shrinks + gains shadow after `scrollY > 80`; desktop links Evidence / Journey / Where He Works / Testimonials + dark "Book a consultation" button; mobile hamburger opening a full-screen sheet with the CTA always visible in the bar.
  - `<Footer />`, full logo, tagline, three link columns, `site.gmcLine`, `site.disclaimer`, contact details.
  - `<WhatsAppFab />`, fixed bottom-right circular brass button linking to `site.whatsappHref`, `aria-label="Chat on WhatsApp"`.
  - `app/layout.tsx` renders skip link → `<Nav />` → `{children}` → `<Footer />` → `<WhatsAppFab />`; children pages must contain `<main id="main">`.

- [ ] **Step 1: Write failing tests**

Create `test/shell.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';

test('Nav renders the four section links and the booking CTA', () => {
  render(<Nav />);
  for (const label of ['Evidence', 'Journey', 'Where He Works', 'Testimonials']) {
    expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
  }
  expect(screen.getAllByRole('link', { name: /book a consultation/i })[0]).toHaveAttribute('href', '/book');
});

test('Footer carries GMC line and disclaimer', () => {
  render(<Footer />);
  expect(screen.getByText(/General Medical Council/)).toBeInTheDocument();
  expect(screen.getByText(/not a substitute for individual medical advice/)).toBeInTheDocument();
});

test('WhatsApp FAB links to wa.me with accessible label', () => {
  render(<WhatsAppFab />);
  const fab = screen.getByRole('link', { name: /whatsapp/i });
  expect(fab.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`, expected: FAIL, components missing.

- [ ] **Step 3: Implement**

Create `components/Logo.tsx`:

```tsx
import Image from 'next/image';

// Flipped to true in Task 15 once brand PNGs exist in public/brand/.
export const USE_IMAGE_ASSETS = false;

type Props = { variant: 'mark' | 'full' | 'dark'; className?: string };

const FILES = {
  mark: '/brand/logo-mark.png',
  full: '/brand/logo-full.png',
  dark: '/brand/logo-dark.png',
} as const;

export function Logo({ variant, className = '' }: Props) {
  if (USE_IMAGE_ASSETS) {
    return (
      <Image
        src={FILES[variant]}
        alt="Mumbai London AF Clinic"
        width={variant === 'mark' ? 44 : 220}
        height={44}
        className={className}
        priority
      />
    );
  }
  // Inline SVG fallback: ECG line between two dots (London/Mumbai), wordmark for full variants.
  const stroke = variant === 'dark' ? '#B08D3E' : '#8F7231';
  const text = variant === 'dark' ? '#F7F5F1' : '#122B3A';
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="44" height="28" viewBox="0 0 44 28" aria-hidden="true">
        <circle cx="4" cy="14" r="3" fill={stroke} />
        <path d="M7 14h8l3-8 5 16 3-8h11" fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        <circle cx="40" cy="14" r="3" fill={stroke} />
      </svg>
      {variant !== 'mark' && (
        <span className="font-serif text-lg tracking-wide" style={{ color: text }}>
          Mumbai London <span className="text-brass">·</span> AF Clinic
        </span>
      )}
    </span>
  );
}
```

Create `components/Nav.tsx`:

```tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Logo } from '@/components/Logo';

const LINKS = [
  { href: '/evidence', label: 'Evidence' },
  { href: '/journey', label: 'Journey' },
  { href: '/locations', label: 'Where He Works' },
  { href: '/testimonials', label: 'Testimonials' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 bg-paper/95 backdrop-blur ${
        scrolled ? 'border-line shadow-[0_2px_16px_rgba(18,43,58,0.08)] py-2' : 'border-transparent py-4'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5">
        <Link href="/" aria-label="Mumbai London AF Clinic, home" onClick={() => setOpen(false)}>
          <Logo variant="mark" />
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-[15px] font-medium text-ink-soft hover:text-ink">
              {l.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-semibold text-paper hover:bg-night"
          >
            Book a consultation
          </Link>
        </nav>
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/book" className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">
            Book a consultation
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-1.5"
          >
            <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink ${open ? 'opacity-0' : ''}`} />
            <span className={`h-0.5 w-6 bg-ink transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
          </button>
        </div>
      </div>
      {open && (
        <nav aria-label="Mobile" className="border-t border-line bg-paper px-5 py-6 md:hidden">
          <ul className="flex flex-col gap-5">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={() => setOpen(false)} className="font-serif text-2xl text-ink">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
```

Create `components/Footer.tsx`:

```tsx
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { site } from '@/data/site';

export function Footer() {
  return (
    <footer className="border-t border-line-dark bg-night text-paper">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo variant="dark" />
          <p className="mt-4 max-w-sm text-sm text-paper/80">{site.tagline}</p>
        </div>
        <nav aria-label="Footer, pages">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass">Pages</h2>
          <ul className="space-y-2 text-sm">
            <li><Link href="/evidence" className="hover:text-brass">The Evidence</Link></li>
            <li><Link href="/journey" className="hover:text-brass">The Journey</Link></li>
            <li><Link href="/locations" className="hover:text-brass">Where He Works</Link></li>
            <li><Link href="/testimonials" className="hover:text-brass">Testimonials</Link></li>
            <li><Link href="/book" className="hover:text-brass">Book a consultation</Link></li>
          </ul>
        </nav>
        <div>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-brass">Contact</h2>
          <ul className="space-y-2 text-sm text-paper/85">
            <li>{site.address}</li>
            <li><a href={`tel:${site.phone}`} className="hover:text-brass">{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`} className="hover:text-brass">{site.email}</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line-dark">
        <div className="mx-auto max-w-6xl space-y-2 px-5 py-6 text-xs text-paper/70">
          <p>{site.gmcLine}</p>
          <p>{site.disclaimer}</p>
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
```

Create `components/WhatsAppFab.tsx`:

```tsx
import { site } from '@/data/site';

export function WhatsAppFab() {
  return (
    <a
      href={site.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brass text-night shadow-lg transition-transform hover:scale-105 focus-visible:scale-105"
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm5.4 14.1c-.2.6-1.3 1.2-1.8 1.3-.5 0-1 .2-3.4-.7-2.9-1.1-4.7-4-4.9-4.2-.1-.2-1.1-1.5-1.1-2.9s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.6-.4.5c-.1.1-.3.3-.1.6.2.3.8 1.4 1.8 2.2 1.3 1.1 2.3 1.5 2.7 1.6.3.2.5.1.7-.1l1-1.2c.2-.3.4-.2.7-.1l2 1c.3.1.5.2.6.3 0 .1 0 .7-.2 1.2Z" />
      </svg>
    </a>
  );
}
```

Update `app/layout.tsx` body:

```tsx
<body>
  <a
    href="#main"
    className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
  >
    Skip to content
  </a>
  <Nav />
  {children}
  <Footer />
  <WhatsAppFab />
</body>
```

(with imports `import { Nav } from '@/components/Nav';` etc.)

- [ ] **Step 4: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK. Also run `npm run dev` briefly and confirm the nav shrinks on scroll and the mobile menu opens (manual spot check).

- [ ] **Step 5: Commit**

```bash
git add components app/layout.tsx test/shell.test.tsx
git commit -m "feat: global shell, logo fallback, sticky nav, footer, WhatsApp FAB, skip link"
```

---

### Task 7: Enquiry server action and EnquiryForm

**Files:**
- Create: `lib/validateEnquiry.ts`, `app/book/actions.ts`, `components/EnquiryForm.tsx`
- Test: `test/enquiry.test.tsx`

**Interfaces:**
- Consumes: `visits` from `data/visits.json`, `site` from `data/site.ts`.
- Produces:
  - `validateEnquiry(fields: EnquiryFields): Partial<Record<keyof EnquiryFields, string>>` with `type EnquiryFields = { name: string; phone: string; email: string; message: string; month: string }`.
  - Server action `submitEnquiry(formData: FormData): Promise<{ ok: true } | { ok: false; errors: Record<string, string> }>`, validates, logs, returns success. **This is the single wiring point for a real email/form service later.**
  - `<EnquiryForm compact?: boolean />`, client component. Full variant (Book page): all five fields. Compact variant (homepage CTA band): name, phone, message. Friendly inline error messages, success state: "Thank you, the clinic team will contact you within {site.responseDays} working days."

- [ ] **Step 1: Write failing tests**

Create `test/enquiry.test.tsx`:

```tsx
import { validateEnquiry } from '@/lib/validateEnquiry';
import { submitEnquiry } from '@/app/book/actions';

const valid = {
  name: 'A. Patient',
  phone: '+91 98765 43210',
  email: 'a@example.com',
  message: 'I have had palpitations for two years.',
  month: '[March] 2026',
};

test('validateEnquiry passes a valid submission', () => {
  expect(validateEnquiry(valid)).toEqual({});
});

test('validateEnquiry returns friendly messages for bad fields', () => {
  const errors = validateEnquiry({ name: '', phone: '123', email: 'nope', message: 'hi', month: '' });
  expect(errors.name).toMatch(/name/i);
  expect(errors.phone).toMatch(/country code/i);
  expect(errors.email).toMatch(/email/i);
  expect(errors.message).toBeTruthy();
  expect(errors.month).toBeTruthy();
});

test('submitEnquiry returns ok for valid form data', async () => {
  const fd = new FormData();
  Object.entries(valid).forEach(([k, v]) => fd.set(k, v));
  await expect(submitEnquiry(fd)).resolves.toEqual({ ok: true });
});

test('submitEnquiry rejects invalid form data', async () => {
  const fd = new FormData();
  fd.set('name', '');
  const res = await submitEnquiry(fd);
  expect(res.ok).toBe(false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`, expected: FAIL, modules missing.

- [ ] **Step 3: Implement**

Create `lib/validateEnquiry.ts`:

```ts
export type EnquiryFields = {
  name: string;
  phone: string;
  email: string;
  message: string;
  month: string;
};

export function validateEnquiry(f: EnquiryFields): Partial<Record<keyof EnquiryFields, string>> {
  const errors: Partial<Record<keyof EnquiryFields, string>> = {};
  if (!f.name.trim()) errors.name = 'Please tell us your name.';
  if (!/^\+?[0-9\s\-()]{7,17}$/.test(f.phone.trim()))
    errors.phone = 'Please enter a phone number with country code, for example +91 98765 43210.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim()))
    errors.email = 'Please enter a valid email address.';
  if (f.message.trim().length < 10)
    errors.message = 'Please tell us a little about the problem, a sentence or two is perfect.';
  if (!f.month) errors.month = 'Please choose a preferred month.';
  return errors;
}
```

Create `app/book/actions.ts`:

```ts
'use server';

import { validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';

export type EnquiryResult = { ok: true } | { ok: false; errors: Record<string, string> };

export async function submitEnquiry(formData: FormData): Promise<EnquiryResult> {
  const fields: EnquiryFields = {
    name: String(formData.get('name') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    email: String(formData.get('email') ?? ''),
    message: String(formData.get('message') ?? ''),
    month: String(formData.get('month') ?? ''),
  };
  const errors = validateEnquiry(fields);
  if (Object.keys(errors).length > 0) return { ok: false, errors: errors as Record<string, string> };

  // Stub: swap this log for an email/CRM/form-service call. One-file change.
  console.log('[enquiry]', { ...fields, message: fields.message.slice(0, 1000) });
  return { ok: true };
}
```

Create `components/EnquiryForm.tsx`:

```tsx
'use client';
import { useState, useTransition } from 'react';
import { submitEnquiry } from '@/app/book/actions';
import { validateEnquiry, type EnquiryFields } from '@/lib/validateEnquiry';
import { site } from '@/data/site';
import visitsJson from '@/data/visits.json';
import type { Visit } from '@/data/types';

const visits = visitsJson as Visit[];

const EMPTY: EnquiryFields = { name: '', phone: '', email: '', message: '', month: '' };

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [fields, setFields] = useState<EnquiryFields>(
    // Compact variant omits email/month inputs; give them passing defaults.
    compact ? { ...EMPTY, email: 'not-collected@compact.form', month: visits[0]?.month ?? 'any' } : EMPTY,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFields, string>>>({});
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  const set = (k: keyof EnquiryFields) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setFields((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validateEnquiry(fields);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    startTransition(async () => {
      const fd = new FormData();
      Object.entries(fields).forEach(([k, v]) => fd.set(k, v));
      const res = await submitEnquiry(fd);
      if (res.ok) setDone(true);
      else setErrors(res.errors);
    });
  };

  if (done) {
    return (
      <div role="status" className="rounded-lg border border-line bg-paper-soft p-6">
        <p className="font-serif text-2xl">Thank you.</p>
        <p className="mt-2 text-ink-soft">
          Your enquiry has been received. The clinic team will contact you within {site.responseDays} working days.
        </p>
      </div>
    );
  }

  const field = (
    key: keyof EnquiryFields,
    label: string,
    input: React.ReactNode,
  ) => (
    <div>
      <label htmlFor={`enq-${key}`} className="mb-1 block text-sm font-semibold">
        {label}
      </label>
      {input}
      {errors[key] && (
        <p id={`enq-${key}-error`} className="mt-1 text-sm text-brass-deep" role="alert">
          {errors[key]}
        </p>
      )}
    </div>
  );

  const inputCls =
    'w-full rounded-md border border-line bg-white px-3 py-2.5 text-ink placeholder:text-ink-mute focus-visible:outline-2';

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      {field('name', 'Your name', (
        <input id="enq-name" className={inputCls} value={fields.name} onChange={set('name')}
          autoComplete="name" aria-invalid={!!errors.name} aria-describedby={errors.name ? 'enq-name-error' : undefined} />
      ))}
      {field('phone', 'Phone (with country code)', (
        <input id="enq-phone" className={inputCls} value={fields.phone} onChange={set('phone')} placeholder="+91 …"
          autoComplete="tel" inputMode="tel" aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'enq-phone-error' : undefined} />
      ))}
      {!compact &&
        field('email', 'Email', (
          <input id="enq-email" type="email" className={inputCls} value={fields.email} onChange={set('email')}
            autoComplete="email" aria-invalid={!!errors.email} aria-describedby={errors.email ? 'enq-email-error' : undefined} />
        ))}
      {field('message', 'Briefly, what is the problem?', (
        <textarea id="enq-message" rows={compact ? 3 : 5} className={inputCls} value={fields.message} onChange={set('message')}
          aria-invalid={!!errors.message} aria-describedby={errors.message ? 'enq-message-error' : undefined} />
      ))}
      {!compact &&
        field('month', 'Preferred visit month', (
          <select id="enq-month" className={inputCls} value={fields.month} onChange={set('month')}
            aria-invalid={!!errors.month} aria-describedby={errors.month ? 'enq-month-error' : undefined}>
            <option value="">Choose a month…</option>
            {visits.map((v) => (
              <option key={v.id} value={v.month}>
                {v.month}
              </option>
            ))}
          </select>
        ))}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-night disabled:opacity-60"
      >
        {pending ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add lib/validateEnquiry.ts app/book/actions.ts components/EnquiryForm.tsx test/enquiry.test.tsx
git commit -m "feat: enquiry form with client validation and server action stub"
```

---

### Task 8: Shared sections, StatsBand, Steps, VisitDates, TestimonialCard, CtaBand

**Files:**
- Create: `components/StatsBand.tsx`, `components/Steps.tsx`, `components/VisitDates.tsx`, `components/TestimonialCard.tsx`, `components/CtaBand.tsx`
- Test: `test/sections.test.tsx`

**Interfaces:**
- Consumes: `Reveal`, `CountUp` (Task 5); `EnquiryForm` (Task 7); `Testimonial`, `Visit` types; `site`.
- Produces:
  - `<StatsBand />`, the four fixed stats with count-up: 5,000+ ablations · <1% complication rate · 18+ years as consultant · 350+ publications (labels verbatim below).
  - `<Steps />`, the three numbered how-it-works steps.
  - `<VisitDates visits: Visit[] />`, date cards with status chips (Booking open / Waitlist / TBC).
  - `<TestimonialCard t: Testimonial, onOpenLetter?: (t: Testimonial) => void />`, renders all four category shapes; hospital cards show a "Read full letter" button when `onOpenLetter` given.
  - `<CtaBand />`, dark (`bg-ink`, **not** `bg-night`) final band: heading, compact `<EnquiryForm compact />`, WhatsApp link.

- [ ] **Step 1: Write failing tests**

Create `test/sections.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { StatsBand } from '@/components/StatsBand';
import { VisitDates } from '@/components/VisitDates';
import { TestimonialCard } from '@/components/TestimonialCard';
import testimonials from '@/data/testimonials.json';
import visits from '@/data/visits.json';
import type { Testimonial, Visit } from '@/data/types';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true); // final values render immediately
});

test('StatsBand shows the four headline numbers', () => {
  render(<StatsBand />);
  MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
  expect(screen.getByText(/5,000/)).toBeInTheDocument();
  expect(screen.getByText(/<1/)).toBeInTheDocument();
  expect(screen.getByText(/18/)).toBeInTheDocument();
  expect(screen.getByText(/350/)).toBeInTheDocument();
});

test('VisitDates renders one card per visit with status', () => {
  render(<VisitDates visits={visits as Visit[]} />);
  expect(screen.getByText('Booking open')).toBeInTheDocument();
  expect(screen.getByText('Waitlist')).toBeInTheDocument();
  expect(screen.getByText('TBC')).toBeInTheDocument();
});

test('TestimonialCard renders each category shape', () => {
  const byCat = (c: Testimonial['category']) =>
    (testimonials as Testimonial[]).find((t) => t.category === c)!;
  const { rerender } = render(<TestimonialCard t={byCat('patient')} />);
  expect(screen.getByText(/Patient/)).toBeInTheDocument();
  rerender(<TestimonialCard t={byCat('news')} />);
  expect(screen.getByText('The Indian Express')).toBeInTheDocument();
  rerender(<TestimonialCard t={byCat('hospital')} onOpenLetter={() => {}} />);
  expect(screen.getByRole('button', { name: /read full letter/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`, expected: FAIL.

- [ ] **Step 3: Implement**

Create `components/StatsBand.tsx` (labels verbatim from the reference homepage):

```tsx
import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';

const STATS = [
  { node: <CountUp to={5000} suffix="+" />, label: 'AF ablation procedures performed, placing him among the highest-volume operators in the world' },
  { node: <CountUp to={1} prefix="<" suffix="%" />, label: "Complication rate, published in peer-reviewed journals, on par with the world's best" },
  { node: <CountUp to={18} suffix="+" />, label: "Years as consultant at Liverpool Heart and Chest Hospital, the UK's largest cardiothoracic centre" },
  { node: <CountUp to={350} suffix="+" />, label: 'Peer-reviewed scientific publications, cited over 13,000 times' },
];

export function StatsBand() {
  return (
    <section aria-label="Key numbers" className="border-y border-line bg-paper-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="font-serif text-5xl text-ink">{s.node}</div>
            <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
```

Create `components/Steps.tsx` (copy adapted from reference homepage "process" section):

```tsx
import { Reveal } from '@/components/Reveal';

const STEPS = [
  {
    n: 'i.',
    title: 'An unhurried first visit',
    body: 'A full consultation in Mumbai, your history, your recordings, your questions. In English, Hindi or Punjabi. You leave with a clear plan.',
  },
  {
    n: 'ii.',
    title: 'Procedure in Mumbai',
    body: 'If a procedure is right for you, Professor Gupta performs it himself during a scheduled Mumbai visit, using the technology that suits your heart.',
  },
  {
    n: 'iii.',
    title: 'Continuity, locally',
    body: 'Follow-up happens close to home with trusted local cardiologists, coordinated under his supervision between visits.',
  },
];

export function Steps() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <Reveal key={s.n} delay={i * 90}>
          <div className="text-sm font-semibold text-brass-deep">{s.n} {s.title}</div>
          <h3 className="sr-only">{s.title}</h3>
          <p className="mt-2 text-ink-soft">{s.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
```

Create `components/VisitDates.tsx`:

```tsx
import type { Visit } from '@/data/types';
import { Reveal } from '@/components/Reveal';

const STATUS: Record<Visit['status'], { label: string; cls: string }> = {
  open: { label: 'Booking open', cls: 'bg-brass text-night' },
  waitlist: { label: 'Waitlist', cls: 'bg-paper-soft text-ink border border-line' },
  tbc: { label: 'TBC', cls: 'bg-paper-soft text-ink-soft border border-line' },
};

export function VisitDates({ visits }: { visits: Visit[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {visits.map((v, i) => (
        <Reveal as="li" key={v.id} delay={i * 80} className="rounded-lg border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-serif text-2xl">{v.month}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS[v.status].cls}`}>
              {STATUS[v.status].label}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-soft">{v.note}</p>
        </Reveal>
      ))}
    </ul>
  );
}
```

Create `components/TestimonialCard.tsx`:

```tsx
import type { Testimonial } from '@/data/types';

const TAGS: Record<Testimonial['category'], string> = {
  hospital: 'Hospital · Letter',
  patient: 'Patient',
  peer: 'Peer',
  news: 'News',
};

export function TestimonialCard({
  t,
  onOpenLetter,
}: {
  t: Testimonial;
  onOpenLetter?: (t: Testimonial) => void;
}) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-widest text-brass-deep">
        {t.category === 'news' ? (
          <span className="flex items-baseline justify-between gap-2 normal-case tracking-normal">
            <span className="font-serif text-base text-ink">{t.masthead}</span>
            <span className="text-ink-mute">{t.date}</span>
          </span>
        ) : (
          TAGS[t.category]
        )}
      </div>
      {t.headline && <p className="mt-3 font-serif text-xl leading-snug">“{t.headline}”</p>}
      <p className={`mt-3 flex-1 ${t.category === 'hospital' ? 'font-serif text-lg leading-relaxed' : 'text-ink-soft'}`}>
        “{t.quote}”
      </p>
      <footer className="mt-4 text-sm">
        <strong className="block text-ink">{t.attribution}</strong>
        {t.detail && <span className="text-ink-mute">{t.detail}</span>}
      </footer>
      {t.letter && onOpenLetter && (
        <button
          type="button"
          onClick={() => onOpenLetter(t)}
          className="mt-4 self-start text-sm font-semibold text-brass-deep hover:underline"
        >
          Read full letter →
        </button>
      )}
    </article>
  );
}
```

Create `components/CtaBand.tsx`:

```tsx
import { EnquiryForm } from '@/components/EnquiryForm';
import { Reveal } from '@/components/Reveal';
import { site } from '@/data/site';

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-20 md:grid-cols-2">
        <Reveal>
          <h2 id="cta-heading" className="font-serif text-4xl leading-tight">
            Take the first step. <em className="text-brass">It costs nothing to ask.</em>
          </h2>
          <p className="mt-4 max-w-md text-paper/85">
            Send a short enquiry and the clinic team will come back to you, or message us directly on WhatsApp.
          </p>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-block rounded-full border border-brass px-6 py-3 font-semibold text-brass hover:bg-brass hover:text-night"
          >
            Message on WhatsApp
          </a>
        </Reveal>
        <Reveal delay={120} className="rounded-lg bg-paper p-6 text-ink">
          <EnquiryForm compact />
        </Reveal>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK.

- [ ] **Step 5: Commit**

```bash
git add components test/sections.test.tsx
git commit -m "feat: shared sections, stats band, steps, visit dates, testimonial card, CTA band"
```

---

### Task 9: Interactive map, location list, and /locations page

**Files:**
- Create: `components/map/LocationsMap.tsx`, `components/map/LocationsMapLazy.tsx`, `components/LocationList.tsx`, `app/locations/page.tsx`
- Modify: `app/globals.css` (map pin/popup styles)
- Test: `test/locations-page.test.tsx`

**Interfaces:**
- Consumes: `data/locations.json`, `Location` type, `Reveal`.
- Produces:
  - `<LocationsMapLazy locations: Location[], height?: string />`, the only import other tasks use (dynamic, `ssr: false`). Renders CartoDB Dark Matter tiles, brass role-coloured SVG pins with drop-in animation (reduced-motion gated), UK marker clustering, popups (serif name, role chip, years, blurb, lazy images, read-more), hover-open on desktop, "UK" / "India" fly-to buttons above the map, three-item legend.
  - `<LocationList locations: Location[] />`, plain-text accessible list grouped by country with role labels (the keyboard/screen-reader fallback).
  - `/locations` page: night section with heading + full-height map on top, light section with `<LocationList />` below.

- [ ] **Step 1: Install map dependencies**

```bash
npm install leaflet react-leaflet leaflet.markercluster
npm install -D @types/leaflet @types/leaflet.markercluster
```

- [ ] **Step 2: Write failing test (list + page content; the Leaflet canvas itself is verified manually)**

Create `test/locations-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { LocationList } from '@/components/LocationList';
import locations from '@/data/locations.json';
import type { Location } from '@/data/types';

test('LocationList renders all 12 locations grouped by country with role labels', () => {
  render(<LocationList locations={locations as Location[]} />);
  expect(screen.getByRole('heading', { name: 'United Kingdom' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'India' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(12);
  expect(screen.getAllByText(/Operated|Taught|Proctored/).length).toBeGreaterThanOrEqual(12);
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 3: Implement the map**

Create `components/map/LocationsMap.tsx`:

```tsx
'use client';
import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet.markercluster';
import type { Location, LocationRole } from '@/data/types';

const ROLE_META: Record<LocationRole, { colour: string; label: string }> = {
  operated: { colour: '#B08D3E', label: 'Operated' },
  taught: { colour: '#D9C08A', label: 'Taught' },
  proctored: { colour: '#8F7231', label: 'Proctored' },
};

const UK_BOUNDS: L.LatLngBoundsExpression = [[49.9, -8.6], [58.7, 1.8]];
const INDIA_BOUNDS: L.LatLngBoundsExpression = [[8.0, 68.0], [28.0, 88.0]];
const WORLD_BOUNDS: L.LatLngBoundsExpression = [[5.0, -100.0], [60.0, 90.0]];

function pinIcon(role: LocationRole) {
  return L.divIcon({
    className: 'mlafc-pin',
    html: `<svg width="28" height="36" viewBox="0 0 28 36" aria-hidden="true"><path d="M14 0C6.3 0 0 6.3 0 14c0 10 14 22 14 22s14-12 14-22C28 6.3 21.7 0 14 0z" fill="${ROLE_META[role].colour}"/><circle cx="14" cy="14" r="5" fill="#0C1F2B"/></svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -34],
  });
}

function popupHtml(loc: Location) {
  const images = loc.images
    .slice(0, 2)
    .map((src) => `<img src="${src}" alt="" loading="lazy" class="mlafc-popup-img" />`)
    .join('');
  const readMore = loc.readMore
    ? `<a href="${loc.readMore}" class="mlafc-popup-more">Read more →</a>`
    : '';
  return `
    <div class="mlafc-popup">
      <h3>${loc.name}</h3>
      <p class="mlafc-popup-meta"><span class="mlafc-chip">${ROLE_META[loc.role].label}</span> ${loc.years}</p>
      <p>${loc.blurb}</p>
      ${images}${readMore}
    </div>`;
}

function Pins({ locations }: { locations: Location[] }) {
  const map = useMap();
  useEffect(() => {
    const cluster = L.markerClusterGroup({ maxClusterRadius: 40 });
    const hoverable = window.matchMedia('(hover: hover)').matches;
    for (const loc of locations) {
      const marker = L.marker([loc.lat, loc.lng], {
        icon: pinIcon(loc.role),
        keyboard: true,
        alt: `${loc.name}, ${ROLE_META[loc.role].label}`,
      });
      marker.bindPopup(popupHtml(loc), { maxWidth: 280 });
      if (hoverable) marker.on('mouseover', () => marker.openPopup());
      marker.on('popupopen', () => marker.getElement()?.classList.add('mlafc-pin-active'));
      marker.on('popupclose', () => marker.getElement()?.classList.remove('mlafc-pin-active'));
      cluster.addLayer(marker);
    }
    map.addLayer(cluster);
    return () => {
      map.removeLayer(cluster);
    };
  }, [map, locations]);
  return null;
}

export default function LocationsMap({ locations, height = '480px' }: { locations: Location[]; height?: string }) {
  const mapRef = useRef<L.Map | null>(null);
  const fly = (bounds: L.LatLngBoundsExpression) => {
    const map = mapRef.current;
    if (!map) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) map.fitBounds(bounds, { padding: [30, 30] });
    else map.flyToBounds(bounds, { padding: [30, 30], duration: 1.2 });
  };

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => fly(UK_BOUNDS)}
          className="rounded-full border border-line-dark px-4 py-1.5 text-sm font-semibold text-paper hover:border-brass hover:text-brass">
          UK
        </button>
        <button type="button" onClick={() => fly(INDIA_BOUNDS)}
          className="rounded-full border border-line-dark px-4 py-1.5 text-sm font-semibold text-paper hover:border-brass hover:text-brass">
          India
        </button>
        <ul className="ml-auto flex gap-4 text-xs text-paper/80" aria-label="Map legend">
          {Object.values(ROLE_META).map((r) => (
            <li key={r.label} className="flex items-center gap-1.5">
              <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: r.colour }} />
              {r.label}
            </li>
          ))}
        </ul>
      </div>
      <MapContainer
        ref={mapRef}
        bounds={WORLD_BOUNDS}
        scrollWheelZoom={false}
        style={{ height, width: '100%', background: '#0C1F2B', borderRadius: '8px' }}
        className="mlafc-map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Pins locations={locations} />
      </MapContainer>
    </div>
  );
}
```

Create `components/map/LocationsMapLazy.tsx`:

```tsx
'use client';
import dynamic from 'next/dynamic';

export const LocationsMapLazy = dynamic(() => import('./LocationsMap'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[480px] items-center justify-center rounded-lg bg-night-soft text-paper/60">
      Loading map…
    </div>
  ),
});
```

Append to `app/globals.css`:

```css
/* Map pins and popups */
@keyframes pin-drop {
  from { transform: translateY(-14px); opacity: 0; }
  to { transform: none; opacity: 1; }
}
.mlafc-pin { animation: pin-drop 0.5s cubic-bezier(0.22, 0.61, 0.36, 1) both; }
.mlafc-pin-active svg { transform: scale(1.15); transform-origin: bottom center; transition: transform 0.25s; }
.mlafc-map .leaflet-popup-content-wrapper {
  background: var(--color-night-soft);
  color: var(--color-paper);
  border: 1px solid var(--color-line-dark);
  border-radius: 8px;
}
.mlafc-map .leaflet-popup-tip { background: var(--color-night-soft); }
.mlafc-popup h3 { font-family: var(--font-serif); font-size: 1.15rem; margin-bottom: 4px; }
.mlafc-popup p { font-size: 0.85rem; margin: 4px 0; }
.mlafc-chip {
  display: inline-block; padding: 1px 8px; border-radius: 999px;
  background: var(--color-brass); color: var(--color-night);
  font-size: 0.7rem; font-weight: 600;
}
.mlafc-popup-img { border-radius: 4px; margin-top: 6px; max-width: 100%; }
.mlafc-popup-more { color: var(--color-brass); font-weight: 600; font-size: 0.85rem; }
@media (prefers-reduced-motion: reduce) {
  .mlafc-pin { animation: none; }
  .mlafc-pin-active svg { transform: none; }
}
```

Create `components/LocationList.tsx`:

```tsx
import type { Location } from '@/data/types';

const ROLE_LABELS = { operated: 'Operated', taught: 'Taught', proctored: 'Proctored' } as const;

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-');

export function LocationList({ locations }: { locations: Location[] }) {
  const countries = [...new Set(locations.map((l) => l.country))];
  return (
    <div className="grid gap-10 md:grid-cols-2">
      {countries.map((country) => (
        <section key={country} aria-labelledby={`country-${slug(country)}`}>
          <h3 id={`country-${slug(country)}`} className="font-serif text-2xl">{country}</h3>
          <ul className="mt-4 space-y-4 border-l border-line pl-5">
            {locations.filter((l) => l.country === country).map((l) => (
              <li key={l.id}>
                <p className="font-semibold text-ink">
                  {l.name}{' '}
                  <span className="ml-1 rounded-full bg-paper-soft px-2.5 py-0.5 text-xs font-semibold text-brass-deep">
                    {ROLE_LABELS[l.role]}
                  </span>
                </p>
                <p className="text-sm text-ink-mute">{l.years}</p>
                <p className="mt-1 text-sm text-ink-soft">{l.blurb}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

Create `app/locations/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { LocationsMapLazy } from '@/components/map/LocationsMapLazy';
import { LocationList } from '@/components/LocationList';
import { Reveal } from '@/components/Reveal';
import locationsJson from '@/data/locations.json';
import type { Location } from '@/data/types';

const locations = locationsJson as Location[];

export const metadata: Metadata = {
  title: 'Where He Works, Mumbai London AF Clinic',
  description:
    'Hospitals across the UK, Europe, the US and India where Professor Dhiraj Gupta has operated, taught and proctored.',
};

export default function LocationsPage() {
  return (
    <main id="main">
      <section className="bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass">Where he works</p>
            <h1 className="mt-3 max-w-2xl font-serif text-4xl leading-tight md:text-5xl">
              Trusted in theatres across <em className="text-brass">two continents</em>.
            </h1>
          </Reveal>
          <div className="mt-10">
            <LocationsMapLazy locations={locations} height="560px" />
          </div>
        </div>
      </section>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <h2 className="mb-8 font-serif text-3xl">Every location, in plain text</h2>
          <LocationList locations={locations} />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 4: Run tests and verify manually**

Run: `npm test && npm run build`
Expected: PASS / build OK.

Then `npm run dev`, open `http://localhost:3000/locations` and verify: dark tiles render, 12 pins (UK pins cluster when zoomed out), popups open on hover (desktop), UK/India buttons fly the map, pins reachable by Tab, list below renders.

- [ ] **Step 5: Commit**

```bash
git add components/map components/LocationList.tsx app/locations app/globals.css test/locations-page.test.tsx package.json package-lock.json
git commit -m "feat: interactive Leaflet map with clustering, fly-to controls, and locations page"
```

---

### Task 10: Homepage

**Files:**
- Create: `components/home/Hero.tsx`, `components/home/ComparisonCards.tsx`, `components/home/ConsultantProfile.tsx`
- Replace: `app/page.tsx`
- Test: `test/home.test.tsx`

**Interfaces:**
- Consumes: `Reveal`, `StatsBand`, `Steps`, `VisitDates`, `TestimonialCard`, `CtaBand`, `LocationsMapLazy`, all data files.
- Produces: the `/` page with the ten spec sections in order. Night sections: hero and map teaser only (CTA band is `bg-ink`).

- [ ] **Step 1: Write failing test**

Create `test/home.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { ComparisonCards } from '@/components/home/ComparisonCards';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('comparison section presents both technologies factually and elevates the operator', () => {
  render(<ComparisonCards />);
  expect(screen.getByText(/Two technologies\./)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /radiofrequency ablation/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /pulsed field ablation/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /the operator/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /see the evidence/i })).toHaveAttribute('href', '/evidence');
  // GMC guardrail: no superiority language anywhere in the section
  const text = document.body.textContent!.toLowerCase();
  for (const banned of ['safer than', 'better than', 'more effective than', 'superior to']) {
    expect(text).not.toContain(banned);
  }
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement the three home components**

Create `components/home/Hero.tsx`:

```tsx
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Reveal } from '@/components/Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night text-paper">
      {/* Faint dotted London → Mumbai arc */}
      <svg
        aria-hidden
        className="mlafc-arc pointer-events-none absolute inset-0 h-full w-full opacity-25"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 150 180 Q 600 -60 1050 420"
          fill="none"
          stroke="#B08D3E"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="150" cy="180" r="4" fill="#B08D3E" />
        <circle cx="1050" cy="420" r="4" fill="#B08D3E" />
      </svg>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1.5fr_1fr] md:py-32">
        <div>
          <Reveal><Logo variant="dark" /></Reveal>
          <h1 className="mt-8 font-serif text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.12]">
            <Reveal as="span" delay={150} className="block">The best ablation is the one done</Reveal>
            <Reveal as="span" delay={300} className="block">
              by <em className="text-brass">experienced hands</em>.
            </Reveal>
          </h1>
          <Reveal delay={450}>
            <p className="mt-6 max-w-xl text-lg text-paper/85">
              Professor Dhiraj Gupta has performed more than 5,000 AF ablations at the UK&rsquo;s
              largest heart centre, using both radiofrequency and pulsed field technology.
              He now sees patients in Mumbai. Whatever the machine, the hands holding it matter more.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="rounded-full bg-brass px-7 py-3.5 font-semibold text-night hover:bg-brass-deep hover:text-paper">
                Book a consultation
              </Link>
              <Link href="/evidence" className="rounded-full border border-line-dark px-7 py-3.5 font-semibold text-paper hover:border-brass hover:text-brass">
                See the evidence
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={700} className="self-center border-l-2 border-brass pl-6">
          <p className="font-serif text-xl italic leading-relaxed text-paper/90">
            “Patients in Mumbai deserve the same standard of arrhythmia care I provide in
            Liverpool, with the dignity of being treated close to home.”
          </p>
          <p className="mt-4 text-sm font-semibold">Professor Dhiraj Gupta</p>
          <p className="text-sm text-paper/70">Consultant cardiologist &amp; electrophysiologist</p>
        </Reveal>
      </div>
    </section>
  );
}
```

Add to `app/globals.css` (arc draw animation, reduced-motion gated):

```css
@keyframes arc-fade { from { opacity: 0; } to { opacity: 1; } }
.mlafc-arc { animation: arc-fade 2.4s ease-out both; }
@media (prefers-reduced-motion: reduce) { .mlafc-arc { animation: none; } }
```

Create `components/home/ComparisonCards.tsx` (**copy is final, checked against the GMC guardrail; do not editorialise**):

```tsx
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export function ComparisonCards() {
  return (
    <section aria-labelledby="compare-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">RFA and PFA</p>
          <h2 id="compare-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
            Two technologies. <em className="text-brass-deep">One question that matters more than both.</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal className="rounded-lg border border-line bg-white p-7">
            <h3 className="font-serif text-2xl">Radiofrequency ablation (RFA)</h3>
            <p className="mt-3 text-ink-soft">
              Uses carefully controlled heat to treat the small areas of heart tissue that
              trigger AF. In worldwide use for over twenty years, with long-term results
              documented in thousands of published studies.
            </p>
          </Reveal>
          <Reveal delay={90} className="rounded-lg border border-line bg-white p-7">
            <h3 className="font-serif text-2xl">Pulsed field ablation (PFA)</h3>
            <p className="mt-3 text-ink-soft">
              Uses short electrical pulses instead of heat, designed to target heart tissue
              selectively. A newer approach. In the largest head-to-head trials, published in
              2025, its results were broadly comparable to RFA.<sup>1</sup>
            </p>
          </Reveal>
          <Reveal delay={180} className="rounded-lg border-2 border-brass bg-night p-7 text-paper">
            <h3 className="font-serif text-2xl text-brass">The operator</h3>
            <p className="mt-3 text-paper/90">
              Neither technology was clearly superior in those trials. What consistently
              predicts a safe, successful ablation in published research is the experience of
              the doctor performing it.<sup>2</sup> Professor Gupta offers both RFA and PFA, and recommends the right one for you.
            </p>
            <Link href="/evidence" className="mt-5 inline-block font-semibold text-brass hover:underline">
              See the evidence →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

Create `components/home/ConsultantProfile.tsx` (bio copy verbatim from `reference/mumbai-london-af-clinic.html` lines 770–800):

```tsx
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

const CREDENTIALS = [
  { n: 'i.', title: 'NHS National Silver Clinical Excellence Award', sub: 'Awarded 2021. Earlier Bronze in 2017.' },
  { n: 'ii.', title: 'Arrhythmia Alliance Excellence in Practice Award', sub: 'Outstanding contribution to UK arrhythmia services' },
  { n: 'iii.', title: 'Chief Investigator, multi-centre AF trials', sub: 'PRESSURE · SMAAN-PAF · PRAISE · VISTAX · CRAFT' },
  { n: 'iv.', title: 'Author, British Heart Foundation AF booklet', sub: 'National patient education resource' },
];

export function ConsultantProfile() {
  return (
    <section aria-labelledby="profile-heading" className="bg-paper-soft">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-[2fr_3fr]">
        <Reveal>
          <div className="flex aspect-[3/4] items-center justify-center rounded-lg border border-line bg-paper text-sm uppercase tracking-widest text-ink-mute">
            portrait placeholder
          </div>
        </Reveal>
        <div>
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Meet your consultant</p>
            <h2 id="profile-heading" className="mt-3 font-serif text-4xl">Professor Dhiraj Gupta</h2>
            <p className="mt-1 font-semibold text-ink-soft">MB BS, MD, DM, FRCP (London)</p>
          </Reveal>
          <Reveal delay={100}>
            <p className="mt-5 text-ink-soft">
              Professor Gupta has been a consultant at Liverpool Heart and Chest Hospital, the
              United Kingdom&rsquo;s largest specialist cardiothoracic centre, since 2007. He is
              honorary Professor of Cardiology at the University of Liverpool, Senior Lecturer at
              Imperial College London, and a medical advisor to the AF Association, the UK&rsquo;s
              national charity for arrhythmia patients.
            </p>
            <p className="mt-4 text-ink-soft">
              He has earned national repute in the UK for his expertise in treating atrial
              fibrillation, and proctors cardiologists across the United Kingdom, United States
              and Europe in complex procedures. Consultations available in English, Hindi and Punjabi.
            </p>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {CREDENTIALS.map((c, i) => (
              <Reveal key={c.n} delay={i * 70}>
                <p className="text-sm font-semibold text-brass-deep">{c.n}</p>
                <p className="font-semibold">{c.title}</p>
                <p className="text-sm text-ink-mute">{c.sub}</p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={300}>
            <Link href="/journey" className="mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Follow the journey, 1988 to 2026 →
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Assemble `app/page.tsx`**

```tsx
import Link from 'next/link';
import { Hero } from '@/components/home/Hero';
import { StatsBand } from '@/components/StatsBand';
import { ComparisonCards } from '@/components/home/ComparisonCards';
import { ConsultantProfile } from '@/components/home/ConsultantProfile';
import { Steps } from '@/components/Steps';
import { TestimonialCard } from '@/components/TestimonialCard';
import { VisitDates } from '@/components/VisitDates';
import { CtaBand } from '@/components/CtaBand';
import { Reveal } from '@/components/Reveal';
import { LocationsMapLazy } from '@/components/map/LocationsMapLazy';
import testimonialsJson from '@/data/testimonials.json';
import locationsJson from '@/data/locations.json';
import visitsJson from '@/data/visits.json';
import type { Location, Testimonial, Visit } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];
const locations = locationsJson as Location[];
const visits = visitsJson as Visit[];

const CONDITIONS = [
  'Atrial fibrillation (AF)',
  'Atrial flutter',
  'Supraventricular tachycardia (SVT)',
  'Palpitations & unexplained heart racing',
  'Unexplained blackouts & dizziness',
  'Bradycardia (slow heart rhythms)',
];
const PROCEDURES = [
  'Catheter ablation for atrial fibrillation',
  'Ablation for SVT and other arrhythmias',
  'Left atrial appendage occlusion (LAAO)',
  'Pacemaker implantation',
  'Implantable defibrillators (ICDs)',
  'Cardiac resynchronisation therapy',
];

export default function Home() {
  const teasers = ['pat1', 'peer1', 'hosp1']
    .map((id) => testimonials.find((t) => t.id === id))
    .filter(Boolean) as Testimonial[];

  return (
    <main id="main">
      <Hero />
      <StatsBand />
      <ComparisonCards />
      <ConsultantProfile />

      {/* Map teaser, second and final night section */}
      <section aria-labelledby="map-heading" className="bg-night text-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="map-heading" className="max-w-xl font-serif text-4xl leading-tight">
              Trusted in theatres across <em className="text-brass">two continents</em>.
            </h2>
          </Reveal>
          <div className="mt-10"><LocationsMapLazy locations={locations} /></div>
          <Reveal delay={120}>
            <Link href="/locations" className="mt-6 inline-block font-semibold text-brass hover:underline">
              Explore every location →
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="how-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">How the Mumbai clinic works</p>
            <h2 id="how-heading" className="mt-3 font-serif text-4xl">London expertise. Mumbai care. Continuous follow-up.</h2>
          </Reveal>
          <div className="mt-12"><Steps /></div>
        </div>
      </section>

      <section aria-labelledby="services-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal><h2 id="services-heading" className="font-serif text-4xl">What we look after.</h2></Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-2">
            <Reveal>
              <h3 className="font-semibold text-brass-deep">Conditions we treat</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {CONDITIONS.map((c) => <li key={c} className="border-b border-line pb-2">{c}</li>)}
              </ul>
            </Reveal>
            <Reveal delay={90}>
              <h3 className="font-semibold text-brass-deep">Procedures offered</h3>
              <ul className="mt-4 space-y-2 text-ink-soft">
                {PROCEDURES.map((p) => <li key={p} className="border-b border-line pb-2">{p}</li>)}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      <section aria-labelledby="testimonials-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal><h2 id="testimonials-heading" className="font-serif text-4xl">In their words.</h2></Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {teasers.map((t, i) => (
              <Reveal key={t.id} delay={i * 90}><TestimonialCard t={t} /></Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link href="/testimonials" className="mt-8 inline-block font-semibold text-brass-deep hover:underline">
              Read all 24 testimonials →
            </Link>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="visits-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <h2 id="visits-heading" className="font-serif text-4xl">Upcoming Mumbai visits.</h2>
            <p className="mt-3 max-w-xl text-ink-soft">Limited slots. Plan ahead.</p>
          </Reveal>
          <div className="mt-10"><VisitDates visits={visits} /></div>
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
```

- [ ] **Step 4: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK. Manual check on `npm run dev`: hero lines rise after logo, stats count up once, comparison third card visually elevated, exactly two night sections.

- [ ] **Step 5: Commit**

```bash
git add components/home app/page.tsx app/globals.css test/home.test.tsx
git commit -m "feat: homepage, hero, comparison, profile, map teaser, and full persuasion spine"
```

---

### Task 11: Evidence page with chart and FAQ accordion

**Files:**
- Create: `components/EvidenceChart.tsx`, `components/FaqAccordion.tsx`, `app/evidence/page.tsx`
- Test: `test/evidence.test.tsx`

**Interfaces:**
- Consumes: `faqs` from `data/faqs.ts`, `citations` from `data/citations.ts`, `Reveal`, `useReveal`.
- Produces:
  - `<EvidenceChart />`, accessible SVG bar comparison (low-volume vs high-volume centre complication rates), values printed as text, bars scale up on reveal (reduced-motion gated). Data constants exported as `CHART_DATA` for the test.
  - `<FaqAccordion faqs: Faq[] />`, client component; one disclosure `<button aria-expanded>` per question (button-based rather than `<details>` so keyboard/AT behaviour is uniform and testable).
  - `/evidence` page with the six spec sections and a numbered references block (`id="references"`, items `id="ref-1"`…).

- [ ] **Step 1: Write failing tests**

Create `test/evidence.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { EvidenceChart, CHART_DATA } from '@/components/EvidenceChart';
import { FaqAccordion } from '@/components/FaqAccordion';
import { faqs } from '@/data/faqs';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('chart values are readable as text (not only visual)', () => {
  render(<EvidenceChart />);
  for (const d of CHART_DATA) {
    expect(screen.getByText(`${d.value}%`)).toBeInTheDocument();
    expect(screen.getByText(d.label)).toBeInTheDocument();
  }
});

test('FAQ accordion expands an item on click', async () => {
  const user = userEvent.setup();
  render(<FaqAccordion faqs={faqs} />);
  const first = screen.getByRole('button', { name: faqs[0].question });
  expect(first).toHaveAttribute('aria-expanded', 'false');
  await user.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement**

Create `components/EvidenceChart.tsx`:

```tsx
'use client';
import { useReveal } from '@/lib/useReveal';

// [CITATION - verify] Placeholder values from the volume–outcome literature.
// Client must confirm figures and sources before launch (see data/citations.ts).
export const CHART_DATA = [
  { label: 'Lower-volume centres', value: 2.1, colour: 'var(--color-ink-mute)' },
  { label: 'Higher-volume centres', value: 0.9, colour: 'var(--color-brass-deep)' },
];

const MAX = 2.5;

export function EvidenceChart() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref}>
      <figure aria-label="Major complication rates at lower-volume versus higher-volume centres">
        <div className="flex items-end justify-center gap-16" style={{ height: 260 }}>
          {CHART_DATA.map((d) => (
            <div key={d.label} className="flex w-40 flex-col items-center justify-end self-stretch">
              <span className="mb-2 font-serif text-3xl">{d.value}%</span>
              <div
                className="w-full rounded-t transition-transform duration-700 ease-out"
                style={{
                  height: `${(d.value / MAX) * 180}px`,
                  background: d.colour,
                  transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                  transformOrigin: 'bottom',
                }}
              />
              <span className="mt-3 text-center text-sm font-semibold text-ink-soft">{d.label}</span>
            </div>
          ))}
        </div>
        <figcaption className="mt-6 text-center text-sm text-ink-mute">
          Major complication rates after AF ablation, by centre volume.<sup>2, 4</sup>{' '}
          Published research consistently finds lower complication rates where more of these
          procedures are done. [CITATION - verify]
        </figcaption>
      </figure>
    </div>
  );
}
```

Create `components/FaqAccordion.tsx`:

```tsx
'use client';
import { useState } from 'react';
import type { Faq } from '@/data/types';

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f, i) => {
        const open = openIndex === i;
        return (
          <div key={f.question} className="py-4">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="flex w-full items-center justify-between gap-4 text-left font-serif text-xl"
              >
                {f.question}
                <span aria-hidden className={`text-brass-deep transition-transform ${open ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
            </h3>
            {open && (
              <p id={`faq-panel-${i}`} className="mt-3 max-w-2xl text-ink-soft">
                {f.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
```

Create `app/evidence/page.tsx` (**copy is final, checked against the GMC guardrail**):

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { EvidenceChart } from '@/components/EvidenceChart';
import { FaqAccordion } from '@/components/FaqAccordion';
import { faqs } from '@/data/faqs';
import { citations } from '@/data/citations';

export const metadata: Metadata = {
  title: 'The Evidence, Mumbai London AF Clinic',
  description:
    'What published research says about PFA, RFA, and why the experience of the operator matters, in plain English, with citations.',
};

export default function EvidencePage() {
  return (
    <main id="main">
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">The evidence</p>
            <h1 className="mt-3 font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
              Whatever the machine, it is safer in <em className="text-brass-deep">experienced hands</em>.
            </h1>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-8 text-lg text-ink-soft">
              You may have been offered PFA, pulsed field ablation, because it is the newest
              way to treat atrial fibrillation. RFA, radiofrequency ablation, uses carefully
              controlled heat; PFA uses short electrical pulses instead. Both treat the same
              small areas of heart tissue that trigger AF.
            </p>
            <p className="mt-4 text-lg text-ink-soft">
              In 2025, the largest trials directly comparing the two reported their results:
              PFA and RFA performed broadly comparably. Neither was clearly superior.<sup><a href="#ref-1">1</a></sup>
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="volume-heading" className="border-y border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <h2 id="volume-heading" className="font-serif text-3xl">The number that does change your outcome.</h2>
            <p className="mt-4 text-ink-soft">
              Across published studies, one factor shows up again and again: how often the
              centre, and the doctor, performs the procedure.<sup><a href="#ref-2">2</a></sup>
            </p>
          </Reveal>
          <div className="mt-12"><EvidenceChart /></div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal>
            <h2 className="font-serif text-3xl">What this means for you.</h2>
            <p className="mt-4 text-ink-soft">
              The right question is not &ldquo;which technology?&rdquo; It is &ldquo;who is
              holding the catheter?&rdquo; Professor Gupta offers both RFA and PFA, and
              chooses the right tool for each patient.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="mt-14 font-serif text-3xl">His numbers, in context.</h2>
            <ul className="mt-5 space-y-3 text-ink-soft">
              <li>200+ ablations a year, every year since 2009, among the highest volumes of any UK operator.<sup><a href="#ref-3">3</a></sup></li>
              <li>A published complication rate below 1%.<sup><a href="#ref-3">3</a></sup></li>
              <li>More than 5,000 procedures across his career.</li>
            </ul>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="faq-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-3xl px-5 py-20">
          <Reveal><h2 id="faq-heading" className="font-serif text-3xl">Your questions, plainly answered.</h2></Reveal>
          <div className="mt-10"><FaqAccordion faqs={faqs} /></div>
          <Reveal delay={100}>
            <Link href="/book" className="mt-12 inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper hover:bg-night">
              Book a consultation
            </Link>
          </Reveal>
        </div>
      </section>

      <section id="references" aria-labelledby="ref-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-3xl px-5 py-14">
          <h2 id="ref-heading" className="font-serif text-2xl">References</h2>
          <ol className="mt-5 list-decimal space-y-2 pl-5 text-sm text-ink-soft">
            {citations.map((c) => (
              <li key={c.id} id={`ref-${c.id}`}>{c.text}</li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK.

- [ ] **Step 4: Commit**

```bash
git add components/EvidenceChart.tsx components/FaqAccordion.tsx app/evidence test/evidence.test.tsx
git commit -m "feat: evidence page, volume-outcome chart, FAQs, numbered citations"
```

---

### Task 12: Journey page

**Files:**
- Create: `components/JourneyTimeline.tsx`, `app/journey/page.tsx`
- Test: `test/journey.test.tsx`

**Interfaces:**
- Consumes: `milestones` from `data/milestones.ts`, `Reveal`.
- Produces: `/journey`, sticky photo-panel + scrolling milestones (desktop: left column sticky with year markers and the active milestone's photo placeholder frame; right column scrolls through 11 milestone articles; IntersectionObserver switches the active frame). Mobile: photo placeholder inline inside each milestone, sticky panel hidden.

- [ ] **Step 1: Write failing test**

Create `test/journey.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { milestones } from '@/data/milestones';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('renders all 10 milestones with years and photo placeholders', () => {
  render(<JourneyTimeline milestones={milestones} />);
  expect(screen.getAllByRole('article')).toHaveLength(10);
  for (const m of milestones) {
    expect(screen.getAllByText(m.yearLabel).length).toBeGreaterThan(0);
  }
  // photo placeholder labels exist (desktop frame + inline mobile frames)
  expect(screen.getAllByText(/photograph/i).length).toBeGreaterThan(0);
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement**

Create `components/JourneyTimeline.tsx`:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import type { Milestone } from '@/data/types';

function PhotoFrame({ m }: { m: Milestone }) {
  return (
    <figure className="rounded-lg border border-line bg-paper-soft p-6">
      <div className="flex aspect-[4/3] items-center justify-center rounded border border-dashed border-line text-xs uppercase tracking-widest text-ink-mute">
        photograph
      </div>
      <figcaption className="mt-4">
        <p className="font-serif text-xl">{m.photoTitle}</p>
        <p className="mt-1 text-sm text-ink-soft">{m.photoCaption}</p>
      </figcaption>
    </figure>
  );
}

export function JourneyTimeline({ milestones }: { milestones: Milestone[] }) {
  const [activeYear, setActiveYear] = useState(milestones[0].markerYear);
  const refs = useRef(new Map<string, HTMLElement>());

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const year = (e.target as HTMLElement).dataset.year;
            if (year) setActiveYear(year);
          }
        }
      },
      { rootMargin: '-40% 0px -40% 0px' },
    );
    refs.current.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [milestones]);

  const active = milestones.find((m) => m.markerYear === activeYear) ?? milestones[0];

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 lg:grid-cols-[2fr_3fr]">
      {/* Sticky panel, desktop only */}
      <div className="hidden lg:block">
        <div className="sticky top-28 space-y-6">
          <ol className="flex flex-wrap gap-x-4 gap-y-2" aria-label="Years">
            {milestones.map((m) => (
              <li
                key={m.markerYear}
                className={`text-sm font-semibold ${m.markerYear === activeYear ? 'text-brass-deep' : 'text-ink-mute'}`}
              >
                {m.markerYear}
                {m.markerYear === activeYear && (
                  <span className="ml-1 font-normal text-ink-soft">· {m.markerSub}</span>
                )}
              </li>
            ))}
          </ol>
          <PhotoFrame m={active} />
        </div>
      </div>

      {/* Scrolling milestones */}
      <div>
        {milestones.map((m) => (
          <article
            key={m.markerYear}
            data-year={m.markerYear}
            ref={(el) => {
              if (el) refs.current.set(m.markerYear, el);
            }}
            className="border-b border-line py-12 last:border-none"
          >
            <div className="lg:hidden"><PhotoFrame m={m} /></div>
            <p className="mt-6 text-sm font-semibold text-brass-deep lg:mt-0">{m.yearLabel}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-ink-mute">{m.tag}</p>
            <h2 className="mt-3 font-serif text-3xl">{m.title}</h2>
            <p className="mt-4 text-ink-soft">{m.body}</p>
            {m.meta && <p className="mt-4 text-sm font-semibold text-ink-soft">{m.meta}</p>}
          </article>
        ))}
      </div>
    </div>
  );
}
```

Create `app/journey/page.tsx`:

```tsx
import type { Metadata } from 'next';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { milestones } from '@/data/milestones';

export const metadata: Metadata = {
  title: 'The Journey, Mumbai London AF Clinic',
  description:
    'From medical school in 1988 to the Mumbai London AF Clinic in 2026, the journey of Professor Dhiraj Gupta.',
};

export default function JourneyPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 pb-4 pt-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">The journey · 1988 to 2026</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Thirty-eight years, <em className="text-brass-deep">one specialty</em>.
          </h1>
        </Reveal>
      </section>
      <section className="py-10">
        <JourneyTimeline milestones={milestones} />
      </section>
      <section className="mx-auto max-w-6xl px-5 pb-20">
        <Link href="/book" className="inline-block rounded-full bg-ink px-7 py-3.5 font-semibold text-paper hover:bg-night">
          Book a consultation
        </Link>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK. Manual check: on desktop the photo panel sticks and switches as you scroll; on a narrow window photos render inline per milestone.

- [ ] **Step 4: Commit**

```bash
git add components/JourneyTimeline.tsx app/journey test/journey.test.tsx
git commit -m "feat: journey page with sticky photo panel and scrolling milestones"
```

---

### Task 13: Testimonials page

**Files:**
- Create: `components/TestimonialsGrid.tsx`, `app/testimonials/page.tsx`
- Test: `test/testimonials-page.test.tsx`

**Interfaces:**
- Consumes: `data/testimonials.json`, `TestimonialCard` (Task 8).
- Produces: `/testimonials`, filter pills (All 24 / Hospitals 6 / Patients 8 / Peers 6 / News 4) with live result count, card grid, `<dialog>`-based full-letter modal for hospital cards, empty state.

- [ ] **Step 1: Write failing test**

Create `test/testimonials-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestimonialsGrid } from '@/components/TestimonialsGrid';

test('filters the grid and updates the count', async () => {
  const user = userEvent.setup();
  render(<TestimonialsGrid />);
  expect(screen.getAllByRole('article')).toHaveLength(24);
  await user.click(screen.getByRole('button', { name: /patients/i }));
  expect(screen.getAllByRole('article')).toHaveLength(8);
  expect(screen.getByText(/8 testimonials shown/i)).toBeInTheDocument();
});

test('opens the full letter dialog from a hospital card', async () => {
  const user = userEvent.setup();
  // jsdom lacks <dialog> methods
  HTMLDialogElement.prototype.showModal = HTMLDialogElement.prototype.showModal ?? function (this: HTMLDialogElement) { this.open = true; };
  HTMLDialogElement.prototype.close = HTMLDialogElement.prototype.close ?? function (this: HTMLDialogElement) { this.open = false; };
  render(<TestimonialsGrid />);
  await user.click(screen.getAllByRole('button', { name: /read full letter/i })[0]);
  expect(screen.getByText(/It gives me great pleasure to write in support/)).toBeInTheDocument();
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement**

Create `components/TestimonialsGrid.tsx`:

```tsx
'use client';
import { useMemo, useRef, useState } from 'react';
import { TestimonialCard } from '@/components/TestimonialCard';
import testimonialsJson from '@/data/testimonials.json';
import type { Testimonial } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'hospital', label: 'Hospitals' },
  { id: 'patient', label: 'Patients' },
  { id: 'peer', label: 'Peers' },
  { id: 'news', label: 'News' },
] as const;

export function TestimonialsGrid() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]['id']>('all');
  const [letter, setLetter] = useState<Testimonial | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const shown = useMemo(
    () => (filter === 'all' ? testimonials : testimonials.filter((t) => t.category === filter)),
    [filter],
  );

  const openLetter = (t: Testimonial) => {
    setLetter(t);
    dialogRef.current?.showModal();
  };
  const closeLetter = () => {
    dialogRef.current?.close();
    setLetter(null);
  };

  const countFor = (id: string) =>
    id === 'all' ? testimonials.length : testimonials.filter((t) => t.category === id).length;

  return (
    <div>
      <div role="group" aria-label="Filter testimonials" className="flex flex-wrap gap-3">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              filter === f.id
                ? 'border-ink bg-ink text-paper'
                : 'border-line bg-white text-ink-soft hover:border-ink-soft'
            }`}
          >
            {f.label} <span className="opacity-70">{countFor(f.id)}</span>
          </button>
        ))}
      </div>
      {/* Single text node so tests and screen readers get "N testimonials shown" in one piece */}
      <p className="mt-4 text-sm font-semibold text-ink-soft" aria-live="polite">
        {`${shown.length} testimonials shown`}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((t) => (
          <TestimonialCard key={t.id} t={t} onOpenLetter={openLetter} />
        ))}
      </div>
      {shown.length === 0 && <p className="mt-10 text-ink-mute">No testimonials in this category yet.</p>}

      <dialog
        ref={dialogRef}
        onClose={() => setLetter(null)}
        className="m-auto w-[min(640px,92vw)] rounded-lg border border-line bg-paper p-0 backdrop:bg-night/70"
      >
        {letter?.letter && (
          <div className="p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">{letter.letter.tag}</p>
                <p className="mt-2 font-serif text-2xl">{letter.letter.org}</p>
                <p className="text-sm text-ink-mute">{letter.letter.subtitle} · {letter.letter.date}</p>
              </div>
              <button type="button" onClick={closeLetter} aria-label="Close letter"
                className="rounded-full border border-line px-3 py-1 text-ink-soft hover:text-ink">
                ×
              </button>
            </div>
            <div className="mt-6 space-y-4 text-ink-soft">
              {letter.letter.body.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="mt-6 font-semibold">{letter.letter.sigName}</p>
            <p className="text-sm text-ink-mute">{letter.letter.sigRole}</p>
          </div>
        )}
      </dialog>
    </div>
  );
}
```

Create `app/testimonials/page.tsx`:

```tsx
import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { TestimonialsGrid } from '@/components/TestimonialsGrid';

export const metadata: Metadata = {
  title: 'Testimonials, Mumbai London AF Clinic',
  description:
    'Letters from hospitals, messages from patients, endorsements from peers, and press coverage of Professor Dhiraj Gupta.',
};

export default function TestimonialsPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Testimonials</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Don&rsquo;t take <em className="text-brass-deep">our word</em> for it.
          </h1>
        </Reveal>
        <div className="mt-12">
          <TestimonialsGrid />
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK.

- [ ] **Step 4: Commit**

```bash
git add components/TestimonialsGrid.tsx app/testimonials test/testimonials-page.test.tsx
git commit -m "feat: filterable testimonials page with full-letter dialog"
```

---

### Task 14: Book page

**Files:**
- Create: `app/book/page.tsx`
- Test: `test/book-page.test.tsx`

**Interfaces:**
- Consumes: `EnquiryForm` (full variant), `VisitDates`, `site`, `data/visits.json`.
- Produces: `/book`, enquiry form beside a contact card (WhatsApp deep link, phone, email) and the upcoming visit dates.

- [ ] **Step 1: Write failing test**

Create `test/book-page.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import BookPage from '@/app/book/page';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('book page shows form fields, contact channels and visit dates', () => {
  render(<BookPage />);
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/preferred visit month/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  expect(screen.getByText('Booking open')).toBeInTheDocument();
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement `app/book/page.tsx`**

```tsx
import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { EnquiryForm } from '@/components/EnquiryForm';
import { VisitDates } from '@/components/VisitDates';
import { site } from '@/data/site';
import visitsJson from '@/data/visits.json';
import type { Visit } from '@/data/types';

const visits = visitsJson as Visit[];

export const metadata: Metadata = {
  title: 'Book a Consultation, Mumbai London AF Clinic',
  description:
    'Send an enquiry or message the clinic on WhatsApp to book a consultation with Professor Dhiraj Gupta in Mumbai.',
};

export default function BookPage() {
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Book a consultation</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Start with a <em className="text-brass-deep">conversation</em>.
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft">
            Tell us a little about the problem. The clinic team will contact you within{' '}
            {site.responseDays} working days to arrange the next step.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[3fr_2fr]">
          <Reveal className="rounded-lg border border-line bg-white p-8">
            <EnquiryForm />
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={100} className="rounded-lg border border-line bg-paper-soft p-8">
              <h2 className="font-serif text-2xl">Prefer to talk directly?</h2>
              <ul className="mt-5 space-y-4">
                <li>
                  <a href={site.whatsappHref} target="_blank" rel="noopener noreferrer"
                    className="font-semibold text-brass-deep hover:underline">
                    Message on WhatsApp →
                  </a>
                </li>
                <li>
                  <a href={`tel:${site.phone}`} className="font-semibold text-brass-deep hover:underline">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="font-semibold text-brass-deep hover:underline">
                    {site.email}
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-serif text-3xl">Upcoming Mumbai visits.</h2>
          </Reveal>
          <div className="mt-8"><VisitDates visits={visits} /></div>
        </div>
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS / build OK. Manual check: submit the form empty → friendly errors; submit valid → success message with response-time expectation.

- [ ] **Step 4: Commit**

```bash
git add app/book/page.tsx test/book-page.test.tsx
git commit -m "feat: book page with enquiry form, direct contact channels, and visit dates"
```

---

### Task 15: Brand assets, recoloured logo via Higgsfield MCP

> **Note for the orchestrator:** this task calls Higgsfield MCP tools. If the executing subagent has no MCP access, the orchestrating agent should run the generation steps itself and hand the saved files to the subagent (or run this whole task inline). If image generation fails entirely, skip Steps 1–3, leave `USE_IMAGE_ASSETS = false`, and record the gap, the SVG fallback keeps the site shippable.

**Files:**
- Create: `public/brand/logo-full.png`, `public/brand/logo-mark.png`, `public/brand/logo-dark.png`, `app/icon.png`
- Modify: `components/Logo.tsx` (flip `USE_IMAGE_ASSETS` to `true`)
- Reference input: `reference/logo-original.jpeg`

**Interfaces:**
- Consumes: `Logo` component contract from Task 6 (paths `/brand/logo-{full,mark,dark}.png`).
- Produces: the three brand PNGs (2x resolution, transparency) and the favicon.

- [ ] **Step 1: Generate the recoloured full logo**

Use the Higgsfield MCP image edit tool (ChatGPT Image-class edit model, consult `models_explore(action:'recommend')` if unsure), with `reference/logo-original.jpeg` uploaded as the reference image (use `media_upload` / the upload widget as the server instructions require). Edit prompt:

> Recolour this logo. Keep the exact composition: two city skylines (London left, Mumbai right) connected by an ECG heartbeat line with a medical cross. Change the skylines to deep petrol-navy (#122B3A), the ECG line and cross to warm brass (#B08D3E), and make the background fully transparent. Clean vector-flat style, no gradients, no new elements, no text changes.

Save the result to `public/brand/logo-full.png` (target ≥ 1600px wide).

- [ ] **Step 2: Generate the dark variant and the compact mark**

Dark variant, same reference, edit prompt:

> Recolour this logo for use on a very dark navy background. Skylines and any text in warm cream (#F7F5F1), ECG line and cross in brass (#B08D3E), fully transparent background. Keep composition identical.

Save to `public/brand/logo-dark.png`.

Compact mark, crop/derive from the full logo: skyline-plus-ECG segment only, square-ish composition, transparent background. Save to `public/brand/logo-mark.png` (≥ 512×512), and copy it to `app/icon.png` (Next.js picks this up as the favicon automatically).

- [ ] **Step 3: Flip the Logo component to image assets**

In `components/Logo.tsx` change:

```ts
export const USE_IMAGE_ASSETS = true;
```

- [ ] **Step 4: Verify**

Run: `npm test && npm run build`, then `npm run dev`, confirm the mark renders in the nav, the dark variant in the footer/hero, and the favicon appears. Check the PNGs have real transparency (no cream box on dark sections).

- [ ] **Step 5: Commit**

```bash
git add public/brand app/icon.png components/Logo.tsx
git commit -m "feat: recoloured Midnight Atlas brand assets and favicon"
```

---

### Task 16: SEO, metadata defaults, JSON-LD, sitemap, robots

**Files:**
- Create: `components/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`
- Modify: `app/layout.tsx`
- Test: `test/seo.test.tsx`

**Interfaces:**
- Consumes: `site` from `data/site.ts`.
- Produces: `metadataBase` + Open Graph defaults in the root layout; `Physician`/`MedicalClinic` JSON-LD injected in the layout; `/sitemap.xml` listing all six routes; `/robots.txt`.

- [ ] **Step 1: Write failing test**

Create `test/seo.test.tsx`:

```tsx
import { render } from '@testing-library/react';
import { JsonLd } from '@/components/JsonLd';
import sitemap from '@/app/sitemap';

test('JSON-LD declares Physician and MedicalClinic', () => {
  const { container } = render(<JsonLd />);
  const script = container.querySelector('script[type="application/ld+json"]')!;
  const data = JSON.parse(script.textContent!);
  const types = JSON.stringify(data);
  expect(types).toContain('Physician');
  expect(types).toContain('MedicalClinic');
});

test('sitemap lists all six routes', () => {
  const routes = sitemap().map((e) => new URL(e.url).pathname);
  expect(routes.sort()).toEqual(['/', '/book', '/evidence', '/journey', '/locations', '/testimonials'].sort());
});
```

Run: `npm test`, expected: FAIL.

- [ ] **Step 2: Implement**

Create `components/JsonLd.tsx`:

```tsx
import { site } from '@/data/site';

const BASE = 'https://www.mumbailondonaf.com'; // [placeholder, confirm domain]

const data = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Physician',
      '@id': `${BASE}#physician`,
      name: 'Professor Dhiraj Gupta',
      medicalSpecialty: 'Cardiovascular',
      description:
        'Consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital; sees patients at the Mumbai London AF Clinic.',
      url: BASE,
      worksFor: { '@id': `${BASE}#clinic` },
    },
    {
      '@type': 'MedicalClinic',
      '@id': `${BASE}#clinic`,
      name: site.name,
      url: BASE,
      email: site.email,
      telephone: site.phone,
      address: { '@type': 'PostalAddress', addressLocality: 'Mumbai', addressCountry: 'IN' },
      medicalSpecialty: 'Cardiovascular',
    },
  ],
};

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

Create `app/sitemap.ts`:

```ts
import type { MetadataRoute } from 'next';

const BASE = 'https://www.mumbailondonaf.com'; // [placeholder, confirm domain]

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/evidence', '/journey', '/locations', '/testimonials', '/book'].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }));
}
```

Create `app/robots.ts`:

```ts
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: 'https://www.mumbailondonaf.com/sitemap.xml', // [placeholder, confirm domain]
  };
}
```

In `app/layout.tsx`: add `<JsonLd />` just inside `<body>`, and extend the exported metadata:

```ts
export const metadata: Metadata = {
  metadataBase: new URL('https://www.mumbailondonaf.com'), // [placeholder, confirm domain]
  title: { default: 'Mumbai London AF Clinic', template: '%s' },
  description:
    'Specialist atrial fibrillation care in Mumbai from Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital.',
  openGraph: {
    siteName: 'Mumbai London AF Clinic',
    type: 'website',
    locale: 'en_GB',
  },
};
```

- [ ] **Step 3: Run tests and build**

Run: `npm test && npm run build`
Expected: PASS; build output shows `/sitemap.xml` and `/robots.txt` routes.

- [ ] **Step 4: Commit**

```bash
git add components/JsonLd.tsx app/sitemap.ts app/robots.ts app/layout.tsx test/seo.test.tsx
git commit -m "feat: SEO, OG defaults, Physician/MedicalClinic JSON-LD, sitemap, robots"
```

---

### Task 17: Accessibility audit, Lighthouse, cleanup

**Files:**
- Modify: anything flagged by the audit
- Delete: `reference/mumbai-london-af-clinic.html`, `reference/journey.html`, `reference/testimonials.html`, `reference/cursor-prompt-af-clinic.md`

**Interfaces:**
- Consumes: the complete site.
- Produces: Lighthouse accessibility ≥ 95 on every page; reference HTML removed.

- [ ] **Step 1: Full-suite regression**

Run: `npm test && npm run build`
Expected: all tests PASS, build clean.

- [ ] **Step 2: Lighthouse accessibility on every route**

```bash
npm run build && (npm run start &) && sleep 5
for p in home evidence journey locations testimonials book; do
  route=$([ "$p" = home ] && echo "" || echo "$p")
  npx lighthouse "http://localhost:3000/$route" --only-categories=accessibility --quiet \
    --chrome-flags="--headless" --output=json --output-path="/tmp/lh-$p.json"
done
for f in /tmp/lh-*.json; do
  node -e "const r=require('$f'); console.log('$f'.padEnd(30), r.categories.accessibility.score*100)"
done
```

Expected: every score ≥ 95. Fix any flagged issues (common ones: contrast on `ink-mute`, missing alt text, focus order in the mobile menu and dialog) and re-run until green.

- [ ] **Step 3: Manual accessibility + reduced-motion sweep**

- Keyboard: Tab through every page, skip link appears first; nav, map buttons, map pins, accordion, filter pills, dialog close, and form are all reachable and operable; dialog traps focus (native `<dialog>` behaviour).
- Enable "Reduce Motion" in macOS System Settings → verify: no hero line rise, stats show final values instantly, no pin drop animation, no map fly (jump-cuts instead), chart bars fully drawn.
- Check both night sections per page maximum holds on every page.

- [ ] **Step 4: Success-criteria check against the spec**

- Homepage answers within one scroll: who he is, why his experience matters, how to book.
- Comparison and Evidence copy contains no superiority claims (`grep -ri "better than\|safer than\|superior to\|more effective than" app components data` returns nothing clinical).
- Every clinical claim on `/evidence` carries a numbered citation; all placeholder citations still carry `[CITATION - verify]` (launch blocker list goes to the client).
- Content edits are data-file-only: confirm `data/` alone drives visits, locations, testimonials, milestones, FAQs, contact details.

- [ ] **Step 5: Delete ported reference pages and commit**

```bash
git rm reference/mumbai-london-af-clinic.html reference/journey.html reference/testimonials.html reference/cursor-prompt-af-clinic.md
git add -A
git commit -m "chore: remove ported reference pages after accessibility audit"
```

(Keep `reference/logo-original.jpeg` until the client signs off the new brand assets.)

---

## Launch-blocker checklist (hand to client)

Not tasks, these must be resolved by the client before go-live:

- Real citations to replace all `[CITATION - verify]` entries (`data/citations.ts`, `components/EvidenceChart.tsx` values).
- Real contact details, GMC number, response-time promise (`data/site.ts`).
- Real visit dates (`data/visits.json`), locations (`data/locations.json`), portrait and milestone photos.
- Domain confirmation (replace `https://www.mumbailondonaf.com` placeholders in `components/JsonLd.tsx`, `app/sitemap.ts`, `app/robots.ts`, `app/layout.tsx`).
