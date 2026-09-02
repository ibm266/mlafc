# Homepage links to fill in

Outbound URLs used on the homepage. Fill in any remaining `url` fields in **`urls.json`**, then copy each value into the target data file listed below.

> **Status, 12 August 2026:** everything here is filled in except three press
> articles in `data/links.json`, which have no online copy to link to. Contact
> details are live. See `docs/outstanding-items.md`.

## How to apply

| This folder | Copy into |
|-------------|-----------|
| `interview.url` | `data/links.json` → `interview.url` |
| `profiles[]` | `data/links.json` → `profiles` (match by `label`) |
| `publicationTeasers[]` | `data/publications.json` (entries with `featured: true` show on homepage) |
| `contact` | `data/site.ts` |

Once a URL is set in the data file, the dashed **link needed** flags on the live site disappear automatically.

## Homepage sections

### 02 · Meet your consultant
- **Interview video**: Lilavati Hospital YouTube embed (`interview`)

### 05 · Research
- **Publication teasers**: entries with `featured: true` in `data/publications.json` (currently three)

### 07 · In their words
- **Verify independently**: not on the live site. `components/home/VerifyIndependentlyStrip.tsx` is never mounted, and every profile in `data/links.json` has `featured: false`, so it would render empty even if it were. The footer verify row is what actually ships.

### Sitewide (footer on homepage)
- **Verify his record**: all profile pills in the footer row
- **Contact**: phone, WhatsApp, email (footer, plus the floating WhatsApp button)

Map hospital site links are not used on the homepage verify strip. Location pins do not require outbound URLs.

Internal navigation links (`/book`, `/evidence`, `/conditions`, etc.) are already wired and do not need URLs here.

## Profiles already filled in `data/links.json`

| Label | URL |
|-------|-----|
| GMC Register | gmc-uk.org/registrants/5205561 |
| MMC Register | maharashtramedicalcouncil.org.in doctor profile |
| Liverpool Heart and Chest Hospital | lhch.nhs.uk staff profile (footer only) |
| University of Liverpool | Honorary clinical academics page |
| Top Doctors | topdoctors.co.uk profile |
| PHIN | phin.org.uk consultant profile |
| Bupa Finder | finder.bupa.co.uk profile |
| LinkedIn | uk.linkedin.com profile |
| ResearchGate | researchgate.net profile |
| ORCID | orcid.org/0000-0002-3490-090X |
| Liverpool Centre for Cardiovascular Science | LCCS team page |

Removed (no credible individual profile found): Imperial College London, AF Association, Doctify.
