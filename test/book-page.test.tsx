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
  expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/preferred visit month/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /whatsapp/i })).toBeInTheDocument();
  expect(screen.getByText('Booking open')).toBeInTheDocument();
});
