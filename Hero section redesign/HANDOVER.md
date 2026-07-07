# Mumbai London AF Clinic: Design Handover

Designs in this project (open in browser, all self-contained):

- **Homepage v2.dc.html**: the current homepage direction (use this, not Homepage.dc.html which is the first pass; Hero.dc.html is the standalone hero exploration).
- **Conditions.dc.html**: all 6 conditions with animated normal-vs-abnormal ECG comparisons (ported from `lib/ecg/paths.ts`).
- **Voices.dc.html**: testimonials page: full LHCH letter, hospital/academic reference cards, patient quotes, peer quotes, press coverage. Replaces the repo's testimonials page.
- **Book.dc.html**: enquiry form (prototype: submit shows a confirmation state), direct-contact card (placeholders), "what happens next" steps, visit dates. Replaces `app/book`.
- **Journey.dc.html**: the 1988–2026 timeline page.
- **Evidence.dc.html**: the evidence/FAQ page, now also carrying the **Selected publications** section (`#publications`, all 9 from `data/publications.json`). There is intentionally NO standalone publications page; homepage "Read paper" links point at `Evidence.dc.html#publications`.
- **locations.json**: the map data (see below). Each entry now also carries a `url` field (the hospital's website).
- **links.json**: single source of truth for ALL outbound links: profile/register backlinks, press articles, and the interview video (see "Links, flags and placeholders" below).
- **VerifyRow.dc.html**: shared footer component ("Verify his record") rendered at the bottom of every page. Reads `links.json` → `profiles`.
- **image-slot.js**: photo drop-slot component used on the Journey page (design-tool only; in the real site use plain `<Image>`).

Brand tokens used throughout (match `app/globals.css`): night `#0C1F2B`, ink `#122B3A`, ink-soft `#3A5468`, paper `#F7F5F1`, paper-soft `#EFEBE3`, line `#D9D3C7`, brass `#B08D3E`, brass-bright `#D8B15A`, brass-deep `#6E5826`, night-line `#2A4254`. Fonts: Newsreader (serif) + Archivo (sans).

## Content corrections applied everywhere
- Ablation count is **10,000+** (was 5,000+). Also update `data/milestones.ts`, `app/evidence/page.tsx`, and the dot-wall caption in your repo: they still say 5,000+.
- **No em dashes** anywhere in copy. Keep this rule when editing. (Several testimonial quotes from `data/testimonials.json` had " - " dashes; they were rewritten with commas on the Voices page.)

## Links, flags and placeholders (NEW: implement this)
All outbound links live in **links.json**; hospital website links live per-entry in **locations.json** (`url` field). Wherever a `url` is an empty string, the UI renders a dashed monospace flag (e.g. "link needed · links.json") instead of a link; paste the real URL and the flag disappears automatically. Keep this exact behavior in the Next.js build: it lets content be filled in without touching components.

`links.json` structure:
- `profiles[]`: `{label, sublabel, featured, url}`. Rendered as the **"Verify his record" pill row** in every page footer (see `VerifyRow.dc.html`: set pill = solid border + brass ↗; missing pill = dashed border + "add link" badge). Entries with `featured: true` (keep 3–4) ALSO render in the one-line **"Verify independently" strip** under the homepage testimonials.
- `interview`: `{title, duration, url}`. Drives the **video card in homepage "02 · Meet your consultant"**: night card, brass play button, opens `url` in a new tab; while `url` is empty it shows a "video link needed" flag. Expected: paste a YouTube/Vimeo link (a lightbox/embed is a fine upgrade in production).
- `press[]`: `{outlet, date, headline, note, credit, featured, url}`. Drives the **Voices press section**: `featured: true` renders as the large cards (with "Read article ↗" or a flag), the rest render in the compact **"More coverage" list** below (outlet · headline · date · link). The three "Add outlet name" rows are intentional placeholders for the client's backlink list; add as many rows as needed.

Also NEW on the homepage profile section: the interview video card (see `interview` above).

NEW on the map detail card: a **"Visit hospital site ↗"** link when the active location's `url` is set, otherwise a "hospital link needed" flag.

## Sitewide nav (all pages)
Home · Conditions · The Evidence · The Journey · Voices · [Book a consultation → Book.dc.html]. All "Book" CTAs and floating pills now point to Book.dc.html (homepage keeps its in-page #cta).

## Conditions page
- One section per condition (ids: af, atrial-flutter, svt, palpitations, blackouts-dizziness, bradycardia), alternating text/figure sides, figure sticky at top:96px.
- ECG comparison animation per condition: normal strip draws (slate), hold, abnormal strip draws (brass) with glowing dot, hold, loop (~8.8s, tweakable prop `ecgLoopSeconds`). Path builders are the repo's `lib/ecg/paths.ts` ported verbatim; runs only in view via IntersectionObserver; `prefers-reduced-motion` renders both strips complete and static.
- Symptom entries (palpitations, blackouts) are labelled "Symptom guide" instead of "Condition".

## Voices page
- Lead artifact: the LHCH letter rendered as a full letter (letterhead, body, signature rule), then 5 hospital/academic quote cards, 8 patient cards, 6 peer quotes (bordered list). Press section (toggleable via the `showPress` prop) is now fully data-driven from `links.json` → `press`: featured cards + compact "More coverage" list, each with an outbound link or a "link needed" flag.

## Book page
- Enquiry form is a prototype: submit swaps to a confirmation card (no backend). Phone/email/WhatsApp are placeholders from `data/site.ts`. Visits from `data/visits.json` (placeholder months).

## Homepage v2: what's new vs the repo
1. Hero: full-bleed ECG monitor behind text/portrait: faint grid + faint trace + a glowing brass sweep segment looping left→right (5.6s), radial vignette for legibility. Dotted London→Mumbai arc removed.
2. "01 · The one constant": AF→operator→steady-rhythm trace that draws on scroll and **loops** (draw ~4.6s, hold 1.8s, redraw). Brass node labelled THE OPERATOR.
3. Dot wall: 10,000 dots (250×40 canvas) filling in on scroll above the stats; stats count up.
4. Numbered chapter eyebrows 01–09 with pulsing brass dot.
5. Operator card (night card in comparison grid) has a slow brass glow (`op-glow` keyframes).
6. Floating "Next Mumbai visit: March 2026 · Booking open" pill after 560px scroll.
7. Hospital letter promoted to full-width serif pull-quote in testimonials.
8. Micro-interactions: card hover-lift, arrow-link letter-spacing nudge, nav shadow on scroll, scroll progress bar, reveal-on-scroll with stagger (all respect `prefers-reduced-motion`).

## Journey page
- Brass lifeline down the left that draws with scroll; blip dots light with a halo as each milestone passes.
- Each milestone opens with a brass serif year "chapter mark" (2.6rem) + small-caps tag (no ghost background numerals).
- Photo slots per milestone (drag photos in while in the design tool; in production use real images).
- 2017+2022 merged into one "Bronze, then Silver" band.
- 2026 finale is a rounded night card inside the page flow, ECG strip along its bottom edge (below the CTA: never behind text).
- Page header (and Evidence header) carry the quiet ECG strip along the bottom edge as the house motif for page tops.

## Evidence page
- 768px reading column; animated volume bar chart (bars scaleY + % count up on scroll: 2.1% vs 0.9%, annotated "under 50 / 300+ ablations a year").
- Stats strip (300+/yr, <1%, 10,000+) with count-up.
- FAQ rendered as a conversation (serif italic quoted questions, plain answers, no accordion).
- Floating book pill + night CTA card + references with anchor links.

## THE MAP (Homepage v2, section "07 · Where he works")

Replaces `components/map/*` entirely. It is a **vector night atlas**: Leaflet with NO tile layer, world country outlines from Natural Earth (public domain, no attribution required), all user interaction disabled (no panning/zooming): region tabs and city chips drive the camera.

Dependencies (in `<head>` or npm):
- leaflet@1.9.4 (JS + CSS)
- topojson-client@3.1.0
- country shapes fetched at runtime: `https://unpkg.com/world-atlas@2.0.2/countries-110m.json` (110KB TopoJSON). For production, download this file once and serve it locally.

Behavior spec:
- Init: `L.map(el, { all interactions false, zoomSnap: 0.25, maxZoom: 7, minZoom: 1.5 })`, `setView([32,10],1.8)`, then render countries GeoJSON (muted: fill #122B3A/.55, stroke #2A4254/.6) and circleMarkers per location, then `fitBounds` of all pins, padding 56.
- Region tab click → camera `flyToBounds` of the **mainland outline** of that region's countries (for MultiPolygon countries use only the largest ring by shoelace area, so Alaska/Hawaii/French Guiana don't blow up the frame), padding 20, maxZoom 6.5. Selected countries restyle to fill #1B3949/.85 + thin brass outline (#B08D3E, weight 1.2); rest of world dims. Out-of-region pins fade to 18%.
- Permanent city labels: bind tooltips (`permanent: true`) for in-region pins **only after `moveend`**: binding permanent tooltips mid-flight crashes Leaflet.
- City chip / pin click → flyTo the city (zoom ≥ 5), label after moveend, detail card updates (institution, role badge, years, blurb).
- Pins: circleMarkers radius 4 (6 active): operated = solid brass; taught = brass ring, dark fill; proctored = slate ring. Legend matches.
- Tooltip style: 11px Archivo, rgba(12,31,43,.85) bg, 1px #2A4254 border, no arrow.
- Layout: `grid-template-columns: repeat(auto-fit, minmax(320px,1fr))` (stacks on mobile); map `min-height: clamp(320px, 48vh, 460px)`.
- Gotcha found in testing: never mix two loaded copies of Leaflet: bounds built with one copy fail `instanceof` checks in the other and the camera silently refuses to move. Keep exactly one Leaflet import.

### ➜ HOW TO ADD A CITY (the important bit)
All map content derives from **locations.json**. To add a city:

1. Copy any entry and edit:
```json
{
  "id": "delhi",                      // unique slug
  "name": "Fortis Escorts Heart Institute, Delhi",  // detail card title
  "city": "Delhi",                    // pin label + chip text
  "country": "India",                 // detail card
  "region": "India",                  // which tab it appears under
  "lat": 28.5586, "lng": 77.2735,     // Google Maps: right-click the
                                      // hospital -> click coords to copy
  "role": "operated",                 // operated | taught | proctored
  "years": "2027 - present",
  "blurb": "One sentence for the detail card.",
  "url": ""                           // hospital website; "" shows a
                                      // 'hospital link needed' flag
}
```
2. `region` must be one of the tab names: "United Kingdom", "Europe", "United States", "India". To add a NEW tab (e.g. "Middle East"): add the name to the `regions` array in `renderVals()` AND map it to its country name(s) in `_regionCountries()` (names must match Natural Earth English naming: note "Czechia" and "United States of America").
3. If the city is in a country not previously highlighted, add that country's name to the region's list in `_regionCountries()` so its outline lights up.
4. Nothing else: pins, chips, labels, camera framing and the detail card all derive from the JSON.

The same instructions live as a comment at the top of the map logic in Homepage v2.dc.html (search "HOW TO ADD A CITY").

## Porting notes
- The DC files' markup is plain HTML with inline styles: lift directly into JSX (className-ify or keep style objects). The logic class methods map 1:1 to a `useEffect` + handlers in a client component.
- Reveal/count-up/lifeline/dot-wall all use IntersectionObserver + rAF and honor `prefers-reduced-motion`; reuse your existing `useReveal` where possible.
- ECG path geometry (hero trace, strips, AF→operator trace) is inline in the SVGs: copy the `d` attributes verbatim.
