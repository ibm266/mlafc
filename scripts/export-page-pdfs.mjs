#!/usr/bin/env node
/**
 * Export visible text content from each site page as a separate PDF.
 * Usage: node scripts/export-page-pdfs.mjs [baseUrl]
 * Default baseUrl: http://localhost:3000
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';
import PDFDocument from 'pdfkit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(ROOT, 'exports', 'page-pdfs');

const ROUTES = [
  { path: '/', file: 'home' },
  { path: '/evidence', file: 'evidence' },
  { path: '/publications', file: 'publications' },
  { path: '/conditions', file: 'conditions' },
  { path: '/journey', file: 'journey' },
  { path: '/locations', file: 'locations' },
  { path: '/testimonials', file: 'testimonials' },
  { path: '/book', file: 'book' },
];

const BASE_URL = process.argv[2] ?? 'http://localhost:3000';

function writePdf({ title, url, sections }, outPath) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 56, size: 'A4' });
    const stream = fs.createWriteStream(outPath);
    doc.pipe(stream);

    doc.fontSize(20).font('Helvetica-Bold').text(title, { align: 'left' });
    doc.moveDown(0.5);
    doc.fontSize(10).font('Helvetica').fillColor('#555555').text(url);
    doc.moveDown(1);
    doc.fillColor('#000000');

    for (const [label, text] of Object.entries(sections)) {
      if (!text?.trim()) continue;
      doc.fontSize(12).font('Helvetica-Bold').text(label);
      doc.moveDown(0.35);
      doc.fontSize(11).font('Helvetica').text(text.trim(), {
        align: 'left',
        lineGap: 3,
      });
      doc.moveDown(1);
    }

    doc.end();
    stream.on('finish', resolve);
    stream.on('error', reject);
  });
}

async function extractPageText(page) {
  return page.evaluate(() => {
    const pick = (selector) => document.querySelector(selector)?.innerText?.trim() ?? '';
    return {
      title: document.title,
      sections: {
        Navigation: pick('header nav, nav'),
        'Main content': pick('main#main, main'),
        Footer: pick('footer'),
      },
    };
  });
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

  const results = [];

  for (const route of ROUTES) {
    const url = `${BASE_URL}${route.path}`;
    process.stdout.write(`Exporting ${url} … `);

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60_000 });
  // Allow client-side hydration / lazy sections to settle
    await new Promise((r) => setTimeout(r, 1500));

    const content = await extractPageText(page);
    const outPath = path.join(OUTPUT_DIR, `${route.file}.pdf`);
    await writePdf({ ...content, url }, outPath);

    results.push({ route: route.path, file: `${route.file}.pdf`, title: content.title });
    console.log('done');
  }

  await browser.close();

  console.log(`\nCreated ${results.length} PDFs in exports/page-pdfs/:`);
  for (const r of results) {
    console.log(`  - ${r.file} (${r.title})`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
