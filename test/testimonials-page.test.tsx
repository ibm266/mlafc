import { render, screen } from '@testing-library/react';
import { VoicesContent } from '@/components/VoicesContent';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('Voices page renders hospital letter, patients, peers, and press', () => {
  render(<VoicesContent />);
  expect(screen.getByText(/What his own institutions put in writing/i)).toBeInTheDocument();
  expect(screen.getByText(/It was a landmark day in our catheterization lab/)).toBeInTheDocument();
  expect(screen.getByText(/The people he has treated/i)).toBeInTheDocument();
  expect(screen.getByText(/The doctors who refer to him/i)).toBeInTheDocument();
  expect(screen.getByText(/Covered across India/i)).toBeInTheDocument();
  expect(screen.getByText(/Health Dialogues/)).toBeInTheDocument();
  expect(screen.getByText(/The Indian Express/)).toBeInTheDocument();
});
