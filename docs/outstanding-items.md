# Outstanding items and placeholders

Audit date: 12 August 2026, last updated 3 September 2026. Supersedes the 25 July 2026 audit.

This is the single source of truth for what is and is not finished. If you are
an agent starting a task, read this before telling anybody something is missing,
and verify against the code rather than against an older revision of this file.

**How to check a claim here without getting it wrong.** Two traps have already
caught people:

- Milestone photos live at `photo: { src, width, height, alt }`. There is no
  `photoSrc` field. Grepping for one returns nothing and looks like "no photos".
- Every milestone has a `photoTitle` and `photoCaption` whether or not it has an
  image, because those are caption text. Counting `photoTitle` counts captions,
  not photographs.

When a grep returns zero, open the file before believing it.

## A. Blocking, and live right now

### A1. Canonical host (resolved 19 August 2026)

`data/site.ts` now sets `url: 'https://www.mumbai-london-af.clinic'`, which is
the registered live host. Sitemap, `robots.txt`, `metadataBase` and JSON-LD
`@id`s all derive from that. `next.config.ts` 301s `mlafc.vercel.app` to the
same host. This ships on the next push to `main`.

`mumbailondonaf.com` is still unregistered. Do not point `site.url` back at it.
Do not point `site.url` at `mlafc.vercel.app`.

### A2. reCAPTCHA is not configured in production

