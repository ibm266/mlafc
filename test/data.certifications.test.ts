import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { certifications, certificationSections } from '@/data/certifications';
import type { CertificationCategory } from '@/data/types';

const ROOT = join(import.meta.dirname, '..');
const CATEGORIES: CertificationCategory[] = ['india', 'uk', 'fellowships', 'recognition'];

test('four wall sections, one per category, in chronological order', () => {
  expect(certificationSections.map((s) => s.id)).toEqual(CATEGORIES);
  for (const section of certificationSections) {
    expect(section.label.length).toBeGreaterThan(3);
    expect(section.blurb.length).toBeGreaterThan(20);
  }
});

test('every certification is complete and well formed', () => {
  expect(certifications.length).toBeGreaterThanOrEqual(6);

  const ids = new Set<string>();
  for (const c of certifications) {
    expect(c.id).toMatch(/^[a-z0-9-]+$/);
    expect(ids.has(c.id)).toBe(false);
    ids.add(c.id);

    expect(c.postnominal.length).toBeGreaterThan(1);
    expect(c.title.length).toBeGreaterThan(3);
    expect(c.awardingBody.length).toBeGreaterThan(3);
    expect(c.year).toMatch(/\d{4}/);
    expect(CATEGORIES).toContain(c.category);
    expect(['scan', 'plate']).toContain(c.kind);
    expect(c.story.length).toBeGreaterThanOrEqual(1);
    for (const paragraph of c.story) expect(paragraph.length).toBeGreaterThan(20);
  }
});

test('every category used by an item has a matching section', () => {
  const used = new Set(certifications.map((c) => c.category));
  for (const category of used) {
    expect(certificationSections.some((s) => s.id === category)).toBe(true);
  }
});

test('scan entries carry an image whose file exists on disk', () => {
  const scans = certifications.filter((c) => c.kind === 'scan');
  expect(scans.length).toBeGreaterThanOrEqual(6);

  for (const c of scans) {
    expect(c.image).toBeDefined();
    const image = c.image!;
    expect(image.src.startsWith('/images/certificates/')).toBe(true);
    expect(image.width).toBeGreaterThan(0);
    expect(image.height).toBeGreaterThan(0);
    expect(image.alt.length).toBeGreaterThan(20);

    const filePath = join(ROOT, 'public', image.src);
    expect(existsSync(filePath), `missing image file for ${c.id}: ${image.src}`).toBe(true);
  }
});

test('the CCT entry links to the public GMC register for verification', () => {
  const cct = certifications.find((c) => c.id === 'cct-pmetb-2006');
  expect(cct?.verify?.url).toContain('gmc-uk.org');
});
