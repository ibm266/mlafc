# Mumbai London AF Clinic, Website Design Spec

**Date:** 2026-07-04
**Status:** Approved direction, "Midnight Atlas"
**Scope:** Full site rebuild (6 pages) in Next.js + Tailwind

---

## 1. Purpose and strategy

A professional website for Professor Dhiraj Gupta, consultant cardiologist and
electrophysiologist at Liverpool Heart and Chest Hospital, now also seeing
patients in Mumbai (Mumbai London AF Clinic).

**The single conversion goal:** get a patient (or their family) to make an
enquiry / book an initial consultation.

**The core persuasive message:** patients are being offered PFA (pulsed field
ablation) because it is newer and widely available. The evidence from the
largest 2025 head-to-head trials shows PFA and RFA are broadly comparable, neither clearly superior. What actually changes a patient's outcome is
**operator experience and volume**, not the machine. The site must move the
patient's question from "which technology?" to "who is holding the catheter?"
and position Prof Gupta's 5,000+ ablations, <1% complication rate, and his
ability to choose the right tool per patient as the real advantage.

**Regulatory guardrail (non-negotiable):** this is a real doctor advertising
under UK GMC and ASA rules. Never state RFA is better, safer, or more
effective than PFA (or vice versa). All comparisons factual and
non-superlative. Every clinical claim on the Evidence page carries a citation.

**Tone requirement from the client:** clean, professional, and very easy to
understand. Patients may be older and non-technical. Short sentences, plain
English, generous whitespace, obvious next steps. No jargon without an
immediate plain-language explanation.

## 2. Creative direction, "Midnight Atlas"

The map is the identity. Cartographic motifs: hairline rules, coordinate
marks, and a dotted Liverpool–Mumbai arc echoing the ECG line in the logo.

### Palette (design tokens, CSS variables via Tailwind theme)

| Token | Hex | Use |
|---|---|---|
| `--paper` | `#F7F5F1` | Warm porcelain page background |
| `--ink` | `#122B3A` | Deep petrol-navy text / dark section background |
| `--ink-soft` | `#3A5468` | Secondary text on light |
| `--ink-mute` | `#6B7F8E` | Muted text, captions |
| `--brass` | `#B08D3E` | Accent: links, pins, accents on dark |
| `--brass-deep` | `#8F7231` | Accent hover / accent text on light (AA-safe) |
| `--paper-soft` | `#EFEBE3` | Cards, alternate bands on light |
| `--night` | `#0C1F2B` | Deepest navy (hero, map section) |
| `--night-soft` | `#16303F` | Cards on dark |
| `--line` | `#D9D3C7` | Hairline rules on light |
| `--line-dark` | `#2A4254` | Hairline rules on dark |

All text/background combinations must pass WCAG AA. On dark sections, body
text is `--paper`; brass is reserved for accents and large display text only
(checked for AA at the size used).

### Typography

- **Display serif:** Newsreader (Google Fonts), headlines, pull quotes,
  large numerals. Weights 400/500, italic for accent words.
- **Sans:** Archivo (Google Fonts), body, UI, labels, buttons.
  Weights 400/500/600.
- Base body size 17–18px, line-height ≥1.6. Headline scale via `clamp()`.

### Light/dark rhythm

Light porcelain is the default. Two "night" sections per page maximum (e.g.
homepage: hero and map section) so dark stays dramatic, not heavy. All
components must render correctly on both via tokens.

### Logo

Existing logo (London + Mumbai skylines over ECG/stethoscope line, cream
background, slate/orange colours) needs recolouring to the new palette:
skylines in petrol-navy, ECG line and cross in brass, transparent or
`--paper` background. Produce via Higgsfield MCP image editing (ChatGPT
Image 2 model or equivalent edit tool) using the existing
`WhatsApp Image 2026-07-04 at 15.51.39.jpeg` as the reference image.
Deliverables: full logo (PNG with transparency, 2x), plus a compact mark
(skyline-only crop) for the nav and favicon. A light-on-dark variant for
night sections.

## 3. Site structure

| Route | Page | Job |
|---|---|---|
| `/` | Home | Persuasion spine → enquiry |
| `/evidence` | The Evidence | Why experienced hands matter, whatever the machine |
| `/journey` | The Journey | Accolade timeline 1988–2026 |
| `/locations` | Where He Works | Full-page interactive map + list |
| `/testimonials` | Testimonials | Filterable grid of 24 existing testimonials |
| `/book` | Book a Consultation | Enquiry form, WhatsApp, visit dates |

**Global elements on every page:**

- Sticky nav: compact logo mark, links (Evidence, Journey, Where He Works,
  Testimonials), dark "Book a consultation" button. Subtle shrink + shadow
  after scrolling past the hero. Mobile: hamburger sheet menu, CTA always
  visible.
