# News and press articles to add

Staging file for news coverage: online article links and snippets from print or physical clippings. Fill in **`articles.json`**, then copy each entry into the live data files below (or ask the agent to sync them for you).

## Quick start

1. Open **`articles.json`** and edit a `draft` entry (or duplicate one).
2. Fill in **outlet**, **date**, **headline**, and **snippet** (a short quote or pull from the article).
3. For online articles, paste the link in **url**. For print clippings, leave **url** empty.
4. Set **featured**: `true` for up to four main cards; `false` for the compact "More coverage" list.
5. Set **status** to `ready` when you want it synced to the site.
6. Copy into the data files (see mapping below), or ask: "sync the news articles marked ready."

## Field guide

| Field in `articles.json` | What to put |
|--------------------------|-------------|
| `status` | `draft` while you are editing, `ready` when complete, `live` once on the site |
| `outlet` | Newspaper or publication name (e.g. The Indian Express) |
| `date` | Publication date (e.g. 27 March 2025 or March 2025) |
| `headline` | Article headline as printed |
| `snippet` | Short quote or paragraph to show on the card (from the article or clipping) |
| `credit` | Who the snippet is attributed to (e.g. Prof. Gupta, quoted or Reporting in The Tribune) |
| `featured` | `true` = large card (max 4 on Voices page); `false` = compact list row |
| `url` | Full article URL if online; leave `""` for print-only |
| `notes` | Your own notes only; not shown on the site |

## Where it appears on the site

### Voices page, section 04 · In the press

Large cards and the "More coverage" list come from **`data/links.json`** → `press[]`.

### Voices page, News filter grid

The filterable testimonial cards (category News) come from **`data/testimonials.json`**. Add one entry per article there if you want it in that grid too.

## Copy mapping

### Into `data/links.json` → `press[]`

```json
{
  "outlet": "<outlet>",
  "date": "<date>",
  "headline": "<headline>",
  "note": "<snippet>",
  "credit": "<credit>",
  "featured": <featured>,
  "url": "<url>"
}
```

While `url` is empty, the site shows a dashed **link needed** flag instead of "Read article".

### Into `data/testimonials.json`

Add a new object with a unique `id` (e.g. `news5`, `news6`):

```json
{
  "id": "news5",
  "category": "news",
  "masthead": "<outlet>",
  "date": "<date, can be shorter e.g. 27 March>",
  "headline": "<headline>",
  "quote": "<snippet>",
  "attribution": "<short credit, e.g. Prof. Gupta or The Tribune>",
  "detail": "quoted in <outlet> or Reporting in <outlet>"
}
```

## Tips

- **Online article**: paste the URL, copy the headline from the page, and pick one strong quote for `snippet`.
- **Physical clipping**: photograph or transcribe the headline and a short quote; no URL needed.
- Keep **featured** entries to four. Older or minor coverage can use `featured: false`.
- Remove placeholder rows from `data/links.json` (the "Add outlet name" entries) as you replace them with real articles.
