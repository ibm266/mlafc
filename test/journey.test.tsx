import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { milestones } from '@/data/milestones';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('renders all 10 milestones with years and photo placeholders', () => {
  render(<JourneyTimeline milestones={milestones} />);
  expect(screen.getAllByRole('article')).toHaveLength(10);
  for (const m of milestones) {
    expect(screen.getAllByText(m.yearLabel).length).toBeGreaterThan(0);
  }
  // photo placeholder labels exist (desktop frame + inline mobile frames)
  expect(screen.getAllByText(/photograph/i).length).toBeGreaterThan(0);
});
