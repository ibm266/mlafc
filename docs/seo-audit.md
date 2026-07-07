# SEO + AI SEO Audit: Mumbai London AF Clinic

**Date:** 7 July 2026  
**Goal:** Convert potential AF patients into enquiries  
**Scope:** Codebase audit (Next.js 15 App Router)  
**Skills used:** `seo-audit`, `ai-seo` (installed globally at `~/.cursor/skills/`)

---

## Executive summary

The site has **strong content quality**: cited statistics, plain-language answers, named GMC-registered consultant, real outcomes data. That is a genuine competitive advantage for both traditional SEO (E-E-A-T) and AI SEO (citation-worthiness).

The main gaps are **technical plumbing, missing structured data, and conversion blockers**: most are fast to fix.

### Top priorities

| # | Issue | Type | Impact | Effort | Status |
|---|-------|------|:------:|:------:|:------:|
| 1 | Enquiry form is a stub: leads are `console.log`ged | Conversion | Critical | Low | Pending (Batch 2) |
| 2 | Contact details are `[placeholder]` in `data/site.ts` | Conversion + Local SEO | Critical | Low | Pending (Batch 2) |
| 3 | Domain mismatch: sitemap used `mlafc.com`, rest used `mumbailondonaf.com` | Technical | Critical | Low | **Done (Batch 1)** |
| 4 | Homepage had no unique title/description | On-page | High | Low | **Done (Batch 1)** |
| 5 | No FAQPage schema despite 6 cited FAQs | AI SEO | High | Low | **Done (Batch 1)** |
| 6 | No per-page canonical / OG / Twitter tags | On-page + Social | High | Med | Partial |
| 7 | No `llms.txt` for AI engines | AI SEO | Med | Low | **Done (Batch 1)** |
| 8 | No favicon / manifest | Technical + Social | Med | Low | **Done (Batch 1)** |
| 9 | `ComparisonCards` built but not on live homepage | AI SEO + Content | Med | Low | Pending (Batch 3) |
| 10 | Missing schema: Organization, WebSite, MedicalWebPage, BreadcrumbList | AI SEO | Med | Med | Pending |

---

## Site structure

| Route | Purpose |
|-------|---------|
| `/` | Homepage: hero, consultant profile, conditions teaser, evidence teaser, map, testimonials, visits, enquiry CTA |
| `/conditions` | Plain-language guides for 6 heart rhythm conditions |
| `/evidence` | PFA vs RFA evidence, volume stats, publications, FAQ, references |
| `/journey` | Career timeline (1988–2026) |
| `/testimonials` | Hospital letters, patient/peer quotes, press |
| `/book` | Primary conversion: enquiry form + WhatsApp/phone/email |

**Redirects:** `/publications` → `/evidence#publications`, `/locations` → `/#map-heading`

**Canonical domain:** `https://www.mumbailondonaf.com` (now centralized in `data/site.ts` as `site.url`)

---

## Part 1: Conversion blockers (Batch 2)

### 1a. Enquiry form doesn't send

`app/book/actions.ts` logs enquiries to console and returns success. Wire to email/CRM before driving traffic.

### 1b. Contact placeholders

`data/site.ts` still has `[placeholder]` for phone, WhatsApp, email, address, response days. This poisons JSON-LD `telephone`/`email` and kills patient trust.

---

## Part 2: Traditional SEO

### Technical

| Finding | Impact | Recommendation | Status |
|---------|--------|----------------|--------|
| Domain split between sitemap and metadata | Critical | Single canonical in `site.url` | Done |
| No canonical tags on sub-pages | High | Add `alternates.canonical` per route | Partial (home only) |
| No favicon / manifest | Med | `app/icon.jpg`, `app/manifest.ts` | Done |
| Sitemap exists, robots allows all bots | Good | - | OK |
| Redirects correct (301) | Good | - | OK |
| `next/image` + alt text on key images | Good | - | OK |

### On-page

| Finding | Impact | Recommendation | Status |
|---------|--------|----------------|--------|
| Homepage inherited generic title | High | Keyword-targeted title + description | Done |
| Title template is `'%s'` (no brand suffix) | Low | Consider `'%s \| Mumbai London AF Clinic'` | Open |
| Sub-page meta descriptions exist but lack CTAs | Low | Add location keywords + enquiry CTA | Open |
| Heading structure (one H1, logical H2/H3) | Good | - | OK |
| Strong E-E-A-T content | Good | - | OK |

### Content quality strengths

- Named consultant with GMC number (5205561)
- Published complication rate (<1%)
- Cited comparative studies (2025 PFA vs RFA)
- Career timeline authority page (`/journey`)
- Hospital reference letters (`/testimonials`)

### Content gaps

- No dedicated About/Bio page
- No author attribution or "last updated" dates on evidence/conditions pages
- `ComparisonCards` component exists but is not mounted on homepage

---

## Part 3: AI SEO

### What's working

- Content is citation-grade: statistics with numbered references, expert framing
- AI bots allowed in robots.txt (`userAgent: '*', allow: '/'`)
- FAQ content in `data/faqs.ts` is well-written for extraction

### Gaps and fixes

| Finding | Impact | Recommendation | Status |
|---------|--------|----------------|--------|
| No FAQPage schema | High | `components/FaqJsonLd.tsx` on `/evidence` | Done |
| No `llms.txt` | Med | `public/llms.txt` | Done |
| PFA vs RFA comparison is prose, not table | Med | Convert to `<table>` on `/evidence`; mount `ComparisonCards` on home | Pending |
| No definition blocks on conditions | Med | 40–60 word answer-first intro per condition | Pending |
| Missing WebSite, Organization, MedicalWebPage schema | Med | Extend `JsonLd.tsx` | Pending |
| No OG images for social/WhatsApp sharing | Med | Add `opengraph-image` per key page | Pending |

