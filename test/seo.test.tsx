import { render } from '@testing-library/react';
import { JsonLd } from '@/components/JsonLd';
import { FaqJsonLd } from '@/components/FaqJsonLd';
import sitemap from '@/app/sitemap';
import { site } from '@/data/site';
import nextConfig from '../next.config';

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

test('canonical host is the live clinic domain', () => {
  expect(site.url).toBe('https://www.mumbai-london-af.clinic');
});

test('sitemap lists all routes on canonical domain', () => {
  const entries = sitemap();
  const routes = entries.map((e) => new URL(e.url).pathname);
  expect(routes.sort()).toEqual(
    ['/', '/book', '/certifications', '/conditions', '/evidence', '/journey', '/team', '/testimonials'].sort(),
  );
  expect(entries.every((e) => e.url.startsWith(site.url))).toBe(true);
});

test('vercel.app production host redirects to the live clinic domain', async () => {
  const redirects = await nextConfig.redirects!();
  const hostRedirects = redirects.filter((r) =>
    r.has?.some((rule) => rule.type === 'host' && rule.value === 'mlafc.vercel.app'),
  );
  expect(hostRedirects.length).toBeGreaterThanOrEqual(2);
  expect(hostRedirects.every((r) => r.permanent && String(r.destination).startsWith(site.url))).toBe(true);
});
