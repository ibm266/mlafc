import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { JourneyTimeline } from '@/components/JourneyTimeline';
import { milestones } from '@/data/milestones';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('renders all timeline milestones with years and decorative placeholders', () => {
  render(<JourneyTimeline milestones={milestones} />);
  expect(screen.getAllByRole('article')).toHaveLength(8);
  for (const m of milestones) {
    expect(screen.getAllByText(m.yearLabel).length).toBeGreaterThan(0);
  }
  expect(screen.getAllByText(milestones[0].photoCaption).length).toBeGreaterThan(0);
});
