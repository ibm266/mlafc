import { render } from '@testing-library/react';
import { JsonLd } from '@/components/JsonLd';
import { FaqJsonLd } from '@/components/FaqJsonLd';
import sitemap from '@/app/sitemap';
import { site } from '@/data/site';

test('JSON-LD declares Physician and MedicalClinic', () => {
  const { container } = render(<JsonLd />);
  const script = container.querySelector('script[type="application/ld+json"]')!;
  const data = JSON.parse(script.textContent!);
  const types = JSON.stringify(data);
  expect(types).toContain('Physician');
  expect(types).toContain('MedicalClinic');
});

test('FAQ JSON-LD declares FAQPage with all questions', () => {
  const { container } = render(<FaqJsonLd />);
  const script = container.querySelector('script[type="application/ld+json"]')!;
  const data = JSON.parse(script.textContent!);
  expect(data['@type']).toBe('FAQPage');
  expect(data.mainEntity).toHaveLength(6);
});

test('sitemap lists all routes on canonical domain', () => {
  const entries = sitemap();
  const routes = entries.map((e) => new URL(e.url).pathname);
  expect(routes.sort()).toEqual(
    ['/', '/book', '/conditions', '/evidence', '/journey', '/testimonials'].sort(),
  );
  expect(entries.every((e) => e.url.startsWith(site.url))).toBe(true);
});
