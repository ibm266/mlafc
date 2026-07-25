import locations from '@/data/locations.json';
import visits from '@/data/visits.json';
import { site } from '@/data/site';

test('locations: training and procedure entries with required fields', () => {
  expect(locations.length).toBeGreaterThanOrEqual(34);
  for (const l of locations) {
    expect(typeof l.id).toBe('string');
    expect(typeof l.name).toBe('string');
    expect(typeof l.city).toBe('string');
    expect(typeof l.country).toBe('string');
    expect(typeof l.region).toBe('string');
    expect(['India', 'United Kingdom', 'Europe', 'United States', 'Asia']).toContain(l.region);
    expect(typeof l.lat).toBe('number');
    expect(typeof l.lng).toBe('number');
    expect(['operated', 'taught', 'proctored']).toContain(l.role);
    expect(typeof l.years).toBe('string');
    expect(typeof l.url).toBe('string');
    expect(l.blurb.length).toBeGreaterThan(20);
    expect(Array.isArray(l.images)).toBe(true);
  }
});

test('locations: procedure cities and India training cities present', () => {
  const names = locations.map((l) => l.name);
  const cities = locations.map((l) => l.city);
  expect(names).toContain('Liverpool Heart and Chest Hospital');
  expect(names.some((n) => n.includes('Mumbai'))).toBe(true);
  expect(cities).toEqual(expect.arrayContaining(['London', 'Liverpool', 'Mumbai', 'Delhi', 'Pondicherry', 'Kolkata']));
  expect(locations.filter((l) => l.role === 'operated')).toHaveLength(4);
  expect(locations.filter((l) => l.country === 'United Kingdom').length).toBeGreaterThanOrEqual(7);
  expect(names).toContain('All India Institute of Medical Sciences');
  expect(names).toContain('Lilavati Hospital');
  expect(cities).toEqual(expect.arrayContaining(['Hyderabad', 'Bengaluru', 'Pune', 'Prague', 'Sydney']));
});

test('visits: confirmed 2026 dates with valid statuses', () => {
  expect(visits).toHaveLength(4);
  for (const v of visits) {
    expect(['open', 'waitlist', 'tbc']).toContain(v.status);
    expect(v.month).toMatch(/2026/);
    // Dates are confirmed now, so no bracketed stubs should survive here.
    expect(v.month).not.toMatch(/[[\]]/);
    expect(v.note).not.toMatch(/placeholder/i);
  }
  // At least one bookable visit, otherwise the booking pill has nothing to point at.
  expect(visits.some((v) => v.status === 'open')).toBe(true);
});

test('site config has contact placeholders', () => {
  expect(site.phone).toBe('[placeholder]');
  // WhatsApp is not set up yet, so the site carries no WhatsApp channel at all.
  expect(Object.keys(site)).not.toContain('whatsappHref');
  // email is live: enquiries are forwarded here and it is shown on the book page.
  expect(site.email).toBe('contact@mumbai-london-af.clinic');
  // address is live: the clinic runs from Lilavati Hospital, Bandra West.
  expect(site.address).toContain('Lilavati Hospital');
  expect(site.address).not.toContain('[placeholder]');
  expect(site.gmcLine).toMatch(/GMC/);
});