The live `/book` serves no reCAPTCHA script and no "protected by reCAPTCHA"
notice, so `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is unset in Vercel.
`lib/verifyRecaptcha.ts` returns `null` and skips verification entirely when
`RECAPTCHA_SECRET_KEY` is missing, so the form is very likely unprotected at
both ends.

The remaining defence is `lib/rateLimit.ts`, which its own docstring notes is
held in process memory, so on serverless each instance keeps separate counts and
the effective limit is per instance.

Fix: set both keys in Vercel, or accept the exposure deliberately and record
that decision here. Only the Vercel dashboard confirms the secret key.

### A3. The visit list does not expire

`data/visits.json` is rendered verbatim. `components/VisitDates.tsx` applies no
date filter, `components/EnquiryForm.tsx` lists every entry in the month
dropdown, and `components/FloatingBookingPill.tsx` advertises the first entry
with `status: 'open'`.

As of this audit the file still offers **August 2026**, which is now in
progress, and the pill advertises 27 September to 4 October 2026. Nothing drops
off by itself, so a past visit stays bookable until somebody edits the file.

Fix: either keep editing the file by hand each time a visit passes, or add
date-based filtering so past visits fall away. This is the item most likely to
embarrass the clinic quietly.

## B. Visible gaps, not blocking

### B1. Press articles with no link

Unchanged on 2 September 2026. The same three `press` entries in
`data/links.json` still have an empty `url`, so their cards on `/testimonials`
render without a "Read article" link:

- The Indian Express, 27 March 2025, "Global heart rhythm expert conducts free training at PGIMER"
- The Pioneer, March 2025, "UK Heart Rhythm Expert Begins India Tour from Chd"
- Punjab Kesari, March 2025, "Global heart expert to give free treatment, train doctors across India"

The August 2026 coverage added since then is not affected: The Indian Express,
Sakal and ANI all carry URLs, as do the seven syndicated outlets under the ANI
entry. All 11 entries under `profiles` and all 41 in `data/publications.json`
have URLs.

### B2. No Open Graph images anywhere

No `opengraph-image` or `twitter-image` file exists under `app/`; the only assets
are the favicon files (`app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`).
Only `/` sets `openGraph` in its metadata, and only `/` and
`/team` set `alternates` for a canonical. No route sets `twitter`. All 8 routes
do export a `metadata` block with title and description.

This costs most on WhatsApp shares, which is now the channel the site pushes
hardest.

### B3. Map locations left linkless on purpose

17 of the 83 entries in `data/locations.json` have no `url`. This is deliberate
and was decided on 25 July 2026: they are one-off meetings with no surviving
site, multi-meeting city entries that cannot resolve to a single URL, or private
lecture tours. A location with no `url` renders no link, which is the intended
end state, not a bug. The full list is in git history for this file at the
25 July revision.

### B4. Three August 2026 photographs are not matched to a city

Added 2 September 2026. `indiaAugust2026Photos` in `data/trips.ts` holds eight
photographs. Five carry a `cityId` and pin themselves to a stop on the route
map. Three do not:

- `live-case-2026`, "A live case"
- `cath-lab-team-2026`, "The cath lab team"
- `first-pfa-case-cake-2026`, "A hospital's first"

A photograph with no `cityId` is not a bug and nothing breaks: it simply shows
in the visit carousel and nowhere else. To place one, set `cityId` to one of
`mumbai`, `kolkata`, `hyderabad`, `chennai`, `trichy` or `bengaluru`. Only
somebody who was there can say which, so leave it unset rather than guess.

In the same file, the number of cases done on the visit is not published
anywhere on the site. If the clinic wants it shown, add it to `stats` in
`data/trips.ts` alongside days, cities, hospitals and the first for India.

### B5. The COCONUT paper's DOI is not live yet

Added 3 September 2026. `pub24` in `data/publications.json` is the COCONUT
study (Europace 2026, DOI `10.1093/europace/euag198`), on which Professor Gupta
is a co-author. The DOI is pre-registered with Crossref and shows "manuscript
has been accepted", but Oxford University Press has not published the article
page, so the "Read the paper" link on `/conditions` and `/evidence` lands on
Crossref's holding page for now. Nothing to change: the DOI redirects to the
article automatically once it is online. Re-check it in a few weeks and delete
this item when it resolves.

## C. Dead code

Confirmed 12 August 2026 by resolving every component name against `app/`,
`components/` and `test/`.

Never referenced by a page or a test:

- `components/PublicationsGrid.tsx`
- `components/PublicationsList.tsx`
- `components/TestimonialsGrid.tsx`
- `components/home/AwardsTimeline.tsx`
- `components/home/VerifyIndependentlyStrip.tsx`

Referenced only by tests, mounted on no page:

- `components/FaqAccordion.tsx`. `/evidence` uses `FaqConversation` instead.
- `components/LocationList.tsx`
- `components/home/ComparisonCards.tsx`

Also dead in the data: `Location.images` is typed `string[]` in `data/types.ts`
and is empty on all 83 entries, and nothing reads it. `Location.readMore` is
read by `components/map/LocationsMap.tsx` and is set on 1 of 83.

Every profile in `data/links.json` has `featured: false`, so
`VerifyIndependentlyStrip` would render an empty strip even if it were mounted.

`pendingCertifications` in `data/certifications.ts` is exported and deliberately
not rendered. It holds three awards conferred by letter rather than certificate
(Commonwealth Fellowship, National Clinical Excellence Award Bronze, Honorary
Professor of Cardiology) which stay off the wall until a letter is scanned. That
is intended behaviour, not an oversight.

## D. Checked and correct, do not re-audit

Recorded here because each of these has been wrongly reported as missing before.

- **The journey is fully illustrated.** All 11 milestones in `data/milestones.ts`
  carry media: 8 have a `photo`, the 2006 LHCH milestone has a `video`
  (`/videos/lhch-overview.mp4` with a poster), and the 2019 professorship and
  2022 Indo-UK milestones have `gallery` carousels. Across `milestones.ts` and
  `gallery.ts` there are 34 referenced asset paths and none are missing from
  `public/`. The live `/journey` serves 22 distinct journey images plus the
  video. `MilestonePlaceholder` is only the fallback for a milestone with
  neither video nor photo, and `JourneyTimeline.tsx` excludes the `awards-band`
  variant from the photo column, so in practice it does not render.
- **Contact details are live and complete.** One number, `+91 81695 23196`,
  answers both the phone and WhatsApp. See section E.
- **The enquiry form sends.** `app/book/actions.ts` sends through
  `lib/sendEnquiryEmail.ts` over SMTP. `SMTP_USER` and `SMTP_PASS` are set in
  Vercel and delivery was confirmed on the live site. They are deliberately
  absent from `.env.local`, so a local dev server cannot send and the form shows
  its "could not send" error when tested locally. That is expected, not a bug.
  Note this is a recorded confirmation, not something re-verified in this audit:
  re-testing means sending a real enquiry to the clinic inbox.
- **Map location links.** Resolved 25 July 2026. 22 URLs were added and the
  dashed "hospital link needed" badge was removed. See B3 for the deliberate
  remainder.
- All 41 entries in `data/publications.json` have URLs, and every one carries
  a `plainTitle` for the "Related publications" gallery that sits folded under
  each guide on `/conditions`, ordered so the most reassuring papers lead. Eighteen papers were added on 3 September 2026
  from a PubMed sweep of his work on atrial flutter, SVT, palpitations,
  syncope, pacing and LAAO, so that every condition has papers to show.
- The interview video URL is set, so the homepage video block shows no flag.
- `data/testimonials.json` holds 32 entries, all letters and quotes that need no
  links. The two patient letters added on 3 September 2026 (Rudresh Tendulkar,
  treated in Pune; Jagdip Shah and family) carry no date because the letters
  themselves give none.
- `data/links.json` `press` holds 9 entries, 4 of them `featured`. Three of the
  nine carry no `url`; see B1.
- `galleryPhotos` in `data/gallery.ts` now leads with the 8 visit photographs
  spread from `latestTrip.photos` in `data/trips.ts`, so the album and the
  home page visit section cannot drift apart. That makes 19 photographs in the
  home carousel and 33 distinct photographs across the `galleryPhotos`,
  `academicPhotos` and `proctoringPhotos` lists.
- No empty fields in `data/certifications.ts`, `data/gallery.ts` or
  `data/milestones.ts`. Current counts: 8 conditions, 2 team members, 6 FAQs,
  16 certifications, 11 milestones, 83 map locations.

## E. Resolved on 12 August 2026

### Clinic phone number

`data/site.ts` carries the live clinic line, `+91 81695 23196`, with
`phoneHref: 'tel:+918169523196'` for dialling. The `[placeholder]` guards that
used to hide it in the footer, on the book page and in the JSON-LD `telephone`
field are gone, because there is nothing left to hide.

### WhatsApp

Removed on 25 July 2026 in commit `f4a5f4e`, restored on 12 August 2026 in
commit `ad5546d` against the same clinic line, so a patient only ever learns one
number.

Where it appears:

- `components/WhatsAppFab.tsx`, the floating brass button, mounted sitewide in
  `app/layout.tsx`. `FloatingBookingPill` is offset to `bottom-[5.5rem]` so the
  two stack rather than overlap, and the footer padding clears both.
- Footer contact block, book page contact card, homepage call to action band,
  the mobile menu, and the enquiry form confirmation.
- `data/enquiry-options.ts` offers WhatsApp as a contact preference again, so it
  reaches the clinic inbox through `lib/sendEnquiryEmail.ts`.
- The rate limit, send failure and reCAPTCHA fallback messages name WhatsApp as
  the urgent channel.

`lib/contact.ts` builds every `wa.me` link and prefills the opening line, so the
encoding lives in one place. JSON-LD publishes a real `telephone` plus a
`contactPoint` carrying the WhatsApp link.

## F. SEO and content backlog

Nothing here is a placeholder on the live site. Detail in `docs/seo-audit.md`.

Extended JSON-LD (WebSite, Organization, MedicalWebPage, BreadcrumbList),
per-page canonical and OG tags, PFA vs RFA as a real table, `ComparisonCards`
mounted on the homepage, definition blocks per condition, an `/about` page, a
cost page, and an expanded FAQ.
