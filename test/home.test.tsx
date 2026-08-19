import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { ComparisonCards } from '@/components/home/ComparisonCards';
import Home from '@/app/page';

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
  expect(screen.getAllByRole('link', { name: /see the evidence/i })[0]).toHaveAttribute('href', '/evidence');
  expect(screen.getByRole('link', { name: /book a consultation/i })).toHaveAttribute('href', '/book');
  // GMC guardrail: no superiority or superlative language anywhere in the section
  const text = document.body.textContent!.toLowerCase();
  for (const banned of [
    'safer than',
    'better than',
    'more effective than',
    'superior to',
    'superior',
    'safest',
    'most effective',
  ]) {
    expect(text).not.toContain(banned);
  }
});

test('home services list includes LAAO and cardioneuroablation with India expertise note', () => {
  render(<Home />);
  expect(screen.getByRole('link', { name: /left atrial appendage occlusion/i })).toHaveAttribute(
    'href',
    '/conditions#laao',
  );
  expect(screen.getByRole('link', { name: /cardioneuroablation for syncope/i })).toHaveAttribute(
    'href',
    '/conditions#cardioneuroablation',
  );
  expect(screen.getByText('LAAO with Amulet and Watchman')).toBeInTheDocument();
  expect(screen.getAllByText('Cardioneuroablation for syncope and dysautonomias').length).toBeGreaterThanOrEqual(2);
  expect(screen.getAllByText(/one of the only consultants in the country who can confirm and/i)).toHaveLength(2);
});
