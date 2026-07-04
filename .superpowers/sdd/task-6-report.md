# Task 6 Report: Global shell - Logo, Nav, Footer, WhatsAppFab, layout

## Status

DONE

## Summary

Added the global shell components and wired them into the root app layout. The shell includes the inline SVG logo fallback, sticky responsive navigation, footer with site trust/contact copy, WhatsApp FAB, and skip link targeting `main#main`.

## Files Changed

- `components/Logo.tsx`
- `components/Nav.tsx`
- `components/Footer.tsx`
- `components/WhatsAppFab.tsx`
- `app/layout.tsx`
- `app/page.tsx`
- `test/shell.test.tsx`

## TDD Notes

1. Added `test/shell.test.tsx` first with the tests from the brief.
2. Ran `npm test`; expected failure occurred because the shell components did not exist.
3. Implemented the logo fallback, sticky nav, footer, WhatsApp FAB, layout shell, and current page `main#main` target.
4. Kept component colors on palette tokens and normalized placeholder WhatsApp data to a `wa.me` URL shape.

## Verification

- `npm test`: PASS - 6 files, 18 tests passed.
- `npm test && npm run build`: PASS - build compiled successfully and generated static pages.
- Dev server render check at `http://localhost:3000`: PASS - skip link, booking CTA, and site name present.

## Commit

- Included in Task 6 implementation commit.

## Concerns

- `site.whatsappHref` and `site.whatsappNumber` are still placeholders from prior data tasks; the FAB produces a safe `https://wa.me/` URL shape until real contact data lands.
