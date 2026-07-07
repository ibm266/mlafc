# Mumbai London AF Clinic: Design Handover

Designs in this project (open in browser, all self-contained):

- **Homepage v2.dc.html**: the current homepage direction (use this, not Homepage.dc.html which is the first pass; Hero.dc.html is the standalone hero exploration).
- **Journey.dc.html**: the 1988–2026 timeline page.
- **Evidence.dc.html**: the evidence/FAQ page.
- **locations.json**: the map data (see below).
- **image-slot.js**: photo drop-slot component used on the Journey page (design-tool only; in the real site use plain `<Image>`).

Brand tokens used throughout (match `app/globals.css`): night `#0C1F2B`, ink `#122B3A`, ink-soft `#3A5468`, paper `#F7F5F1`, paper-soft `#EFEBE3`, line `#D9D3C7`, brass `#B08D3E`, brass-bright `#D8B15A`, brass-deep `#6E5826`, night-line `#2A4254`. Fonts: Newsreader (serif) + Archivo (sans).

## Content corrections applied everywhere
- Ablation count is **10,000+** (was 5,000+). Also update `data/milestones.ts`, `app/evidence/page.tsx`, and the dot-wall caption in your repo: they still say 5,000+.
- **No em dashes** anywhere in copy. Keep this rule when editing.

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
  "blurb": "One sentence for the detail card."
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
