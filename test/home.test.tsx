import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { ComparisonCards } from '@/components/home/ComparisonCards';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('comparison section presents both technologies factually and elevates the operator', () => {
  render(<ComparisonCards />);
  expect(screen.getByText(/Two technologies\./)).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /radiofrequency ablation/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /pulsed field ablation/i })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: /the operator/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /see the evidence/i })).toHaveAttribute('href', '/evidence');
  // GMC guardrail: no superiority language anywhere in the section
  const text = document.body.textContent!.toLowerCase();
  for (const banned of ['safer than', 'better than', 'more effective than', 'superior to']) {
    expect(text).not.toContain(banned);
  }
});
