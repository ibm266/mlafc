# Mumbai London AF Clinic: agent instructions

Read this file at the start of every task and verify compliance before marking work complete.

## Current state, as of 2 September 2026

Read this before telling anybody something is missing. Several of these have
been reported as gaps when they were already done.

- **Live at https://www.mumbai-london-af.clinic.** Pushing to `main` deploys
  automatically. `mlafc.vercel.app` 301s to the live host after that deploy.
- **`site.url` is `https://www.mumbai-london-af.clinic`.** That feeds
  `metadataBase`, the sitemap, `robots.txt` and JSON-LD. See
  `docs/outstanding-items.md` section A1 if the live HTML still canonicals
  elsewhere, which means the latest deploy has not shipped.
- **Contact details are live.** One number, `+91 81695 23196`, answers both the
  phone and WhatsApp. Nothing in `data/site.ts` is a `[placeholder]` any more,
  so do not add guards for one. `lib/contact.ts` builds every `wa.me` link.
- **The journey is fully illustrated.** All 11 milestones carry a `photo`, a
  `video` or a `gallery`. Do not report journey photos as outstanding.
- **The enquiry form sends** over SMTP, using credentials that live only in
  Vercel. A local dev server cannot send, and the form showing "could not send"
  locally is expected.
- **The home page leads with the latest visit.** Chapter 02 comes from
  `latestTrip` in `data/trips.ts`; the next visit is a data change, not a layout
  change. Chapters after it are numbered 03 to 10. The home card carries only the headline; the full case study (`TripFeatureCard`) lives on `/conditions#india-first`, mounted by `CaseStudySection` under the condition named in `feature.conditionId`.

`docs/outstanding-items.md` is the source of truth for what is genuinely
unfinished. Update it when you resolve something, and date what you change.

### Two traps that have produced wrong answers

- Milestone photos live at `photo: { src, width, height, alt }`. There is no
  `photoSrc` field, so grepping for one returns nothing and looks like an
  absence of photographs.
- Every milestone carries `photoTitle` and `photoCaption` whether or not it has
  an image, because those are caption text. Counting them counts captions.

More generally: when a grep returns zero, open the file before believing it.

## Copy style

**Never use em dashes (Unicode U+2014) anywhere in this project.**

- Not in user-facing copy (pages, components, `data/`, metadata, `public/`).
- Not in comments, docs, README files, or commit messages for this repo.
- Use a comma, full stop, colon, or parentheses instead.

Before finishing any task, search the files you touched for U+2014 and remove any you introduced. Run `npm test` (includes `test/copy-style.test.ts`).

## Tech stack

- Next.js (App Router), React, TypeScript, Tailwind CSS
- Content lives in `data/`; outbound links in `data/links.json`
- Build: `npm run build` · Test: `npm test` · Lint: `npm run lint`

## Conventions

- Match existing component and naming patterns in the file you are editing
- Minimize scope: only change what the task requires
- Do not commit unless the user asks
