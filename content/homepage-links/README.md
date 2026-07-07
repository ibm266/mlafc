# Homepage links to fill in

Outbound URLs used on the homepage. Fill in the `url` fields in **`urls.json`**, then copy each value into the target data file listed below.

## How to apply

| This folder | Copy into |
|-------------|-----------|
| `interview.url` | `data/links.json` → `interview.url` |
| `profiles[]` | `data/links.json` → `profiles` (match by `label`) |
| `mapLocations[]` | `data/locations.json` (match by `id`) |
| `publicationTeasers[]` | `data/publications.json` (match by `id`) |
| `contact` | `data/site.ts` |

Once a URL is set in the data file, the dashed **link needed** flags on the live site disappear automatically.

## Homepage sections

### 02 · Meet your consultant
- **Interview video** — Lilavati Hospital YouTube embed (`interview`)

### 05 · Research
- **Publication teasers** — `pub1`, `pub3`, `pub4` show “Read paper ↗” when `url` is set

### 06 · Where he works
- **Map detail card** — “Visit hospital site ↗” per city (`locations.json` → `url`)

### 07 · In their words
- **Verify independently** — featured profile pills: GMC Register, Liverpool Heart and Chest Hospital, Doctify

### Sitewide (footer on homepage)
- **Verify his record** — all profile pills in the footer row
- **Contact** — phone, email, WhatsApp (footer + floating WhatsApp button)

Internal navigation links (`/book`, `/evidence`, `/conditions`, etc.) are already wired and do not need URLs here.
