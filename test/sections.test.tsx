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
  render(<VisitDates visits={visits as Visit[]} />);
  expect(screen.getByText('Booking open')).toBeInTheDocument();
  expect(screen.getByText('Waitlist')).toBeInTheDocument();
  expect(screen.getByText('TBC')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /request a slot/i })).toHaveAttribute('href', '/book');
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