- Footer: full logo, tagline, link columns, GMC registration line, one-line
  medical disclaimer, contact details.
- Floating WhatsApp quick-link button (bottom-right, mobile especially).

## 4. Homepage flow

1. **Hero** (night section). Logo mark fades in first; headline rises
   line-by-line with a soft ease; italic brass treatment on the key phrase.
   Lead paragraph plants "the hands matter more than the technology."
   CTAs: "Book a consultation" (primary) and "See the evidence" (secondary).
   Pull-quote aside from Prof Gupta. Behind: faint animated dotted arc from
   London to Mumbai (SVG, subtle, disabled under reduced motion).
2. **Stats band.** 5,000+ ablations · <1% complication rate · 18+ years as
   consultant · 350+ publications. Numbers count up on first scroll into view.
3. **Comparison section.** Heading: "Two technologies. One question that
   matters more than both." Three cards: RFA (factual), PFA (factual, fair),
   and a visually elevated third card on operator experience → links to
   `/evidence`. Copy pre-checked against the GMC guardrail.
4. **Meet the consultant.** Portrait (placeholder frame until photo
   supplied), name, MB BS MD DM FRCP (London), short bio, credential grid
   (NHS Silver CEA, Arrhythmia Alliance award, Chief Investigator of 5
   trials, BHF booklet author), link to `/journey`.
5. **Map teaser** (night section). Embedded Leaflet map (see §7) with a
   heading like "Trusted in theatres across two continents." Link to
   `/locations`.
6. **How it works.** Three steps: consultation → procedure in Mumbai →
   local follow-up under his supervision. Plain-language, numbered.
7. **Conditions & treatments.** Two columns (conditions / procedures),
   reusing the existing lists.
8. **Testimonials teaser.** Three cards → `/testimonials`.
9. **Upcoming Mumbai visits.** Date cards with booking status
   (Booking open / Waitlist / TBC) from a data file.
10. **Final CTA band** (dark) with compact enquiry form + WhatsApp link.

## 5. The Evidence page (`/evidence`)

Framing fixed by the client: **regardless of the procedure, it is always
safer in more experienced hands, as shown by the literature.**

Structure:

1. **Opening.** Honest framing: in the largest 2025 head-to-head trials, PFA
   and RFA performed comparably. Neither presented as superior. Plain-English
   one-line explanation of what each is.
2. **The volume–outcome relationship** (centrepiece). A simple animated
   bar/dot chart comparing complication rates at low-volume vs high-volume
   centres, built from published literature with visible citations beneath.
   Rendered as an accessible SVG (values in text too), animating in on
   scroll. Kept deliberately simple, one chart, one message.
3. **What this means for you.** The right question is "who is holding the
   catheter." Prof Gupta offers both RFA and PFA and chooses per patient.
4. **His numbers in context.** 200+ ablations/year since 2009; <1% published
   complication rate; among the highest-volume operators in the UK.
