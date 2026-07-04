# Cursor prompt: Mumbai London AF Clinic homepage

Paste everything below the line into Cursor. It works as both a brainstorm prompt and a build brief. If you only want ideas first, add "Start by proposing 3 different creative directions before writing any code" at the end.

---

You are a senior front-end engineer and art director building a homepage for a specialist medical clinic. I have three existing pages in this repo (a current homepage, journey.html, testimonials.html) for reference on content and structure, but you are NOT bound to their colours or fonts. Treat visual design as open: propose your own palette, type pairing, and overall art direction as part of your creative directions.

## Design brief (open, but with a target feeling)
- Explore freely: colour scheme, typography, texture, and layout style are all yours to propose. Give each creative direction its own distinct palette and type pairing with rationale.
- The feeling to hit: trustworthy, calm, premium, human. A world-class consultant, not a hospital brochure and not a startup landing page. The clinic bridges Liverpool and Mumbai; a subtle nod to both cultures is welcome but optional.
- Hard avoids: generic corporate medical blue-and-white, clip-art or stock-photo vibes, anything templated, and anything so trendy it undermines seriousness. Whatever palette you pick must pass WCAG AA contrast.
- Build everything with CSS variables / design tokens so I can swap palettes easily while testing combinations.

## Who this is for
Professor Dhiraj Gupta, a consultant cardiologist and electrophysiologist at Liverpool Heart and Chest Hospital, now also seeing patients in Mumbai. He treats atrial fibrillation (AF) and other heart rhythm disorders. He has performed over 5,000 ablations, has a complication rate at or below 1%, and offers both radiofrequency ablation (RFA) and pulsed field ablation (PFA).

## The core message (this is the whole strategy, get it right)
Patients are now being offered PFA because it is newer, widely available, and slightly cheaper. The honest, evidence-based truth is that in the largest 2025 head-to-head trials, PFA and RFA were broadly comparable, neither clearly superior. The factor that actually changes a patient's outcome is operator experience and volume, not the machine. High-volume operators have far lower complication rates than low-volume ones.

So the site must persuade patients that the right question is "who is holding the catheter," not "which technology." It should present RFA and PFA fairly and factually, and position Prof Gupta's experience and his ability to choose the right tool per patient as the real advantage.

Critical guardrail: this is a real doctor advertising under UK GMC and ASA rules. Do NOT write that RFA is better, safest, or most effective than PFA. Keep all comparisons factual and non-superlative. No unsupported superiority claims.

## Homepage sections to build (in order)
1. Sticky nav, links: Compare, About, Where he works, How it works, Testimonials, plus a dark "Book a consultation" button.
2. Hero: large headline with an accent word treatment of your choosing, a lead paragraph that plants "the hands matter more than the technology," two CTAs, and a pull-quote aside from Prof Gupta.
3. Stats band: 5,000+ ablations, <1% complication rate, 18+ years as consultant, 350+ publications.
4. Comparison section "Two technologies. One question that matters more than both." Three cards: RFA, PFA, and a highlighted third card on operator experience. Fair to both technologies, honest that they are comparable, operator experience as the real differentiator.
5. Meet the consultant profile block with portrait and credentials.
6. Interactive map (spec below).
7. How it works: three steps (consultation, procedure in Mumbai, local follow-up).
8. Conditions and treatments: two columns.
9. Testimonials teaser: three cards linking to testimonials.html.
10. Upcoming Mumbai visits with booking status.
11. Footer with GMC registration line and a one-line medical disclaimer.

## Interactive map
Build with Leaflet.js and a light, muted tile theme (CartoDB Positron or similar) that harmonises with whatever palette you propose. Custom SVG pin markers in the accent colour of the chosen direction. Drive everything from one JSON file at /data/locations.json with fields: id, name, country, lat, lng, role (operated / taught / proctored), years, blurb, images array, readMore link. Colour pins by role and show a small three-item legend. Cluster overlapping UK pins. On hover (desktop) or tap (mobile) show a card popup with the location name in the heading font, a role chip in the accent colour, years, blurb, 1 to 2 lazy-loaded images, and a Read more link. Add two buttons above the map, UK and India, that fly the map to each region and fit bounds. Include a plain text location list below the map as an accessible fallback. In Next.js, dynamic import the map with ssr false since Leaflet needs window.

## Animations (make it feel premium, not flashy)
- Scroll-reveal: sections and cards fade and rise in gently on scroll using IntersectionObserver, staggered by 60 to 100ms. Respect prefers-reduced-motion and disable all motion if set.
- Hero: headline words or lines rise in on load with a soft ease, logo mark fades in first.
- Stat numbers: count up from 0 to their value when the stats band scrolls into view.
- Nav: subtle shrink or shadow on scroll past the hero.
- Buttons and cards: smooth colour and slight lift transitions on hover.
- Map pins: gentle drop-in on load, small scale pulse on the active pin.
- Keep easing soft and durations 400 to 700ms. No bouncing, no parallax overload, nothing that undercuts a serious medical brand.

## Tech and output
- If this is plain HTML, produce a single self-contained homepage file with the map and animation scripts included and deferred.
- If this is Next.js, use components and Tailwind, with the palette and fonts defined once as tokens.
- Clean, commented, accessible (keyboard focusable pins and buttons, alt text, semantic landmarks).
- Placeholder content is fine where I have not given real copy, clearly marked.

First, propose 3 distinct creative directions. For each: a name, palette (with hex values), type pairing, the hero and comparison section concept, and the animation feel. Then wait for me to pick or mix before building the full page.
