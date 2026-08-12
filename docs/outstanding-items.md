# Outstanding items and placeholders

Audit date: 25 July 2026, revised 12 August 2026. Covers everything on the site
that is still empty, a placeholder, or wired but unverified. Grouped by what a
visitor can see today.

## A. Visible to visitors right now

### A1. Map location links: DONE

Previously 39 of the 83 entries in `data/locations.json` had no `url`, and
`components/map/LocationsMap.tsx` showed a dashed `hospital link needed ·
locations.json` badge for each one in production.

Resolved on 25 July 2026:

- 22 URLs added, listed below for the record.
- The badge is gone. A location with no `url` now renders no link at all.
- The link label changed from `Hospital ↗` to `Visit website ↗`, because most of
  these pins are societies and congresses rather than hospitals.

17 entries remain deliberately linkless, listed at the end of this section.

**Hospital (added)**

| id | Entry | URL |
|----|-------|-----|
| `wadia-pune` | N. M. Wadia Institute of Cardiology, Pune | https://www.nmwcardiology.org/ |

The cardiac super-speciality hospital at 32 Sassoon Road, Pune. The entry was
renamed from "Wadia Hospital" to the hospital's own name so it is not confused
with Bai Jerbai Wadia Hospital for Children in Mumbai.

**Societies and congresses (added)**

| id | Entry | URL |
|----|-------|-----|
| `ihrs-new-delhi` | Indian Heart Rhythm Society Annual Meeting | https://ihrs.in/ |
| `ihrs-vizag` | Indian Heart Rhythm Society Annual Sessions | https://ihrs.in/ |
| `lectures-manchester` | British Association of Cardiac Prevention and Rehabilitation | https://www.bacpr.org/ |
| `lectures-birmingham-hrc` | Heart Rhythm Congress | https://www.heartrhythmcongress.org/ |
| `lectures-dublin` | Irish Cardiac Society | https://irishcardiacsociety.ie/ |
| `lectures-frankfurt` | Frankfurt Academy for Arrhythmias | https://fafa-symposium.de/ |
| `lectures-park-city` | Western AF symposium | https://www.hmpglobalevents.com/wafib |
| `lectures-boston` | Heart Rhythm Society | https://www.hrsonline.org/ |
| `lectures-san-francisco` | Heart Rhythm Society | https://www.hrsonline.org/ |
| `lectures-washington-dc` | American College of Cardiology | https://www.acc.org/ |
| `lectures-sydney` | Asia Pacific Heart Rhythm Society | https://www.aphrs.org/ |
| `lectures-osaka` | Japanese Heart Rhythm Society | https://new.jhrs.or.jp/en/ |
| `lectures-seoul` | Korean Heart Rhythm Society | https://k-hrs.org/eng |
| `lectures-munich` | European Society of Cardiology | https://www.escardio.org/ |
| `lectures-paris` | European Society of Cardiology | https://www.escardio.org/ |
| `lectures-lisbon` | European Heart Rhythm Association | https://www.escardio.org/communities/associations/ehra/ |
| `lectures-warsaw` | EHRA Advanced EP course | https://www.escardio.org/communities/associations/ehra/ |
| `lectures-malaga` | EHRA Advanced EP course | https://www.escardio.org/communities/associations/ehra/ |
| `lectures-vienna` | Scientific lectures, Vienna (EHRA) | https://www.escardio.org/communities/associations/ehra/ |
| `lectures-berlin` | Scientific lectures, Berlin (EHRA and AF Symposium) | https://www.escardio.org/communities/associations/ehra/ |
| `lectures-barcelona` | Scientific lectures, Barcelona (EHRA and ESC) | https://www.escardio.org/ |

**No single official page found (left linkless)**

These are either one-off meetings with no surviving site, multi-meeting city
entries that cannot resolve to one URL, or private lecture tours. Their panels
now show no link, which is the intended end state. If any of them later deserves
a link, splitting the multi-meeting entries is the first step.

| id | Entry | Note |
|----|-------|------|
| `lectures-venice` | Venice Arrhythmias Meeting | Now listed through Arrhythmia Academy event pages, no stable own domain |
| `lectures-lenzerheide` | New Swiss Horizons in EP | No current site found |
| `lectures-cape-town` | Cardiology at the Limits | No current site found |
| `lectures-dubrovnik` | CroRhythm Meeting | No current site found |
| `lectures-budapest` | Hungarian Arrhythmia Society | Hungarian-language society, needs a check for the right page |
| `lectures-tel-aviv` | Dead Sea EP and International Symposium | Two different meetings in one entry |
| `lectures-dead-sea` | Anglo-Israel Cardiovascular symposium | No current site found |
| `lectures-kansas-city` | Kansas City EP symposium | No current site found |
| `lectures-toronto` | Canadian AF summit | No current site found |
| `lectures-shanghai` | Asian Anticoagulation Academy | No current site found |
| `lectures-beijing` | Lecture tour, Beijing | Private tour, no host site |
| `lectures-shenyang` | Lecture tour, Shenyang | Private tour, no host site |
| `lectures-istanbul` | Scientific lectures, Istanbul | Two meetings in one entry (WSA congress, IEPI) |
| `lectures-london` | Scientific lectures, London | Three meetings in one entry |
| `lectures-copenhagen` | Scientific lectures, Copenhagen | Global LAAO summit plus AF Symposium meetings |
| `lectures-madrid` | Scientific lectures, Madrid | AF Symposium meetings plus New Horizons in AF |
| `lectures-prague` | Scientific lectures, Prague | AF Symposium, ESC Heart Failure, Prague Rhythm |

