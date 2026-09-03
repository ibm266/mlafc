import { fireEvent, render, screen, within } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import ConditionsPage from '@/app/conditions/page';
import { conditions } from '@/data/conditions';
import publicationsJson from '@/data/publications.json';
import type { Publication } from '@/data/types';
import { latestTrip } from '@/data/trips';

const publications = publicationsJson as Publication[];

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
  // The papers sit folded under the guide as a gallery of cards, each led by
  // its plain-language name, with the COCONUT study first.
  const laaoSection = within(document.getElementById('laao')!);
  expect(laaoSection.queryByRole('article')).toBeNull();
  fireEvent.click(laaoSection.getByRole('button', { name: /related publications/i }));
  const hrefs = laaoSection.getAllByRole('link', { name: /read paper/i }).map((a) => a.getAttribute('href'));
  expect(hrefs[0]).toBe('https://doi.org/10.1093/europace/euag198');
  expect(hrefs).toContain('https://doi.org/10.1016/j.tcm.2023.11.003');
  expect(hrefs).toContain('https://doi.org/10.1111/jce.70111');
  expect(laaoSection.getByRole('heading', { level: 4, name: /PFA and LAAO in one procedure/i })).toBeInTheDocument();
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
  const cnaSection = within(document.getElementById('cardioneuroablation')!);
  fireEvent.click(cnaSection.getByRole('button', { name: /related publications/i }));
  expect(cnaSection.getAllByRole('link', { name: /read paper/i }).map((a) => a.getAttribute('href'))).toContain(
    'https://doi.org/10.1111/jce.15480',
  );
});

test('every condition folds its related papers under the guide', () => {
  render(<ConditionsPage />);
  for (const condition of conditions) {
    const ids = condition.publicationIds ?? [];
    expect(ids.length, condition.id).toBeGreaterThan(0);
    for (const id of ids) {
      expect(publications.some((p) => p.id === id), `${condition.id} lists ${id}`).toBe(true);
    }

    const section = within(document.getElementById(condition.id)!);
    const toggle = section.getByRole('button', { name: /related publications/i });
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(section.queryByRole('article')).toBeNull();

    fireEvent.click(toggle);
    expect(section.getAllByRole('article')).toHaveLength(ids.length);
    // Cards lead with the plain-language name, in the data's order, and keep
    // the published title out of the heading.
    const first = publications.find((p) => p.id === ids[0])!;
    const headings = section.getAllByRole('heading', { level: 4 }).map((h) => h.textContent);
    expect(headings[0]).toBe(first.plainTitle);
    expect(section.queryByRole('heading', { level: 4, name: first.title })).toBeNull();
  }
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
