import { render, screen } from '@testing-library/react';
import { PublicationsList } from '@/components/PublicationsList';
import { PublicationCard } from '@/components/PublicationCard';
import publications from '@/data/publications.json';
import type { Publication } from '@/data/types';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('PublicationsList renders all nine publications', () => {
  render(<PublicationsList publications={publications as Publication[]} />);
  expect(screen.getAllByRole('listitem')).toHaveLength(9);
  expect(screen.getByText(/Pulsed field versus radiofrequency ablation/i)).toBeInTheDocument();
});

test('PublicationCard shows placeholder when no url is set', () => {
  render(<PublicationCard p={(publications as Publication[])[0]} />);
  expect(screen.getByText(/paper link coming soon/i)).toBeInTheDocument();
  expect(screen.getByText(/Europace/)).toBeInTheDocument();
});

test('PublicationCard links out when url is provided', () => {
  const withUrl: Publication = {
    ...(publications as Publication[])[0],
    url: 'https://example.com/paper',
  };
  render(<PublicationCard p={withUrl} />);
  expect(screen.getByRole('link', { name: /read paper/i })).toHaveAttribute('href', 'https://example.com/paper');
});
