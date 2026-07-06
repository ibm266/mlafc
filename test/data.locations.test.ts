import locations from '@/data/locations.json';
import visits from '@/data/visits.json';
import { site } from '@/data/site';

test('locations: 12 entries with required fields', () => {
  expect(locations).toHaveLength(12);
  for (const l of locations) {
    expect(typeof l.id).toBe('string');
    expect(typeof l.name).toBe('string');
    expect(typeof l.city).toBe('string');
    expect(typeof l.country).toBe('string');
    expect(typeof l.region).toBe('string');
    expect(typeof l.lat).toBe('number');
    expect(typeof l.lng).toBe('number');
    expect(['operated', 'taught', 'proctored']).toContain(l.role);
    expect(typeof l.years).toBe('string');
    expect(l.blurb.length).toBeGreaterThan(20);
    expect(Array.isArray(l.images)).toBe(true);
  }
});

test('locations: Liverpool and Mumbai present; 5 UK pins', () => {
  const names = locations.map((l) => l.name);
  expect(names).toContain('Liverpool Heart and Chest Hospital');
  expect(names.some((n) => n.includes('Mumbai'))).toBe(true);
  expect(locations.filter((l) => l.country === 'United Kingdom')).toHaveLength(5);
});

test('visits: 3 entries with valid statuses', () => {
  expect(visits).toHaveLength(3);
  for (const v of visits) {
    expect(['open', 'waitlist', 'tbc']).toContain(v.status);
    expect(v.month).toMatch(/2026/);
  }
});

test('site config has contact placeholders', () => {
  expect(site.phone).toBe('[placeholder]');
  expect(site.whatsappNumber).toBe('[placeholder]');
  expect(site.whatsappHref).toBe('[placeholder]');
  expect(site.email).toBe('[placeholder]');
  expect(site.address).toContain('[placeholder]');
  expect(site.gmcLine).toMatch(/GMC/);
});
