# Mumbai London AF Clinic: agent instructions

Read this file at the start of every task and verify compliance before marking work complete.

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
