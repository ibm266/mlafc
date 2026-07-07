# Mumbai London AF Clinic: Handover 2 (delta since last handover)

The previous HANDOVER.md (hero/map/journey/evidence era) is already implemented in this repo. This document covers ONLY what has changed since. Where this doc conflicts with the old one, this doc wins. Design sources of truth are the `.dc.html` files shipped alongside: open them in a browser and copy markup/geometry/copy verbatim.

## New/updated design files in this package
- **Conditions.dc.html**: NEW conditions page design. Replaces `app/conditions/page.tsx` layout.
- **Voices.dc.html**: NEW testimonials page design ("Voices"). Replaces `app/testimonials/page.tsx`.
- **Book.dc.html**: NEW booking page design. Replaces `app/book/page.tsx` layout (keep your server action).
- **Evidence.dc.html**: updated: now carries the **Selected publications** section (`#publications`).
- **Homepage v2.dc.html**: updated: interview video card, "Verify independently" strip, map detail-card hospital link.
- **VerifyRow.dc.html**: NEW shared footer block ("Verify his record").
- **links.json**: NEW single source of truth for all outbound links (profiles, press, interview video).
- **locations.json**: updated: each entry gains a `url` field (hospital website).
- **HANDOVER.md**: the full previous handover with these changes merged in, for reference.

## 1. Information architecture changes
- **Delete the standalone `/publications` page.** Publications move to `/evidence#publications` (all 9 from `data/publications.json`, layout in Evidence.dc.html). Update nav, footer, sitemap, and any "Read paper" links to point at `/evidence#publications`.
- **Delete the standalone `/locations` page.** The homepage map section ("07 · Where he works") is the only locations UI.
- **Rename Testimonials → Voices** (route can stay `/testimonials` or move to `/voices`; label everywhere is "Voices").
- **Nav becomes:** Home · Conditions · The Evidence · The Journey · Voices · [Book a consultation → /book as the CTA button]. Update `components/Nav.tsx` LINKS and `components/Footer.tsx` pageLinks accordingly.

## 2. links.json: outbound links, with "link needed" flags (implement exactly)
Copy `links.json` into `data/`. It holds three groups:
- `profiles[]`: `{label, sublabel, featured, url}`: GMC register, hospital profiles, Doctify, LinkedIn, ResearchGate, ORCID, etc.
- `interview`: `{title, duration, url}`: the consultant interview video.
- `press[]`: `{outlet, date, headline, note, credit, featured, url}`: news articles.

**Flag behavior (the important bit):** wherever a `url` is `""`, render a dashed monospace flag chip (e.g. `link needed · links.json`, style: 0.62rem ui-monospace, uppercase, letter-spacing 0.08em, dashed 1px `#6E5826`/`#B08D3E` border, radius 4, brass text) instead of the link. Paste a real URL → the link appears, flag disappears. No component edits ever needed to fill in content. See VerifyRow.dc.html and Voices.dc.html for the exact rendering in both night and paper contexts.

Where each group renders:
- `profiles` → **"Verify his record" pill row** at the bottom of EVERY page footer (new `VerifyRow` component inside `Footer.tsx`, above the legal strip; exact markup in VerifyRow.dc.html: pill = label + sublabel + brass ↗ when set; dashed border + "add link" badge when not).
- `profiles` with `featured: true` (keep 3–4) → also the one-line **"Verify independently" strip** under the homepage testimonials section (see Homepage v2.dc.html).
- `interview` → **video card in homepage "02 · Meet your consultant"**: night card, centered brass play button, "Watch · {duration}" eyebrow, serif title, opens `url` in a new tab; companion paper card titled "The interview" sits beside it (grid 1.15fr/0.85fr). While `url` is empty it shows a `video link needed · links.json > interview.url` flag. You may upgrade to an inline `YouTubeEmbed` once the link exists, but keep the card look as the poster state.
- `press` → Voices press section: `featured: true` render as the four large cards, each footer now carries **"Read article ↗"** (or the flag); non-featured entries render in a compact **"More coverage" list** below (outlet · headline · date · Read ↗ / flag), one bordered row each. The three "Add outlet name" rows are intentional placeholders for the client's backlink list: keep them until real articles are pasted in.

## 3. locations.json `url` field
Merge the new `url` field into `data/locations.json` (keep your existing entries; just add `"url": ""` to each). The homepage map **detail card** gains, under the blurb: "Visit hospital site ↗" (opens in new tab) when `url` is set, else a `hospital link needed · locations.json` flag.

## 4. Conditions page (Conditions.dc.html)
- One section per condition, ids: `af`, `atrial-flutter`, `svt`, `palpitations`, `blackouts-dizziness`, `bradycardia`. Alternating text/figure sides; figure column `position: sticky; top: 96px`.
- Per-condition ECG comparison animation: normal strip draws (slate), hold, abnormal strip draws (brass, glowing dot), hold, loop ~8.8s. Uses your `lib/ecg/paths.ts` builders verbatim; run only in view (IntersectionObserver); `prefers-reduced-motion` → both strips static and complete.
- Palpitations + blackouts sections are labelled "Symptom guide", not "Condition".

## 5. Voices page (Voices.dc.html)
- Lead artifact: the LHCH letter rendered as a full letter (letterhead, body, signature rule): full width, before everything else.
- Then: 5 hospital/academic reference cards, 8 patient quote cards, 6 peer quotes as a bordered list, then the press section (see §2).
- Testimonial copy: em/spaced dashes in `data/testimonials.json` were rewritten with commas. No em dashes anywhere.

## 6. Book page (Book.dc.html)
- Enquiry form layout + confirmation state (submit swaps the form for a confirmation card: wire to your existing server action in `app/book/actions.ts`).
- Direct-contact card (phone/email/WhatsApp from `data/site.ts`, placeholders intact), "What happens next" 3-step block, visit dates from `data/visits.json`.

## 7. Homepage updates (Homepage v2.dc.html)
- "02 · Meet your consultant": interview video card + companion card (see §2) inserted before the "Follow the journey" link. (A photo gallery was designed here and then REMOVED: do not add one.)
- Under testimonials: "Verify independently" strip (see §2).
- Map detail card: hospital link / flag (see §3).
- All Book CTAs and the floating pill point to `/book`.

## 8. Content corrections (recheck)
- Ablation count is **10,000+** everywhere (`data/milestones.ts`, `app/evidence/page.tsx`, dot-wall caption).
- No em dashes in any copy, sitewide.

## Porting notes (unchanged)
DC markup is plain HTML with inline styles: lift into JSX directly. Logic classes map to `useEffect` + handlers in client components. All animation honors `prefers-reduced-motion`. Copy SVG `d` attributes verbatim.