### AI visibility targets (queries to test monthly)

- "What is atrial fibrillation?"
- "Is PFA better than RFA?"
- "How safe is catheter ablation?"
- "AF specialist in Mumbai"
- "Cost of AF ablation in India"
- "Professor Dhiraj Gupta cardiologist"

Test across: Google AI Overviews, ChatGPT, Perplexity, Claude.

---

## Part 4: Implementation batches

### Batch 1: Technical + AI schema (completed 7 Jul 2026)

- [x] Centralize canonical URL in `data/site.ts` (`site.url`)
- [x] Fix sitemap domain mismatch
- [x] Add homepage-specific metadata (title, description, canonical, OG)
- [x] Add `FAQPage` JSON-LD (`components/FaqJsonLd.tsx` on `/evidence`)
- [x] Add `public/llms.txt`
- [x] Add `app/icon.jpg` (from logo) and `app/manifest.ts`
- [x] Update SEO tests

### Batch 2: Conversion (next)

- [ ] Wire enquiry form (`app/book/actions.ts`) to email/CRM
- [ ] Fill in `data/site.ts` contact details
- [ ] Verify WhatsApp FAB and footer links work

### Batch 3: Content + structure (after Batch 2)

- [ ] Convert PFA vs RFA comparison to extractable table on `/evidence`
- [ ] Mount `ComparisonCards` on homepage
- [ ] Add definition blocks to each condition on `/conditions`
- [ ] Add "Last updated" + author attribution to evidence/conditions
- [ ] Create `/about` bio page with full credentials
- [ ] Add "Cost / What to expect" section or page
- [ ] Expand FAQ for fan-out queries (cost, Mumbai specialist, blood thinners)
- [ ] Per-condition FAQ blocks with schema
- [ ] OG images per page for WhatsApp/social sharing
- [ ] Extend JSON-LD: WebSite, Organization, MedicalWebPage, BreadcrumbList
- [ ] Per-page canonical + OG/Twitter on all routes

---

## Content rewrite guidance

### Homepage title (implemented)

```
AF Ablation in Mumbai | London Consultant Electrophysiologist
```

### Condition pages: add definition blocks

Each condition section should open with a 40–60 word standalone definition:

> **Atrial fibrillation (AF)** is an irregular, often rapid heart rhythm caused by chaotic electrical signals in the upper chambers. It affects millions worldwide and can cause palpitations, fatigue, and increased stroke risk if untreated.

### Evidence page: comparison table

Convert PFA vs RFA prose into a table (highest-cited AI content format ~33%):

| | RFA (radiofrequency) | PFA (pulsed field) |
|---|---|---|
| How it works | Controlled heat | Short electrical pulses |
| Evidence (2025 trials) | Comparable outcomes | Comparable outcomes |
| Best for | Depends on patient anatomy | Depends on patient anatomy |
| Key factor | Operator experience | Operator experience |

### FAQ expansion candidates

- "How much does AF ablation cost in Mumbai?"
- "Do I need to travel to the UK for treatment?"
- "Who is the best AF specialist in Mumbai?"
- "Should I stop blood thinners before ablation?"
- "How long is recovery after catheter ablation?"

---

## New sections / functionality to add

1. **`/about` page**: full bio, credentials, GMC, photo, scoped Physician schema
2. **Cost / what to expect**: even indexable fee guidance helps AI and patient queries
3. **Expanded FAQ**: cover fan-out queries AI systems generate
4. **Per-condition FAQs**: each condition independently citable
5. **OG images**: patients share clinic links on WhatsApp; previews matter

---

## Skills reference

Install globally (re-run if needed):

```bash
cp -R ~/.agents/skills/seo-audit ~/.cursor/skills/seo-audit
cp -R ~/.agents/skills/ai-seo ~/.cursor/skills/ai-seo
```

| Skill | Use for |
|-------|---------|
| `seo-audit` | Technical SEO, on-page, crawlability, E-E-A-T, content quality |
| `ai-seo` | AI citations, FAQPage, llms.txt, extractable content, bot access |
| `schema` | Structured data implementation |
| `copywriting` | Content rewrites |
| `content-strategy` | New pages/sections planning |
| `site-architecture` | Navigation, URL structure, internal linking |

**How to invoke:** Start a new chat and say "run an SEO audit using seo-audit" or "optimize for AI search using ai-seo". For this clinic specifically, reference this document: `docs/seo-audit.md`.

---

## Files changed in Batch 1

| File | Change |
|------|--------|
| `data/site.ts` | Added `site.url` canonical constant |
| `app/sitemap.ts` | Uses `site.url` |
| `app/robots.ts` | Uses `site.url` for sitemap reference |
| `app/layout.tsx` | Uses `site.url` for `metadataBase` |
| `app/page.tsx` | Homepage metadata (title, description, canonical, OG) |
| `app/evidence/page.tsx` | Renders `FaqJsonLd` |
| `app/manifest.ts` | Web app manifest |
| `app/icon.jpg` | Favicon from logo |
| `components/FaqJsonLd.tsx` | FAQPage schema from `data/faqs.ts` |
| `components/JsonLd.tsx` | Uses `site.url` |
| `public/llms.txt` | AI-readable site overview |
| `test/seo.test.tsx` | Tests for FAQ schema + canonical sitemap domain |
