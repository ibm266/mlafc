import { render } from '@testing-library/react';
import { JsonLd } from '@/components/JsonLd';
import sitemap from '@/app/sitemap';

test('JSON-LD declares Physician and MedicalClinic', () => {
  const { container } = render(<JsonLd />);
  const script = container.querySelector('script[type="application/ld+json"]')!;
  const data = JSON.parse(script.textContent!);
  const types = JSON.stringify(data);
  expect(types).toContain('Physician');
  expect(types).toContain('MedicalClinic');
});

test('sitemap lists all routes', () => {
  const routes = sitemap().map((e) => new URL(e.url).pathname);
  expect(routes.sort()).toEqual(
    ['/', '/book', '/conditions', '/evidence', '/journey', '/locations', '/testimonials'].sort(),
  );
});
