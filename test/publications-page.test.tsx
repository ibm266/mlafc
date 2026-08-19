import { render, screen } from '@testing-library/react';
import { PublicationCard } from '@/components/PublicationCard';
import publications from '@/data/publications.json';
import type { Publication } from '@/data/types';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';

const pubs = publications as Publication[];

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('publications dataset has curated entries with urls', () => {
  expect(pubs.length).toBeGreaterThanOrEqual(20);
  expect(pubs.filter((p) => p.featured)).toHaveLength(3);
  expect(pubs.every((p) => p.url)).toBe(true);
});

test('publications include the LAAO and cardioneuroablation papers', () => {
  expect(pubs.some((p) => p.id === 'pub21')).toBe(true);
  expect(pubs.some((p) => p.id === 'pub22')).toBe(true);
  expect(pubs.some((p) => p.id === 'pub23')).toBe(true);
  expect(pubs.find((p) => p.id === 'pub21')?.url).toBe('https://doi.org/10.1016/j.tcm.2023.11.003');
  expect(pubs.find((p) => p.id === 'pub22')?.url).toBe('https://doi.org/10.1111/jce.70111');
});

test('PublicationCard links out when url is provided', () => {
  render(<PublicationCard p={pubs[0]} />);
  expect(screen.getByRole('link', { name: /read paper/i })).toHaveAttribute(
    'href',
    'https://doi.org/10.1016/j.hrthm.2024.05.032',
  );
  expect(screen.getByText(/Heart Rhythm/)).toBeInTheDocument();
});

test('PublicationCard shows lay summary', () => {
  render(<PublicationCard p={pubs[1]} />);
  expect(screen.getByText(/quarter-century review of how stroke prevention/i)).toBeInTheDocument();
});
