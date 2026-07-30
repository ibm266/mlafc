import { act, render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { StatsBand } from '@/components/StatsBand';
import { VisitDates } from '@/components/VisitDates';
import { TestimonialCard } from '@/components/TestimonialCard';
import testimonials from '@/data/testimonials.json';
import visits from '@/data/visits.json';
import type { Testimonial, Visit } from '@/data/types';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('StatsBand shows the four headline numbers', () => {
  render(<StatsBand />);
  act(() => MockIntersectionObserver.instances.forEach((io) => io.trigger(true)));
  expect(screen.getByText('10,000')).toBeInTheDocument();
  expect(screen.getByText('300+')).toBeInTheDocument();
  expect(screen.getByText(/<1/)).toBeInTheDocument();
  expect(screen.getByText(/18/)).toBeInTheDocument();
  expect(screen.getByText(/350/)).toBeInTheDocument();
});

test('VisitDates renders one card per visit with status and booking link', () => {
  // A fixture rather than the live dates, so the three status styles stay
  // covered however the real visit calendar changes.
  const fixture: Visit[] = [
    { id: 'a', month: 'August 2026', status: 'waitlist', note: 'Fully booked.' },
    { id: 'b', month: '27 Sep to 4 Oct 2026', status: 'open', note: 'Filling fast.' },
    { id: 'c', month: 'March 2027', status: 'tbc', note: 'Dates to be confirmed.' },
  ];
  render(<VisitDates visits={fixture} />);
  expect(screen.getAllByRole('listitem')).toHaveLength(3);
  expect(screen.getByText('Booking open')).toBeInTheDocument();
  expect(screen.getByText('Waitlist')).toBeInTheDocument();
  expect(screen.getByText('TBC')).toBeInTheDocument();
  // Only a bookable visit offers a slot request, and it carries its own month
  // through to the enquiry form so nobody is asked for the date twice.
  expect(screen.getAllByRole('link', { name: /request a slot/i })).toHaveLength(1);
  expect(screen.getByRole('link', { name: /request a slot/i })).toHaveAttribute(
    'href',
    '/book?month=27%20Sep%20to%204%20Oct%202026#enquiry',
  );
});

test('the live visit calendar has bookable dates on the page', () => {
  render(<VisitDates visits={visits as Visit[]} />);
  expect(screen.getAllByRole('listitem')).toHaveLength((visits as Visit[]).length);
  expect(screen.getAllByText('Booking open').length).toBeGreaterThan(0);
});

test('TestimonialCard renders each category shape', () => {
  const byCat = (c: Testimonial['category']) => (testimonials as Testimonial[]).find((t) => t.category === c)!;
  const { rerender } = render(<TestimonialCard t={byCat('patient')} />);
  expect(screen.getByText(/Patient/)).toBeInTheDocument();
  rerender(<TestimonialCard t={byCat('news')} />);
  expect(screen.getByText('Health Dialogues')).toBeInTheDocument();
  rerender(<TestimonialCard t={byCat('hospital')} onOpenLetter={() => {}} />);
  expect(screen.getByRole('button', { name: /read full letter/i })).toBeInTheDocument();
});
