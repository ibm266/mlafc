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

test('publications dataset has twenty curated entries', () => {
  expect(pubs).toHaveLength(20);
  expect(pubs.filter((p) => p.featured)).toHaveLength(3);
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
