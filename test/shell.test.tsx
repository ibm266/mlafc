import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { WhatsAppFab } from '@/components/WhatsAppFab';

test('Nav renders the four section links and the booking CTA', () => {
  render(<Nav />);
  for (const label of ['Evidence', 'Journey', 'Where He Works', 'Testimonials']) {
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
  await waitFor(() => expect(screen.getAllByRole('link', { name: 'Evidence' }).at(-1)).toHaveFocus());

  await user.keyboard('{Shift>}{Tab}{/Shift}');
  expect(screen.getAllByRole('link', { name: /book a consultation/i }).at(-1)).toHaveFocus();

  await user.keyboard('{Tab}');
  expect(screen.getAllByRole('link', { name: 'Evidence' }).at(-1)).toHaveFocus();

  await user.keyboard('{Escape}');
  expect(screen.queryByRole('navigation', { name: /mobile/i })).not.toBeInTheDocument();
  expect(menuButton).toHaveFocus();
});

test('Footer carries GMC line and disclaimer', () => {
  render(<Footer />);
  expect(screen.getByText(/General Medical Council/)).toBeInTheDocument();
  expect(screen.getByText(/not a substitute for individual medical advice/)).toBeInTheDocument();
});

test('WhatsApp FAB links to wa.me with accessible label', () => {
  render(<WhatsAppFab />);
  const fab = screen.getByRole('link', { name: /whatsapp/i });
  expect(fab.getAttribute('href')).toMatch(/^https:\/\/wa\.me\//);
});
