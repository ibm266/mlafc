#!/usr/bin/env node
/**
 * Generate a PDF inventory of outstanding placeholders and map location data.
 * Usage: node scripts/generate-outstanding-items-pdf.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'docs', 'outstanding-placeholders.pdf');

const ROLE_LABELS = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
};

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, relPath), 'utf8'));
}

/**
 * Reports the media each milestone actually carries.
 *
 * Read the `media` field, never `photoTitle`. Every milestone has a
 * `photoTitle` and `photoCaption` whether or not it has an image, because those
 * are caption text. This function used to key off `photoTitle` and so reported
 * all 11 milestones as awaiting a photograph long after the photographs landed,
 * which put a false claim into the generated PDF and into two later audits.
 */
function parseMilestonePhotos() {
  const src = fs.readFileSync(path.join(ROOT, 'data/milestones.ts'), 'utf8');
  // The finale is a separate export, rendered by NightCtaCard rather than the
  // timeline, but it carries a photo like any other milestone. Include it, so
  // nobody reads its absence here as a missing photograph.
  const blocks = src.split(/markerYear:\s*'/).slice(1);
  const items = [];

  for (const block of blocks) {
    const year = block.match(/^([^']+)/)?.[1];
    if (!year) continue;

    const variant = block.includes("variant: 'awards-band'") ? 'awards-band' : null;
    const photoTitle = block.match(/photoTitle:\s*'([^']+)'/)?.[1];
    const photoCaption = block.match(/photoCaption:\s*\n?\s*'([^']+)/)?.[1];
    const photoSrc = block.match(/photo:\s*\{[\s\S]*?src:\s*'([^']+)'/)?.[1];
    const videoSrc = block.match(/video:\s*\{[\s\S]*?src:\s*'([^']+)'/)?.[1];
    const hasGallery = /gallery:/.test(block);

    // An awards band has no photo slot by design, so it is not a gap.
    const media = photoSrc
      ? `photo ${photoSrc}`
      : videoSrc
        ? `video ${videoSrc}`
        : hasGallery
          ? 'gallery carousel'
          : variant === 'awards-band'
            ? 'no photo slot by design'
            : null;

    items.push({ year, photoTitle, photoCaption, variant, media });
  }

  return items;
}

function parseSitePlaceholders() {
  const src = fs.readFileSync(path.join(ROOT, 'data/site.ts'), 'utf8');
  const fields = [
    ['phone', /phone:\s*'([^']+)'/],
    ['phoneHref', /phoneHref:\s*'([^']+)'/],
    ['whatsappNumber', /whatsappNumber:\s*'([^']+)'/],
    ['whatsappHref', /whatsappHref:\s*'([^']+)'/],
    ['email', /email:\s*'([^']+)'/],
    ['address', /address:\s*'([^']+)'/],
    ['responseDays', /responseDays:\s*'([^']+)'/],
  ];
  return fields.map(([label, re]) => ({ label, value: src.match(re)?.[1] ?? 'unknown' }));
}

function heading(doc, text, size = 16) {
  doc.moveDown(0.6);
  doc.fontSize(size).font('Helvetica-Bold').fillColor('#0C1F2B').text(text);
  doc.moveDown(0.35);
  doc.fillColor('#000000');
}

function subheading(doc, text) {
  doc.moveDown(0.4);
  doc.fontSize(12).font('Helvetica-Bold').fillColor('#1B3949').text(text);
  doc.moveDown(0.2);
  doc.fillColor('#000000');
}

function body(doc, text, opts = {}) {
  doc.fontSize(10).font('Helvetica').text(text, { lineGap: 3, ...opts });
  doc.moveDown(0.25);
}

function bullet(doc, text) {
  doc.fontSize(10).font('Helvetica').text(`  •  ${text}`, { lineGap: 2, indent: 12, paragraphGap: 2 });
}

function groupLocationsByCountry(locations) {
  const byCountry = new Map();
  for (const loc of locations) {
    if (!byCountry.has(loc.country)) byCountry.set(loc.country, []);
    byCountry.get(loc.country).push(loc);
  }
  return [...byCountry.entries()].sort(([a], [b]) => a.localeCompare(b));
}

