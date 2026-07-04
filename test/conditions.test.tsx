import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import ConditionsPage from '@/app/conditions/page';
import { conditions } from '@/data/conditions';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('conditions page renders AF section with poster fallback', () => {
  render(<ConditionsPage />);
  expect(screen.getByRole('heading', { name: /your heart, explained/i })).toBeInTheDocument();
  expect(screen.getByText('Put your heart in the most experienced hands.')).toBeInTheDocument();
  const af = conditions.find((c) => c.id === 'af')!;
  expect(screen.getByRole('heading', { name: af.title })).toBeInTheDocument();
  expect(screen.getByAltText(af.videoAlt)).toBeInTheDocument();
});

test('conditions page renders atrial flutter section with poster fallback', () => {
  render(<ConditionsPage />);
  const flutter = conditions.find((c) => c.id === 'atrial-flutter')!;
  expect(screen.getByRole('heading', { name: flutter.title })).toBeInTheDocument();
  expect(screen.getByAltText(flutter.videoAlt)).toBeInTheDocument();
});
