#!/usr/bin/env node
/**
 * One-page map of Professor Gupta's India visits, in the site's colours.
 * Usage: node scripts/generate-india-visits-pdf.mjs
 * Writes docs/india-visits-map.pdf from data/locations.json.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT = path.join(ROOT, 'docs', 'india-visits-map.pdf');

const ROLE_LABEL = {
  operated: 'Operated',
  taught: 'Taught',
  proctored: 'Proctored',
};

/** Nudge a city name off its pin. Tuned for the India projection in mapGeometry.ts. */
const LABEL = {
  Chandigarh: { dx: -8, dy: -2, anchor: 'end' },
  Delhi: { dx: 8, dy: 3, anchor: 'start' },
  Ahmedabad: { dx: -8, dy: 3, anchor: 'end' },
  Kolkata: { dx: 8, dy: 3, anchor: 'start' },
  Mumbai: { dx: -8, dy: -10, anchor: 'end' },
  Pune: { dx: -12, dy: 22, anchor: 'end' },
  Hyderabad: { dx: 0, dy: -14, anchor: 'middle' },
  Vizag: { dx: 8, dy: 4, anchor: 'start' },
  Bengaluru: { dx: -8, dy: 3, anchor: 'end' },
  Chennai: { dx: 8, dy: -8, anchor: 'start' },
  Tiruchirappalli: { dx: 8, dy: 12, anchor: 'start' },
  Thiruvananthapuram: { dx: 0, dy: 16, anchor: 'middle' },
};

function readIndiaGeometry() {
  const src = fs.readFileSync(path.join(ROOT, 'components/map/mapGeometry.ts'), 'utf8');
  const block = src.slice(src.indexOf('export const INDIA_GEOMETRY'));
  const d = block.match(/"d": "([^"]+)"/)?.[1];
  const k = Number(block.match(/"k": ([0-9.]+)/)?.[1]);
  const tx = Number(block.match(/"tx": (-?[0-9.]+)/)?.[1]);
  const ty = Number(block.match(/"ty": (-?[0-9.]+)/)?.[1]);
  if (!d || !k || Number.isNaN(tx) || Number.isNaN(ty)) {
    throw new Error('Could not read INDIA_GEOMETRY from components/map/mapGeometry.ts');
  }
  return { d, k, tx, ty };
}

