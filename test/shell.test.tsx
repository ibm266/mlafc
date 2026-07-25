import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FloatingBookingPill } from '@/components/FloatingBookingPill';

test('Nav renders section links and the booking CTA', () => {
  render(<Nav />);
  for (const label of ['Conditions', 'The Evidence', 'The Journey', 'Voices']) {
    expect(screen.getAllByRole('link', { name: label }).length).toBeGreaterThan(0);
  }
  expect(screen.getAllByRole('link', { name: /book a consultation/i })[0]).toHaveAttribute('href', '/book');
});

test('mobile menu traps focus and closes on Escape', async () => {
  const user = userEvent.setup();
  render(<Nav />);

  const menuButton = screen.getByRole('button', { name: /open menu/i });
  await user.click(menuButton);

  expect(screen.getByRole('navigation', { name: /mobile/i })).toBeInTheDocument();
  await waitFor(() => expect(screen.getAllByRole('link', { name: 'Conditions' }).at(-1)).toHaveFocus());

  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(screen.getAllByRole('link', { name: /book a consultation/i }).at(-1)).toHaveFocus();

  await user.keyboard('{Tab}');
  expect(screen.getAllByRole('link', { name: 'Conditions' }).at(-1)).toHaveFocus();

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
  expect(menuButton).toHaveFocus();
});

test('Footer carries GMC line and disclaimer', () => {
  render(<Footer />);
  expect(screen.getAllByText(/General Medical Council/).length).toBeGreaterThan(0);
  expect(screen.getByText(/not a substitute for individual medical advice/)).toBeInTheDocument();
});

test('booking pill collapses to a labelled circle that still points at the enquiry form', async () => {
  const user = userEvent.setup();
  window.sessionStorage.clear();
  render(<FloatingBookingPill />);

  expect(screen.getByRole('link', { name: /next mumbai visit|book a consultation/i })).toHaveAttribute('href', '/book');

  await user.click(screen.getByRole('button', { name: /collapse the booking prompt/i }));

  expect(screen.queryByRole('button', { name: /collapse the booking prompt/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /send an enquiry/i })).toHaveAttribute('href', '/book');
  expect(window.sessionStorage.getItem('mlafc:booking-pill-collapsed')).toBe('1');
});

test('booking pill stays collapsed for the rest of the session', () => {
  window.sessionStorage.setItem('mlafc:booking-pill-collapsed', '1');
  render(<FloatingBookingPill />);

  expect(screen.getByRole('link', { name: /send an enquiry/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /collapse the booking prompt/i })).not.toBeInTheDocument();
  window.sessionStorage.clear();
});
