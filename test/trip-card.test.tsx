import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { TripCard } from '@/components/home/TripCard';
import linksJson from '@/data/links.json';
import { latestTrip } from '@/data/trips';
import type { SiteLinks } from '@/data/types';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

const links = linksJson as SiteLinks;
const feature = latestTrip.feature!;
/** The same sum the card makes: direct reports plus every syndicated pickup. */
const story = links.press.filter((item) => item.story === feature.storyId);
const outletCount = story.length + story.flatMap((item) => item.syndicated ?? []).length;

test('every stop on the route gets a chip, in travel order', () => {
  render(<TripCard trip={latestTrip} />);
  const tabs = screen.getAllByRole('tab');
  expect(tabs).toHaveLength(6);
  for (const name of ['Mumbai', 'Kolkata', 'Hyderabad', 'Chennai', 'Trichy', 'Bengaluru']) {
    expect(screen.getByRole('tab', { name: new RegExp(name) })).toBeInTheDocument();
  }
});

test('the first stop is selected on arrival, with its hospital', () => {
  render(<TripCard trip={latestTrip} />);
  expect(screen.getByRole('tab', { name: /Mumbai/ })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Lilavati Hospital and Research Centre');
});

test('choosing Kolkata shows its hospital', () => {
  render(<TripCard trip={latestTrip} />);
  fireEvent.click(screen.getByRole('tab', { name: /Kolkata/ }));

  expect(screen.getByRole('tab', { name: /Kolkata/ })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveTextContent('Narayana Health');
});

test('the arrow keys walk along the chips', () => {
  render(<TripCard trip={latestTrip} />);
  const kolkata = screen.getByRole('tab', { name: /Kolkata/ });
  fireEvent.click(kolkata);
  fireEvent.keyDown(kolkata, { key: 'ArrowRight' });

  expect(screen.getByRole('tab', { name: /Hyderabad/ })).toHaveAttribute('aria-selected', 'true');
  expect(kolkata).toHaveAttribute('aria-selected', 'false');
});

test('the stats row carries the headline numbers of the visit', () => {
  render(<TripCard trip={latestTrip} />);
  expect(screen.getByText('days')).toBeInTheDocument();
  expect(screen.getByText('cities')).toBeInTheDocument();
  expect(screen.getByText('hospitals')).toBeInTheDocument();
});

test('the map reads its route out for a screen reader', () => {
  render(<TripCard trip={latestTrip} />);
  const map = screen.getByRole('img', { name: /Route of the/ });
  expect(map).toHaveAccessibleName(/Mumbai/);
  expect(map).toHaveAccessibleName(/Kolkata/);
});

test('the headline moment links through to the full case study', () => {
  render(<TripCard trip={latestTrip} />);
  expect(screen.getByRole('heading', { name: feature.title })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Read the full case/ })).toHaveAttribute(
    'href',
    '/conditions#india-first',
  );
});

test('the press link counts the outlets in the links data', () => {
  render(<TripCard trip={latestTrip} />);
  expect(outletCount).toBe(10);
  expect(screen.getByRole('link', { name: new RegExp(`Reported by ${outletCount} outlets`) })).toHaveAttribute(
    'href',
    '/testimonials#press',
  );
});

test('the chips are the one tab list a screen reader hears', () => {
  render(<TripCard trip={latestTrip} />);
  const rails = screen.getAllByRole('tablist');
  expect(rails).toHaveLength(1);
  expect(rails[0]).toHaveAccessibleName('Stops on the visit');
});

test('has no axe violations', async () => {
  const { container } = render(<TripCard trip={latestTrip} />);
  expect(await axe(container)).toHaveNoViolations();
});