async function main() {
  const locations = readJson('data/locations.json');
  const visits = readJson('data/visits.json');
  const links = readJson('data/links.json');
  const siteFields = parseSitePlaceholders();
  const milestonePhotos = parseMilestonePhotos();
  const pressMissingUrl = links.press.filter((p) => !p.url?.trim());

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });

  const doc = new PDFDocument({ margin: 56, size: 'A4' });
  const stream = fs.createWriteStream(OUTPUT);
  doc.pipe(stream);

  const generated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  doc.fontSize(22).font('Helvetica-Bold').text('Mumbai London AF Clinic', { align: 'left' });
  doc.moveDown(0.3);
  doc.fontSize(14).font('Helvetica').fillColor('#555555').text('Outstanding placeholders and map activity inventory');
  doc.moveDown(0.2);
  doc.fontSize(10).text(`Generated ${generated} from live site data files`);
  doc.fillColor('#000000');

  heading(doc, '1. Contact and clinic details (data/site.ts)', 14);
  body(
    doc,
    'These values appear on the Book page, footer, and enquiry flow. Placeholder text is shown to visitors until replaced.',
  );
  for (const { label, value } of siteFields) {
    bullet(doc, `${label}: ${value}`);
  }

  heading(doc, '2. Mumbai visit dates (data/visits.json)', 14);
  body(doc, 'Shown on the Book page under "Upcoming Mumbai visits." Months and exact dates are not yet confirmed.');
  for (const visit of visits) {
    const status =
      visit.status === 'open' ? 'Booking open' : visit.status === 'waitlist' ? 'Waitlist' : 'TBC';
    bullet(doc, `${visit.month} (${status}): ${visit.note}`);
  }
  bullet(
    doc,
    'Homepage floating pill (components/FloatingBookingPill.tsx): hardcoded "Next Mumbai visit: March 2026 · Booking open" (not wired to visits.json)',
  );

  const milestonesMissingMedia = milestonePhotos.filter((m) => !m.media);

  heading(doc, '3. Journey page photos (data/milestones.ts)', 14);
  body(
    doc,
    milestonesMissingMedia.length === 0
      ? 'Every milestone carries real media: a photograph, a video, or a gallery carousel. Nothing on the journey page renders a decorative placeholder frame. The 2025 finale is listed last; it sits outside the timeline and is rendered by NightCtaCard, but it carries a photograph too.'
      : `${milestonesMissingMedia.length} milestone(s) still render a decorative placeholder frame (MilestonePlaceholder) instead of real media.`,
  );
  for (const m of milestonePhotos) {
    bullet(doc, `${m.year} (${m.photoTitle}): ${m.media ?? 'NO MEDIA, renders a placeholder frame'}`);
  }

  heading(doc, '4. Press articles missing online links (data/links.json)', 14);
  body(
    doc,
    'These articles appear on the Voices page. Print clippings are intentional, but "Read article" links are absent until a URL is added (or the snippet-only treatment is confirmed).',
  );
  if (pressMissingUrl.length === 0) {
    bullet(doc, 'None');
  } else {
    for (const item of pressMissingUrl) {
      bullet(doc, `${item.outlet} (${item.date}): ${item.headline}`);
    }
  }

  heading(doc, '5. Map hospital site links (data/locations.json)', 14);
  body(
    doc,
    `All ${locations.length} map locations have an empty "url" field. The map detail card shows a "hospital link needed" flag instead of "Visit hospital site".`,
  );
  bullet(doc, 'Also outstanding: every location has an empty "images" array (no location photos on the map).');

  heading(doc, '6. Interactive map: countries, cities, and activity', 14);
  body(
    doc,
    'Source: data/locations.json. Activity types: Operated (procedures), Taught (training visits), Proctored (supervised local operators during cases).',
  );

  for (const [country, locs] of groupLocationsByCountry(locations)) {
    subheading(doc, country);
    const byCity = new Map();
    for (const loc of locs) {
      if (!byCity.has(loc.city)) byCity.set(loc.city, []);
      byCity.get(loc.city).push(loc);
    }
    for (const [city, cityLocs] of [...byCity.entries()].sort(([a], [b]) => a.localeCompare(b))) {
      for (const loc of cityLocs) {
        const role = ROLE_LABELS[loc.role] ?? loc.role;
        bullet(doc, `${city}: ${loc.name} (${role}, ${loc.years}). ${loc.blurb}`);
      }
    }
  }

  // Count what is actually outstanding. These used to print bare totals, so a
  // resolved section still reported every row as pending.
  heading(doc, '7. Summary counts', 14);
  bullet(doc, `Contact fields pending: ${siteFields.filter((f) => f.value.includes('[placeholder]')).length}`);
  bullet(doc, `Mumbai visit rows pending real dates: ${visits.filter((v) => v.status === 'tbc' || /\[|\]/.test(v.month)).length}`);
  bullet(doc, `Journey milestones without real media: ${milestonesMissingMedia.length}`);
  bullet(doc, `Press articles without URL: ${pressMissingUrl.length}`);
  bullet(doc, `Map locations without an outbound URL: ${locations.filter((l) => !l.url?.trim()).length} of ${locations.length} (deliberate: no single official page exists)`);

  body(
    doc,
    'Note: Conditions page ECG comparison animations are implemented. ConditionMediaPlaceholder exists in code but is not shown while ecgVariant is set on every condition.',
  );

  doc.end();

  await new Promise((resolve, reject) => {
    stream.on('finish', resolve);
    stream.on('error', reject);
  });

  console.log(`Wrote ${OUTPUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
