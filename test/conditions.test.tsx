import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import ConditionsPage from '@/app/conditions/page';
import { conditions } from '@/data/conditions';
import { latestTrip } from '@/data/trips';

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

test('conditions page renders LAAO section with ECG animation', () => {
  render(<ConditionsPage />);
  const laao = conditions.find((c) => c.id === 'laao')!;
  expect(screen.getByRole('heading', { name: laao.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: laao.videoAlt })).toBeInTheDocument();
  expect(screen.getByText(/Amulet or a Watchman/i)).toBeInTheDocument();
  expect(screen.getAllByText(/one of the only consultants in the country/i).length).toBeGreaterThan(0);
  expect(screen.getByRole('link', { name: /concurrent percutaneous left atrial appendage occlusion/i })).toHaveAttribute(
    'href',
    'https://doi.org/10.1016/j.tcm.2023.11.003',
  );
  expect(screen.getByRole('link', { name: /pulsed-field ablation on the left atrial appendage diameter/i })).toHaveAttribute(
    'href',
    'https://doi.org/10.1111/jce.70111',
  );
  expect(screen.getByRole('link', { name: /India's first combined PFA and LAAO/i })).toHaveAttribute(
    'href',
    '/conditions#india-first',
  );
});

test('the India first case study sits on the conditions page under LAAO', () => {
  render(<ConditionsPage />);
  const feature = latestTrip.feature!;
  const card = document.getElementById(feature.id)!;
  expect(card).toBeInTheDocument();
  expect(card.textContent).toContain(feature.quote.text);
  // The case study follows the LAAO guide, not any other condition.
  const laao = document.getElementById('laao')!;
  expect(laao.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  const cna = document.getElementById('cardioneuroablation')!;
  expect(card.compareDocumentPosition(cna) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  expect(screen.getByRole('heading', { name: /First in India, in practice/i })).toBeInTheDocument();
});

test('conditions page renders cardioneuroablation section with ECG animation', () => {
  render(<ConditionsPage />);
  const cna = conditions.find((c) => c.id === 'cardioneuroablation')!;
  expect(screen.getByRole('heading', { name: cna.title })).toBeInTheDocument();
  expect(screen.getByRole('figure', { name: cna.videoAlt })).toBeInTheDocument();
  expect(screen.getByText(/syncope or dysautonomia/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /cardioneuroablation for vasovagal syncope/i })).toHaveAttribute(
    'href',
    'https://doi.org/10.1111/jce.15480',
  );
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
