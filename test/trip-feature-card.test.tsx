import { render, screen } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { TripFeatureCard } from '@/components/home/TripFeatureCard';
import linksJson from '@/data/links.json';
import { latestTrip } from '@/data/trips';
import type { SiteLinks } from '@/data/types';

const feature = latestTrip.feature!;

// Derived from the data, so the expectations follow links.json rather than
// pinning today's count.
const story = (linksJson as SiteLinks).press.filter((item) => item.story === feature.storyId);
const syndicated = story.flatMap((item) => item.syndicated ?? []);
const outletCount = story.length + syndicated.length;

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('the card carries the anchor the hero ticker and the conditions chip link to', () => {
  const { container } = render(<TripFeatureCard feature={feature} />);
  const article = container.querySelector('article');
  expect(article).toHaveAttribute('id', 'india-first');
  expect(article).toHaveClass('scroll-mt-24');
});

test('the story renders: eyebrow, title and the quote with its attribution', () => {
  render(<TripFeatureCard feature={feature} />);
  expect(screen.getByRole('heading', { level: 3, name: feature.title })).toBeInTheDocument();
  expect(screen.getByText(feature.eyebrow)).toBeInTheDocument();
  expect(screen.getByText(feature.quote.text)).toBeInTheDocument();
  expect(screen.getByText(feature.quote.attribution)).toBeInTheDocument();
});

test('every fact is shown with its label', () => {
  render(<TripFeatureCard feature={feature} />);
  expect(feature.facts).toHaveLength(3);
  for (const fact of feature.facts) {
    expect(screen.getByText(fact.value)).toBeInTheDocument();
    expect(screen.getByText(fact.label)).toBeInTheDocument();
  }
});

test('the seal names the first and the diagram names the one sitting', () => {
  render(<TripFeatureCard feature={feature} />);
  expect(screen.getByRole('img', { name: /First in India/ })).toBeInTheDocument();
  expect(screen.getByRole('img', { name: new RegExp(feature.duration) })).toBeInTheDocument();
});

test('the press block counts every outlet that carried the story', () => {
  render(<TripFeatureCard feature={feature} />);
  expect(screen.getByText(`Reported by ${outletCount} outlets`)).toBeInTheDocument();
});

test('every direct report links out, named by its outlet', () => {
  render(<TripFeatureCard feature={feature} />);
  for (const item of story) {
    expect(screen.getByRole('link', { name: `Read the ${item.outlet} report` })).toHaveAttribute('href', item.url);
  }
  const indianExpress = story.find((item) => item.outlet === 'The Indian Express')!;
  const link = screen.getByRole('link', { name: /Indian Express/ });
  expect(link).toHaveAttribute('href', indianExpress.url);
  expect(link).toHaveAttribute('target', '_blank');
  expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  expect(screen.getByText(indianExpress.headline)).toBeInTheDocument();
  // A report in another language says so.
  expect(screen.getByText('In Marathi')).toBeInTheDocument();
});

test('every syndicated outlet gets its own chip, opening in a new tab', () => {
  render(<TripFeatureCard feature={feature} />);
  const anchors = screen.getAllByRole('link');
  expect(syndicated).toHaveLength(7);
  for (const outlet of syndicated) {
    const chip = anchors.find((anchor) => anchor.getAttribute('href') === outlet.url);
    expect(chip).toBeTruthy();
    expect(chip).toHaveTextContent(outlet.outlet);
    expect(chip).toHaveAttribute('target', '_blank');
  }
  expect(screen.getByText('Also carried by')).toBeInTheDocument();
});

test('the ways on point at the condition and the full press page', () => {
  render(<TripFeatureCard feature={feature} />);
  expect(screen.getByRole('link', { name: 'Book a consultation' })).toHaveAttribute('href', '/book');
  expect(screen.getByRole('link', { name: /all press coverage/i })).toHaveAttribute('href', '/testimonials#press');
});

test('the story comes before the evidence in the document, so it stacks that way on a phone', () => {
  const { container } = render(<TripFeatureCard feature={feature} />);
  const text = container.querySelector('article')?.textContent ?? '';
  const title = text.indexOf(feature.title);
  const seal = text.indexOf(feature.stamp.toUpperCase());
  const facts = text.indexOf(feature.facts[0].label);
  const press = text.indexOf('Reported by');
  expect(title).toBeGreaterThanOrEqual(0);
  expect(seal).toBeGreaterThan(title);
  expect(facts).toBeGreaterThan(seal);
  expect(press).toBeGreaterThan(facts);
});

test('has no axe violations', async () => {
  const { container } = render(<TripFeatureCard feature={feature} />);
  expect(await axe(container)).toHaveNoViolations();
});

test('the case study carries the family quote after the clinician quote', () => {
  render(<TripFeatureCard feature={feature} />);
  const text = document.body.textContent!;
  expect(text.indexOf(feature.quote.text)).toBeLessThan(text.indexOf(feature.patientQuote!.text));
  expect(screen.getByText(feature.patientQuote!.attribution)).toBeInTheDocument();
});
