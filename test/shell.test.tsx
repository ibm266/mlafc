import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { FloatingBookingPill } from '@/components/FloatingBookingPill';
import { WhatsAppFab } from '@/components/WhatsAppFab';

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

  // Wrapping backwards lands on the last thing in the menu, the WhatsApp link.
  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(screen.getByRole('link', { name: /whatsapp \+91 81695 23196/i })).toHaveFocus();

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

test('Footer offers the clinic line, WhatsApp and email', () => {
  render(<Footer />);

  expect(screen.getByRole('link', { name: '+91 81695 23196' })).toHaveAttribute('href', 'tel:+918169523196');
  expect(
    screen.getByRole('link', { name: /whatsapp \+91 81695 23196/i }).getAttribute('href'),
  ).toMatch(/^https:\/\/wa\.me\/918169523196\?text=/);
  expect(screen.getByRole('link', { name: /contact@mumbai-london-af\.clinic/i })).toHaveAttribute(
    'href',
    'mailto:contact@mumbai-london-af.clinic',
  );
});

test('mobile menu carries the call and WhatsApp links', async () => {
  const user = userEvent.setup();
  render(<Nav />);

  await user.click(screen.getByRole('button', { name: /open menu/i }));

  expect(screen.getByRole('link', { name: /call \+91 81695 23196/i })).toHaveAttribute(
    'href',
    'tel:+918169523196',
  );
  expect(screen.getByRole('link', { name: /whatsapp \+91 81695 23196/i })).toHaveAttribute(
    'target',
    '_blank',
  );
});

test('WhatsApp FAB opens the clinic chat with an opening line ready', () => {
  render(<WhatsAppFab />);

  const fab = screen.getByRole('link', { name: /chat on whatsapp/i });
  expect(fab.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/918169523196\?text=Hello/);
  expect(fab).toHaveAttribute('rel', 'noopener noreferrer');
});

test('booking pill collapses to a labelled circle that still points at the enquiry form', async () => {
  const user = userEvent.setup();
  window.sessionStorage.clear();
  render(<FloatingBookingPill />);

  // The pill advertises a month, so it hands that month to the form.
  const bookHref = expect.stringMatching(/^\/book(\?month=.+#enquiry)?$/);
  expect(screen.getByRole('link', { name: /next mumbai visit|book a consultation/i }).getAttribute('href')).toEqual(
    bookHref,
  );

  await user.click(screen.getByRole('button', { name: /collapse the booking prompt/i }));

  expect(screen.queryByRole('button', { name: /collapse the booking prompt/i })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: /send an enquiry/i }).getAttribute('href')).toEqual(bookHref);
  expect(window.sessionStorage.getItem('mlafc:booking-pill-collapsed')).toBe('1');
});

test('booking pill stays collapsed for the rest of the session', () => {
  window.sessionStorage.setItem('mlafc:booking-pill-collapsed', '1');
  render(<FloatingBookingPill />);

  expect(screen.getByRole('link', { name: /send an enquiry/i })).toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /collapse the booking prompt/i })).not.toBeInTheDocument();
  window.sessionStorage.clear();
});
