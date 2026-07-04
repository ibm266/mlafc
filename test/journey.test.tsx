import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { milestones } from '@/data/milestones';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('renders all 10 milestones with years and decorative placeholders', () => {
  render(<JourneyTimeline milestones={milestones} />);
  expect(screen.getAllByRole('article')).toHaveLength(10);
  for (const m of milestones) {
    expect(screen.getAllByText(m.yearLabel).length).toBeGreaterThan(0);
  }
  expect(screen.getAllByText(milestones[0].photoTitle).length).toBeGreaterThan(0);
});
