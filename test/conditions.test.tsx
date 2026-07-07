import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import ConditionsPage from '@/app/conditions/page';
import { conditions } from '@/data/conditions';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('conditions page renders AF section with ECG animation', () => {
  render(<ConditionsPage />);
  expect(screen.getByRole('heading', { name: /your heart, explained/i })).toBeInTheDocument();
  expect(screen.getByText(/Put your heart in the most experienced hands/i)).toBeInTheDocument();
  const af = conditions.find((c) => c.id === 'af')!;
  expect(screen.getByRole('heading', { name: af.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: af.videoAlt })).toBeInTheDocument();
});

test('conditions page renders atrial flutter section with ECG animation', () => {
  render(<ConditionsPage />);
  const flutter = conditions.find((c) => c.id === 'atrial-flutter')!;
  expect(screen.getByRole('heading', { name: flutter.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: flutter.videoAlt })).toBeInTheDocument();
});

test('conditions page renders SVT section with ECG animation', () => {
  render(<ConditionsPage />);
  const svt = conditions.find((c) => c.id === 'svt')!;
  expect(screen.getByRole('heading', { name: svt.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: svt.videoAlt })).toBeInTheDocument();
});

test('conditions page renders palpitations section with ECG animation', () => {
  render(<ConditionsPage />);
  const palpitations = conditions.find((c) => c.id === 'palpitations')!;
  expect(screen.getByRole('heading', { name: palpitations.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: palpitations.videoAlt })).toBeInTheDocument();
});

test('conditions page renders blackouts section with ECG animation', () => {
  render(<ConditionsPage />);
  const blackouts = conditions.find((c) => c.id === 'blackouts-dizziness')!;
  expect(screen.getByRole('heading', { name: blackouts.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: blackouts.videoAlt })).toBeInTheDocument();
});

test('conditions page renders bradycardia section with ECG animation', () => {
  render(<ConditionsPage />);
  const bradycardia = conditions.find((c) => c.id === 'bradycardia')!;
  expect(screen.getByRole('heading', { name: bradycardia.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: bradycardia.videoAlt })).toBeInTheDocument();
});

test('every condition has an ECG animation variant', () => {
  for (const condition of conditions) {
    expect(condition.ecgVariant, condition.id).toBeTruthy();
  }
  render(<ConditionsPage />);
  for (const condition of conditions) {
    expect(screen.getByRole('figure', { name: condition.videoAlt })).toBeInTheDocument();
  }
});
