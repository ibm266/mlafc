import { fireEvent, render, screen } from '@testing-library/react';
import { VoicesContent } from '@/components/VoicesContent';
import linksJson from '@/data/links.json';
import type { SiteLinks } from '@/data/types';
import { installDialogMock, MockIntersectionObserver, mockReducedMotion } from './mocks';

const links = linksJson as SiteLinks;

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
  installDialogMock();
});

test('Voices page renders featured gallery, grids, and press', () => {
  render(<VoicesContent />);
  expect(screen.getByRole('region', { name: 'Featured voices' })).toBeInTheDocument();
  expect(screen.getAllByText(/What his own institutions put in writing/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/The people he has treated/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/The doctors who refer to him/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getByRole('button', { name: /see all hospitals/i })).toBeInTheDocument();

  fireEvent.click(screen.getByRole('tab', { name: /from patients/i }));
  expect(screen.getByRole('button', { name: /see all patients/i })).toBeInTheDocument();

  expect(screen.getByText(/Covered across India/i)).toBeInTheDocument();
  expect(screen.getByText(/Health Dialogues/)).toBeInTheDocument();
  expect(screen.getAllByText(/The Indian Express/).length).toBeGreaterThan(0);
});

test('Read more opens a dialog with the full review', () => {
  render(<VoicesContent />);
  const readMoreButtons = screen.getAllByRole('button', { name: /read more/i });
  fireEvent.click(readMoreButtons[0]!);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});

test('the press section is anchorable and carries the ANI story with its syndication', () => {
  const { container } = render(<VoicesContent />);

  // /testimonials#press has to land on the section, so the id must survive.
  const press = container.querySelector('section#press');
  expect(press).not.toBeNull();

  // Some carrier URLs hold query strings that a CSS attribute selector cannot
  // match, so match on the attribute value itself.
  const anchors = [...container.querySelectorAll('a')];
  const byHref = (href: string) => anchors.find((a) => a.getAttribute('href') === href);

  const ani = links.press.find((p) => p.outlet === 'ANI')!;
  expect(byHref(ani.url)).toBeDefined();
  expect(screen.getByText('Also carried by')).toBeInTheDocument();

  const carriers = ani.syndicated ?? [];
  expect(carriers.length).toBeGreaterThanOrEqual(7);
  for (const carrier of carriers) {
    const link = byHref(carrier.url);
    expect(link, carrier.outlet).toBeDefined();
    expect(link).toHaveAttribute('target', '_blank');
  }
});
