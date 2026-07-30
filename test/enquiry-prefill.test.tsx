import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import BookPage from '@/app/book/page';
import { bookHrefForVisit } from '@/components/VisitDates';
import visitsJson from '@/data/visits.json';
import type { Visit } from '@/data/types';

const visits = visitsJson as Visit[];
const bookable = visits.find((visit) => visit.status === 'open')!;

function visitBookPageWith(query: string) {
  window.history.replaceState({}, '', `/book${query}`);
}

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
  visitBookPageWith('');
});

afterAll(() => visitBookPageWith(''));

test('a call to action carrying a visit date builds a link the form can read', () => {
  const href = bookHrefForVisit(bookable);

  expect(href.startsWith('/book?month=')).toBe(true);
  expect(href.endsWith('#enquiry')).toBe(true);
  expect(new URL(href, 'https://example.com').searchParams.get('month')).toBe(bookable.month);
});

test('arriving with a visit month preselects it in the form', async () => {
  visitBookPageWith(`?month=${encodeURIComponent(bookable.month)}`);
  render(<BookPage />);

  const month = await screen.findByLabelText<HTMLSelectElement>(/preferred visit month/i);
  expect(month.value).toBe(bookable.month);
});

test('arriving without a month leaves the reader to choose', async () => {
  render(<BookPage />);

  const month = screen.getByLabelText<HTMLSelectElement>(/preferred visit month/i);
  expect(month.value).toBe('');
});

test('a month that is not a real visit is ignored rather than trusted', async () => {
  visitBookPageWith('?month=Whenever%20I%20like%202099');
  render(<BookPage />);

  const month = screen.getByLabelText<HTMLSelectElement>(/preferred visit month/i);
  expect(month.value).toBe('');
});

test('picking a second visit from the cards below the form moves the month', async () => {
  const other = visits.filter((visit) => visit.status === 'open')[1]!;

  visitBookPageWith(`?month=${encodeURIComponent(bookable.month)}`);
  const { rerender } = render(<BookPage />);

  const month = await screen.findByLabelText<HTMLSelectElement>(/preferred visit month/i);
  expect(month.value).toBe(bookable.month);

  // What a client-side navigation to another dated call to action looks like.
  visitBookPageWith(`?month=${encodeURIComponent(other.month)}`);
  rerender(<BookPage />);

  expect(month.value).toBe(other.month);
});

test('a month the reader chose by hand survives a re-render', async () => {
  const user = userEvent.setup();
  visitBookPageWith(`?month=${encodeURIComponent(bookable.month)}`);
  const { rerender } = render(<BookPage />);

  const month = await screen.findByLabelText<HTMLSelectElement>(/preferred visit month/i);
  await user.selectOptions(month, 'August 2026');
  expect(month.value).toBe('August 2026');

  rerender(<BookPage />);
  expect(month.value).toBe('August 2026');
});

test('the enquiry form is anchored so a dated call to action lands on it', () => {
  render(<BookPage />);
  expect(document.getElementById('enquiry')).not.toBeNull();
});
