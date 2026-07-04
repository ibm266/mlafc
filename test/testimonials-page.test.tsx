import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestimonialsGrid } from '@/components/TestimonialsGrid';

test('filters the grid and updates the count', async () => {
  const user = userEvent.setup();
  render(<TestimonialsGrid />);
  expect(screen.getAllByRole('article')).toHaveLength(24);
  await user.click(screen.getByRole('button', { name: /patients/i }));
  expect(screen.getAllByRole('article')).toHaveLength(8);
  expect(screen.getByText(/8 testimonials shown/i)).toBeInTheDocument();
});

test('opens the full letter dialog from a hospital card', async () => {
  const user = userEvent.setup();
  // jsdom lacks <dialog> methods
  HTMLDialogElement.prototype.showModal =
    HTMLDialogElement.prototype.showModal ??
    function (this: HTMLDialogElement) {
      this.open = true;
    };
  HTMLDialogElement.prototype.close =
    HTMLDialogElement.prototype.close ??
    function (this: HTMLDialogElement) {
      this.open = false;
    };
  render(<TestimonialsGrid />);
  await user.click(screen.getAllByRole('button', { name: /read full letter/i })[0]);
  expect(screen.getByText(/It gives me great pleasure to write in support/)).toBeInTheDocument();
});
