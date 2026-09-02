# Mumbai London AF Clinic

Next.js 15 (App Router) + Tailwind CSS v4 site for the Mumbai London AF Clinic,
the Mumbai practice of Professor Dhiraj Gupta, consultant cardiologist and
electrophysiologist at Liverpool Heart and Chest Hospital.

## Start here

- **`AGENTS.md`** is required reading before any change. It carries the copy
  style rules (no em dashes, enforced by a test) and a short summary of the
  site's current state.
- **`docs/outstanding-items.md`** is the source of truth for what is genuinely
  unfinished. Check it before reporting anything as missing.

## Deployment

Deployed on Vercel, project `mlafc`. Pushing to `main` deploys automatically.

- **Live at https://www.mumbai-london-af.clinic**
- `data/site.ts` sets `url: 'https://www.mumbai-london-af.clinic'`. That is the
  canonical host for the sitemap, `robots.txt`, `metadataBase` and JSON-LD.

`site.url` is the single place the canonical domain is defined; the sitemap,
`robots.txt`, `metadataBase` and all JSON-LD `@id`s derive from it.

## Commands

```bash
npm run dev
```

```bash
npm test
```

```bash
npm run build
```

Do not run `npm run build` while `npm run dev` is running. They share `.next`,
and the build will clobber the dev server's chunks, producing
`Cannot find module './NNN.js'` until you delete `.next` and restart.

Lint the app rather than the whole repo. The `Hero section redesign/` folder is
kept reference material and lints dirty:

```bash
npx eslint app components lib data test
```

## Layout

| Path | What lives there |
|------|------------------|
| `app/` | Routes. Every page exports `metadata`. |
| `components/` | Shared UI. `components/home/`, `map/`, `ecg/`, `certifications/` are grouped by area. |
| `data/` | All editable content: copy, contact details, publications, locations, visits, certifications. |
| `lib/` | Server and shared logic: enquiry validation and sending, rate limiting, reCAPTCHA, phone and contact helpers. |
| `docs/` | Audits and operational notes. |
| `test/` | Vitest and Testing Library, including an axe accessibility pass and the em dash check. |

## Environment

Set in Vercel, deliberately absent from `.env.local`:

| Variable | Purpose |
|----------|---------|
| `SMTP_USER`, `SMTP_PASS` | Enquiry delivery through the clinic's Microsoft 365 mailbox. Missing locally, so the form shows its "could not send" error in dev. That is expected. |
| `SMTP_HOST`, `SMTP_PORT` | Optional. Default to `smtp.office365.com:587`. |
| `ENQUIRY_NOTIFY_EMAIL` | Optional. Defaults to `site.email`. |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY` | reCAPTCHA. **Currently unset in production**, and verification is skipped entirely when the secret is missing. See `docs/outstanding-items.md` section A2. |

Fonts are Newsreader and Archivo via `next/font/google`; theme tokens are
defined in `app/globals.css`.
