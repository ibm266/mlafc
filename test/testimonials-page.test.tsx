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
  expect(screen.getByText(/It gives me great pleasure to write in support/)).toBeInTheDocument();
  expect(screen.getByText(/The people he has treated/i)).toBeInTheDocument();
  expect(screen.getByText(/The doctors who refer to him/i)).toBeInTheDocument();
  expect(screen.getByText(/Covered across India, March 2025/i)).toBeInTheDocument();
  expect(screen.getByText(/The Indian Express/)).toBeInTheDocument();
});
