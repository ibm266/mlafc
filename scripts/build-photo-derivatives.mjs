#!/usr/bin/env node
/**
 * Build web derivatives for gallery photographs: 1600px long edge, WebP,
 * quality 80, EXIF orientation applied. Originals stay untracked in
 * "Website Photos/"; derivatives land under public/.
 *
 * Usage:
 *   node scripts/build-photo-derivatives.mjs <outDir> "<original>=<slug>" ...
 *
 * Example:
 *   node scripts/build-photo-derivatives.mjs public/images/visits/india-aug-2026 \
 *     "Narayana Health Kolkata team Aug 2026.jpeg=narayana-kolkata-team-2026"
 *
 * Prints width, height and size for each file, which is what data/ needs.
 */
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const [outDir, ...pairs] = process.argv.slice(2);
if (!outDir || pairs.length === 0) {
  console.error('usage: build-photo-derivatives.mjs <outDir> "<original>=<slug>" ...');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

for (const pair of pairs) {
  const eq = pair.lastIndexOf('=');
  const original = pair.slice(0, eq);
  const slug = pair.slice(eq + 1);
  const out = join(outDir, `${slug}.webp`);
  const info = await sharp(join('Website Photos', original))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(out);
  console.log(`${slug}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
}