function project(lat, lng, projection) {
  const lambda = (lng * Math.PI) / 180;
  const phi = (lat * Math.PI) / 180;
  return {
    x: projection.tx + projection.k * lambda,
    y: projection.ty - projection.k * Math.log(Math.tan(Math.PI / 4 + phi / 2)),
  };
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function indiaGroups(locations) {
  const groups = new Map();
  for (const loc of locations) {
    if (loc.region !== 'India') continue;
    if (!groups.has(loc.city)) groups.set(loc.city, []);
    groups.get(loc.city).push(loc);
  }

  return [...groups.entries()]
    .map(([city, visits]) => {
      const lat = visits.reduce((sum, visit) => sum + visit.lat, 0) / visits.length;
      const lng = visits.reduce((sum, visit) => sum + visit.lng, 0) / visits.length;
      const role = visits.some((visit) => visit.role === 'operated')
        ? 'operated'
        : visits.some((visit) => visit.role === 'proctored')
          ? 'proctored'
          : 'taught';
      return { city, lat, lng, role, visits };
    })
    .sort((a, b) => b.lat - a.lat);
}

function mapMarkup(groups, geometry) {
  const pins = groups
    .map((group) => {
      const { x, y } = project(group.lat, group.lng, geometry);
      const label = LABEL[group.city] ?? { dx: 8, dy: 3, anchor: 'start' };
      return `
        <g class="pin ${group.role}">
          <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="4.2" />
          <text x="${(x + label.dx).toFixed(2)}" y="${(y + label.dy).toFixed(2)}" text-anchor="${label.anchor}">${escapeHtml(group.city)}</text>
        </g>`;
    })
    .join('');

  return `
    <svg viewBox="-24 98 420 404" role="img" aria-label="Map of India with a pin for each city">
      <path class="land" d="${geometry.d}" />
      ${pins}
    </svg>`;
}

function registerMarkup(groups) {
  return groups
    .map((group) => {
      const rows = group.visits
        .map(
          (visit) => `
          <div class="visit">
            <p class="place">${escapeHtml(visit.name)} <span class="dates">${escapeHtml(visit.years)}</span></p>
            <p class="role">${ROLE_LABEL[visit.role]}</p>
          </div>`,
        )
        .join('');
      return `
        <section class="city">
          <h3>${escapeHtml(group.city)}</h3>
          ${rows}
        </section>`;
    })
    .join('');
}

function legendMarkup(groups) {
  const roles = ['operated', 'taught', 'proctored'].filter((role) =>
    groups.some((group) => group.visits.some((visit) => visit.role === role)),
  );
  return roles
    .map(
      (role) => `
      <li><span class="swatch ${role}"></span>${ROLE_LABEL[role]}</li>`,
    )
    .join('');
}

function htmlDocument({ groups, geometry, generated }) {
  const logo = fs.readFileSync(path.join(ROOT, 'public/brand/logo-mark.jpg')).toString('base64');
  const visitCount = groups.reduce((sum, group) => sum + group.visits.length, 0);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&display=swap" rel="stylesheet" />
  <style>
    @page { size: A4 landscape; margin: 0; }
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      width: 297mm;
      height: 210mm;
      background: #F7F5F1;
      color: #122B3A;
      font-family: Archivo, system-ui, sans-serif;
    }
    .sheet {
      width: 297mm;
      height: 210mm;
      padding: 8mm 11mm 6mm;
      display: flex;
      flex-direction: column;
      gap: 3.5mm;
    }
    header {
      display: grid;
      grid-template-columns: 28mm 1fr auto;
      gap: 4mm;
      align-items: center;
    }
    .logo { width: 28mm; height: auto; display: block; }
    .eyebrow {
      margin: 0;
      font-size: 8.5pt;
      font-weight: 600;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: #B08D3E;
    }
    h1 {
      margin: 0.4mm 0 0;
      font-family: Newsreader, Georgia, serif;
      font-weight: 500;
      font-size: 22pt;
      line-height: 0.95;
      letter-spacing: -0.02em;
    }
    .deck {
      margin: 1.5mm 0 0;
      font-size: 9.5pt;
      line-height: 1.35;
      color: #3A5468;
    }
    .stats {
      text-align: right;
      font-size: 9pt;
      color: #3A5468;
    }
    .stats p { margin: 0; }
    .stats strong {
      font-family: Newsreader, Georgia, serif;
      font-weight: 500;
      font-size: 16pt;
      color: #122B3A;
      margin-right: 1mm;
    }
    .when { margin-top: 1.5mm !important; font-size: 8.5pt; color: #556675; }
    .columns {
      flex: 1;
      min-height: 0;
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 6mm;
    }
    .map-panel {
      background: #0C1F2B;
      border-radius: 4mm;
      padding: 3mm 3mm 2.5mm;
      display: flex;
      flex-direction: column;
      min-height: 0;
    }
    svg { width: 100%; flex: 1; min-height: 0; }
    .land { fill: #1B3949; stroke: #B08D3E; stroke-width: 1.15; }
    .pin circle { stroke-width: 1.4; }
    .pin.operated circle { fill: #B08D3E; stroke: #F7F5F1; }
    .pin.taught circle { fill: #F7F5F1; stroke: #B08D3E; }
    .pin.proctored circle { fill: #5BA4B5; stroke: #F7F5F1; }
    .pin text {
      font-family: Archivo, system-ui, sans-serif;
      font-size: 10px;
      font-weight: 600;
      fill: #F7F5F1;
      stroke: #0C1F2B;
      stroke-width: 3px;
      paint-order: stroke fill;
    }
    .legend {
      display: flex;
      gap: 5mm;
      list-style: none;
      margin: 1mm 1mm 0;
      padding: 0;
      color: #F7F5F1;
      font-size: 8pt;
      font-weight: 500;
    }
    .legend li { display: flex; align-items: center; gap: 1.6mm; }
    .swatch {
      width: 2.4mm;
      height: 2.4mm;
      border-radius: 50%;
      display: inline-block;
    }
    .swatch.operated { background: #B08D3E; }
    .swatch.taught { background: #F7F5F1; box-shadow: inset 0 0 0 0.3mm #B08D3E; }
    .swatch.proctored { background: #5BA4B5; }
    .register {
      min-height: 0;
      display: flex;
      flex-direction: column;
      border-top: 0.4mm solid #B08D3E;
      padding-top: 2.5mm;
    }
    .register h2 {
      margin: 0 0 1.4mm;
      font-family: Newsreader, Georgia, serif;
      font-weight: 500;
      font-size: 12pt;
    }
    .cities {
      display: flex;
      flex-direction: column;
      gap: 1.35mm;
    }
    .city h3 {
      margin: 0 0 0.15mm;
      font-family: Newsreader, Georgia, serif;
      font-weight: 500;
      font-size: 8.5pt;
      line-height: 1.15;
    }
    .visit {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      column-gap: 3mm;
      align-items: baseline;
    }
    .place {
      margin: 0;
      font-size: 7.4pt;
      font-weight: 600;
      line-height: 1.25;
    }
    .role {
      margin: 0;
      font-size: 6.4pt;
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #6E5826;
      white-space: nowrap;
    }
    .dates {
      font-weight: 400;
      color: #3A5468;
    }
    footer {
      display: flex;
      justify-content: space-between;
      font-size: 8pt;
      color: #556675;
    }
  </style>
</head>
<body>
  <main class="sheet">
    <header>
      <img class="logo" alt="" src="data:image/jpeg;base64,${logo}" />
      <div>
        <p class="eyebrow">Mumbai London AF Clinic</p>
        <h1>India</h1>
        <p class="deck">Every place Professor Gupta has worked, and the date of each visit.</p>
      </div>
      <div class="stats">
        <p><strong>${groups.length}</strong>cities</p>
        <p><strong>${visitCount}</strong>visits</p>
        <p class="when">${escapeHtml(generated)}</p>
      </div>
    </header>
    <div class="columns">
      <section class="map-panel">
        ${mapMarkup(groups, geometry)}
        <ul class="legend">${legendMarkup(groups)}</ul>
      </section>
      <section class="register">
        <h2>Visits</h2>
        <div class="cities">${registerMarkup(groups)}</div>
      </section>
    </div>
    <footer>
      <span>One pin marks each city. Hospitals in the same city are listed together.</span>
      <span>mumbai-london-af.clinic</span>
    </footer>
  </main>
</body>
</html>`;
}

async function main() {
  const locations = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/locations.json'), 'utf8'));
  const geometry = readIndiaGeometry();
  const groups = indiaGroups(locations);
  const generated = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const html = htmlDocument({ groups, geometry, generated });

  const browser = await puppeteer.launch({ headless: true, channel: 'chrome' });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);
    fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
    await page.pdf({
      path: OUTPUT,
      printBackground: true,
      preferCSSPageSize: true,
      width: '297mm',
      height: '210mm',
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const preview = path.join('/tmp', 'india-visits-map-preview.png');
    await page.screenshot({ path: preview, fullPage: true });
    console.log(preview);
  } finally {
    await browser.close();
  }

  console.log(OUTPUT);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
