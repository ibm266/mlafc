import { render, screen } from '@testing-library/react';
import { LocationList } from '@/components/LocationList';
import locations from '@/data/locations.json';
import type { Location } from '@/data/types';

test('LocationList renders all locations grouped by country with role labels', () => {
  render(<LocationList locations={locations as Location[]} />);
  expect(screen.getByRole('heading', { name: 'United Kingdom' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'India' })).toBeInTheDocument();
  expect(screen.getAllByRole('listitem')).toHaveLength(34);
  expect(screen.getAllByText(/Operated|Taught|Proctored/).length).toBeGreaterThanOrEqual(34);
});
