# Task 12: Journey Page Report

## Status

Implemented the Journey page with a sticky desktop photo panel, scrolling milestone articles, inline mobile photo placeholders, and the shared CTA band.

## TDD

- Added `test/journey.test.tsx` first.
- Confirmed the initial failure: missing `@/components/JourneyTimeline`.
- Implemented `JourneyTimeline` and `/journey`.
- Re-ran the journey test successfully.

## Guardrails

- Timeline consumes `milestones` from `data/milestones.ts`.
- Desktop renders year markers and switches the active photo placeholder via `IntersectionObserver`.
- Mobile hides the sticky panel and renders each milestone's photo placeholder inline.
- Styling uses existing design tokens.
- Page uses `Reveal` for the hero intro and `CtaBand` for the final CTA.

## Verification

- Initial `npm test` failed as expected before implementation.
- `npm test -- test/journey.test.tsx` passed: 1 file, 1 test.
- `npm test && npm run build` passed: 13 files, 32 tests; Next build generated `/journey`.
- IDE diagnostics: PASS - no linter errors found in edited files.

## Concerns

- The final combined test/build run included unrelated untracked testimonials files that are not part of this Task 12 commit.
- Manual browser QA was not run; automated journey coverage and production build passed.

## Fix (2026-07-04)

Replaced `CtaBand` on `/journey` with the brief's explicit final section: `Link href="/book"` labeled "Book a consultation", styled with design tokens (`bg-ink`, `text-paper`, `hover:bg-night`, `rounded-full`).

### Verification (fix)

- `npm test -- test/journey.test.tsx`: 1 file, 1 test passed.
- `npm test`: 13 files, 32 tests passed.
- `npm run build`: PASS: `/journey` generated successfully.