5. **FAQ accordion.** 5–7 plain-language questions ("Is PFA newer and
   therefore better?", "Is ablation safe?", "Which will I get?").
6. **CTA** to book.

Citation handling: numbered superscript references with a references block at
page end. Placeholder citations clearly marked `[CITATION - verify]` until
real references are supplied; page must not launch with placeholders.

## 6. Journey, Testimonials, Book pages

- **`/journey`:** rebuild of the existing timeline (1988 medical school →
  1994 MB BS → 2000 Commonwealth Fellowship → 2007 LHCH consultant → 2009
  200+/year → 2012 FRCP → 2014 Arrhythmia Alliance award → 2017 NHS Bronze →
  2022 NHS Silver → 2024 Professorship → 2026 Mumbai clinic). Keep the
  sticky photo-panel + scrolling milestones mechanic (it works well),
  restyled to Midnight Atlas tokens. Photo placeholders until real
  photographs supplied. Mobile: photos inline per milestone.
- **`/testimonials`:** filterable grid (by category, as the current page has)
  of the 24 existing testimonials, ported into a JSON data file. Teaser
  cards on homepage draw from the same data.
- **`/book`:** enquiry form, name, phone (with country code), email, brief
  description of the problem, preferred visit month (from visit-dates data).
  Client-side validation with friendly messages. Submission goes through a
  single server action stub (logs + returns success) so wiring email/a form
  service later is a one-file change. Success state thanks the user and sets
  the expectation ("the clinic team will contact you within X working days", placeholder). Alongside: WhatsApp deep link, phone, email, and the
  upcoming visit dates card.

## 7. Interactive map (shared component)

- **Library:** Leaflet + react-leaflet, dynamically imported with
  `ssr: false`.
- **Tiles:** CartoDB Dark Matter (muted) on night sections / CartoDB
  Positron if ever used on light. Tinted to harmonise with the palette.
- **Data:** single file `data/locations.json`. Fields per entry: `id`,
  `name`, `country`, `lat`, `lng`, `role` (`operated` | `taught` |
  `proctored`), `years`, `blurb`, `images[]`, `readMore`. Ship with ~12
  realistic placeholder entries (Liverpool, London, Manchester, Leeds,
  Birmingham, 3–4 European centres, 1–2 US centres, Mumbai), clearly marked
  placeholder in a top-of-file comment; client swaps in real data.
- **Pins:** custom SVG markers in brass, colour-varied by role, with a
  three-item legend. Gentle drop-in on load; small scale pulse on active pin.
- **Clustering:** UK pins cluster at low zoom.
- **Popups:** location name in the serif, role chip, years, blurb, 1–2
  lazy-loaded images, "Read more" link. Hover-open on desktop, tap on mobile.
- **Controls:** "UK" and "India" buttons above the map that fly the map and
  fit bounds to each region.
- **Accessibility:** keyboard-focusable pins and buttons; plain-text list of
  all locations below the map (grouped by country, role labelled) as the
  fallback, this list is the `/locations` page's second half.
- **Placement:** the map always sits on a night section (homepage teaser and
  the top half of `/locations`) so the dark tiles and brass pins read as one
  composition; the `/locations` text list below is on the light ground.

## 8. Animation system

- One shared `useReveal` hook (IntersectionObserver): fade + 16px rise,
  60–100ms stagger between siblings, 400–700ms soft ease.
- Count-up numerals in the stats band (once, on first view).
- Nav shrink/shadow past hero.
- Hero headline line rise; logo mark fades first.
- Map pin drop-in and active-pin pulse.
- Evidence chart draws in on scroll.
- **All motion gated behind `prefers-reduced-motion: reduce`**, when set,
  everything renders in its final state instantly.
- Nothing bouncy, no parallax. Motion supports seriousness.

## 9. Technical architecture

- **Framework:** Next.js (App Router, latest stable) + Tailwind CSS v4.
  TypeScript throughout.
- **Tokens:** palette and fonts defined once as CSS variables in the Tailwind
  theme so palettes remain swappable.
- **Rendering:** all pages static. The only server code is the enquiry-form
  server action stub. Deployable on Vercel or any Node host; static export
  possible if the form later goes to a client-side service.
- **Content as data:** `data/locations.json`, `data/testimonials.json`,
  `data/visits.json`, `data/milestones.ts` (journey timeline),
  `data/faqs.ts`. Editing content never requires touching components.
- **Components (indicative):** `Nav`, `Footer`, `WhatsAppFab`, `Reveal`,
  `CountUp`, `StatsBand`, `ComparisonCards`, `ConsultantProfile`,
  `LocationsMap` (client-only), `LocationList`, `Steps`, `TestimonialCard`,
  `VisitDates`, `EnquiryForm`, `FaqAccordion`, `EvidenceChart`, `CtaBand`.
- **Accessibility:** semantic landmarks, skip link, alt text everywhere,
  focus-visible styles, AA contrast, keyboard operability including the map.
- **SEO:** per-page metadata, Open Graph, `Physician` / `MedicalClinic`
  JSON-LD structured data, sitemap.
- **Existing files:** the three current HTML pages remain in the repo as
  content reference during the build and are deleted once ported.

## 10. Assets and placeholders

| Asset | Status |
|---|---|
| Logo recoloured to palette (3 variants) | To produce via Higgsfield MCP from existing JPEG |
| Portrait of Prof Gupta | Placeholder frame; client supplies |
| Journey milestone photos | Placeholder frames; client supplies |
| Location images for map popups | Placeholder; client supplies |
| Real locations list | Placeholder JSON; client supplies |
| Visit dates | Placeholder `[Month] 2026`; client supplies |
| Evidence citations | Marked `[CITATION - verify]`; client verifies before launch |
| Contact details (phone, WhatsApp, email, address) | Placeholder; client supplies |

## 11. Out of scope

- Real booking/calendar integration (form is stubbed).
- CMS integration.
- Blog / ongoing content publishing.
- Hindi/Marathi translations (copy notes languages spoken, but the site is
  English-only for now).
- Analytics wiring (structure allows adding later).

## 12. Success criteria

- A first-time visitor can answer, within one scroll of the homepage: who he
  is, why his experience matters, and how to book.
- The RFA/PFA comparison reads as fair and factual to a sceptical reader; no
  claim breaches the GMC/ASA guardrail.
- The map works with mouse, touch, and keyboard, and the site scores ≥95 on
  Lighthouse accessibility.
- All content updates (dates, locations, testimonials) are data-file edits.
