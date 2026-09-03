# Content data

Everything a client will ever edit lives here.

Nothing in this folder is a `[placeholder]` any more, and the site is live. If
you add a stub, mark it `[placeholder]` and record it in
`docs/outstanding-items.md`; several guards used to hide such values on the
front end and have since been removed as dead code.

## Current state, 3 September 2026

**Live and confirmed**

- `site.ts`: `url` is `https://www.mumbai-london-af.clinic`. Every contact field.
  One number, `+91 81695 23196`, answers both
  the phone and WhatsApp. `phoneHref` and `whatsappHref` need the digits alone,
  with no plus sign and no spaces (`tel:+918169523196`,
  `https://wa.me/918169523196`). `lib/contact.ts` builds the `wa.me` links and
  prefills the opening message.
- `visits.json`: four real 2026 visits. **These do not expire.** Nothing filters
  by date, so a visit that has passed stays on the site and stays selectable in
  the enquiry form until somebody edits this file.
- `milestones.ts` and `gallery.ts`: all 11 milestones carry a `photo`, a `video`
  or a `gallery`, and all 34 referenced assets exist under `public/`. Photos
  live at `photo: { src, width, height, alt }`; there is no `photoSrc` field.
  Every milestone has a `photoTitle` whether or not it has an image, because
  that is caption text, so counting titles does not count photographs.
- `trips.ts`: visits, newest first. `latestTrip` is `trips[0]`; it drives the
  latest-visit section on the home page and its photographs lead
  `galleryPhotos` in `gallery.ts`, so the album and that section cannot drift
  apart. A photograph carries an optional `cityId` matching a `TripCity.id`;
  without one it shows in the carousel but pins to no stop on the route map.
  A visit's `feature` is its headline case: the home card shows `title`, `summary` and a link to `href`, and the full story is mounted on /conditions under `conditionId`. The next visit is a data change here, not a layout change. Photographs are
  web derivatives (1600px long edge, WebP) built from the untracked originals
  in "Website Photos/" with
  `node scripts/build-photo-derivatives.mjs <outDir> "<original>=<slug>"`.
- `publications.json` (41 entries) and the `profiles` in `links.json` (11): all
  have URLs. Every publication carries a `plainTitle`, the paper's subject in a
  patient's words, and that is what the "Related publications" card gallery
  under each guide on `/conditions` leads with; `title` stays the title as
  published. `conditions.ts` chooses the papers for each guide through
  `publicationIds`, in display order, with the papers most likely to reassure
  a patient reading that guide first, and names the subject with
  `publicationTopic`. The COCONUT study (`pub24`)
  has a pre-registered DOI that lands on Crossref's "manuscript accepted"
  page until Oxford University Press publishes the article; leave the link as
  it is, it will redirect on its own. A `press` entry can also carry `language` (when the piece is not
  in English, e.g. Marathi), `story` (an id shared by every report of one
  event, matching `TripFeature.storyId` in `trips.ts`) and `syndicated` (the
  other outlets that ran the same wire copy, each with its own `outlet` and
  `url`).
- `certifications.ts`: 16 entries. `pendingCertifications` is exported and
  deliberately not rendered; those three awards come by letter rather than
  certificate and stay off the wall until a letter is scanned.

**Outstanding**

- `links.json`: 3 of 9 `press` entries have no `url`, so those cards render
  without a "Read article" link.
- `locations.json`: 83 entries, realistic but unverified. 17 deliberately carry
  no `url` because no single official page exists. The `images` field is typed
  on every entry, empty on all 83, and read by nothing; `readMore` is read by
  `components/map/LocationsMap.tsx` and set on 1 entry.

Full detail and the blocking items live in `docs/outstanding-items.md`.
