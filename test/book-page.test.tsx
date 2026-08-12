import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import BookPage from '@/app/book/page';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('book page shows form fields, contact channels and visit dates', () => {
  render(<BookPage />);
  expect(screen.getByLabelText(/your name/i)).toBeInTheDocument();
  expect(screen.getByRole('group', { name: /phone number/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/what would you like to ask about/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/how did you hear about professor gupta/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/preferred visit month/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /contact@mumbai-london-af\.clinic/i })).toBeInTheDocument();
  expect(screen.getAllByText('Booking open').length).toBeGreaterThan(0);
});

test('book page offers WhatsApp and the clinic line on the same number', () => {
  render(<BookPage />);

  const whatsapp = screen.getByRole('link', { name: /message on whatsapp/i });
  expect(whatsapp.getAttribute('href')).toMatch(/^https:\/\/wa\.me\/918169523196\?text=/);
  expect(whatsapp).toHaveAttribute('rel', 'noopener noreferrer');

  expect(screen.getByRole('link', { name: /call \+91 81695 23196/i })).toHaveAttribute(
    'href',
    'tel:+918169523196',
  );
});
