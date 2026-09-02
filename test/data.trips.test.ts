import { existsSync } from 'node:fs';
import { join } from 'node:path';
import linksJson from '@/data/links.json';
import { latestTrip, trips } from '@/data/trips';
import type { SiteLinks } from '@/data/types';

const links = linksJson as SiteLinks;

test('every route stop resolves to a city on the same trip', () => {
  for (const trip of trips) {
    const ids = new Set(trip.cities.map((c) => c.id));
    expect(ids.size, `${trip.id} has duplicate city ids`).toBe(trip.cities.length);
    for (const stop of trip.route) {
      expect(ids.has(stop), `${trip.id} route stop ${stop}`).toBe(true);
    }
  }
});

test('a photograph tagged with a city points at a real stop', () => {
  for (const trip of trips) {
    const ids = new Set(trip.cities.map((c) => c.id));
    for (const photo of trip.photos) {
      if (!photo.cityId) continue;
      expect(ids.has(photo.cityId), `${trip.id} photo ${photo.id}`).toBe(true);
    }
  }
});

test('every visit photograph exists under public/', () => {
  for (const trip of trips) {
    for (const photo of trip.photos) {
      expect(existsSync(join(process.cwd(), 'public', photo.src)), photo.src).toBe(true);
    }
  }
});

test('a feature story id is backed by press coverage', () => {
  for (const trip of trips) {
    const storyId = trip.feature?.storyId;
    if (!storyId) continue;
    const coverage = links.press.filter((p) => p.story === storyId);
    expect(coverage.length, `${trip.id} feature story ${storyId}`).toBeGreaterThan(0);
  }
});

test('latestTrip is the first trip, so the home page never shows an old visit', () => {
  expect(trips.length).toBeGreaterThan(0);
  expect(latestTrip).toBe(trips[0]);
});
