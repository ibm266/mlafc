import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PublicationCard } from '@/components/PublicationCard';
import { PublicationsGrid } from '@/components/PublicationsGrid';
import publications from '@/data/publications.json';
import type { Publication } from '@/data/types';

test('filters the publications grid and updates the count', async () => {
  const user = userEvent.setup();
  render(<PublicationsGrid />);
  expect(screen.getAllByRole('article')).toHaveLength(9);
  await user.click(screen.getByRole('button', { name: /clinical trials/i }));
  expect(screen.getAllByRole('article')).toHaveLength(2);
  expect(screen.getByText(/2 publications shown/i)).toBeInTheDocument();
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