### A2. Clinic phone number: DONE

`data/site.ts` now carries the live clinic line, `+91 81695 23196`, with
`phoneHref: 'tel:+918169523196'` for dialling. It shows in the footer, on the
book page, in the homepage call to action band, in the mobile menu, and in the
JSON-LD `telephone` field. The placeholder guards that hid all of those are
gone.

### A3. Press articles with no link

Three entries in `data/links.json` have an empty `url`, so their cards on
`/testimonials` render without a "Read article" link:

- The Indian Express, 27 March 2025, "Global heart rhythm expert conducts free training at PGIMER"
- The Pioneer, March 2025, "UK Heart Rhythm Expert Begins India Tour from Chd"
- Punjab Kesari, March 2025, "Global heart expert to give free treatment, train doctors across India"

### A4. WhatsApp: DONE

Taken off the site on 25 July 2026 in commit f4a5f4e, and put back on 12 August
2026 against the clinic line, `+91 81695 23196`. The same number answers calls
and WhatsApp, so a patient only ever learns one.

Where it now appears:

- `components/WhatsAppFab.tsx`, the floating brass button, mounted sitewide in
  `app/layout.tsx`. The booking pill is offset to `bottom-[5.5rem]` so the two
  stack rather than overlap.
- Footer contact block, book page contact card, homepage call to action band,
  the mobile menu, and the enquiry form confirmation.
- `data/enquiry-options.ts` offers WhatsApp as a contact preference again, so it
  reaches the clinic inbox through `lib/sendEnquiryEmail.ts`.
- The rate limit, send failure and reCAPTCHA fallback messages name WhatsApp as
  the urgent channel again.

`lib/contact.ts` builds every wa.me link and prefills the opening line, so the
encoding lives in one place.

## B. Configuration that can fail silently

### B1. Enquiry email delivery: confirmed working

`lib/sendEnquiryEmail.ts` needs `SMTP_USER` and `SMTP_PASS`. Both are set in
Vercel and delivery is confirmed working on the live site. They are deliberately
absent from `.env.local`, so a local dev server cannot send: the form will show
the "could not send" error when testing locally. Not a bug.

### B2. reCAPTCHA

`NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and `RECAPTCHA_SECRET_KEY` are not set locally.
When the secret is missing, `lib/verifyRecaptcha.ts` skips verification
entirely, so the form is unprotected. Confirm both keys are set in Vercel.

## C. Stale code and docs

- `components/home/VerifyIndependentlyStrip.tsx` is never mounted, and every
  profile in `data/links.json` has `featured: false`, so it would render an
  empty strip even if it were. Either mount it with GMC Register, MMC Register
  and Top Doctors marked featured, or delete the component.
- `docs/seo-audit.md` rows 1 and 2 are out of date: the enquiry form is wired to
  email, and no contact field is a placeholder any more.
- `docs/outstanding-placeholders.pdf` predates both the phone number and the
  WhatsApp restore. Regenerate it with
  `node scripts/generate-outstanding-items-pdf.mjs`; the script reads
  `whatsappNumber` and `whatsappHref` again, so it no longer prints "unknown".

## D. SEO and content backlog

Unchanged from `docs/seo-audit.md`, nothing here is a placeholder on the live
site: OG images per page, extended JSON-LD (WebSite, Organization,
MedicalWebPage, BreadcrumbList), per-page canonical and OG tags, PFA vs RFA as
a real table, `ComparisonCards` on the homepage, definition blocks per
condition, an `/about` page, a cost page, and an expanded FAQ.

## E. Checked and clean

No action needed on these, recorded so they are not re-audited:

- All 20 entries in `data/publications.json` have URLs.
- All 11 profiles in `data/links.json` have URLs, so the footer verify row shows
  no flags.
- The interview video URL is set, so the homepage video block shows no flag.
- No visit is marked TBC: August 2026 is waitlist, the other three are open.
  Nothing is scheduled beyond December 2026.
- `data/testimonials.json` entries are letters and quotes that need no links.
- No empty fields in `data/certifications.ts`, `data/gallery.ts` or
  `data/milestones.ts`.
