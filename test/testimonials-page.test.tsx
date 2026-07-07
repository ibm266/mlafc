import { fireEvent, render, screen } from '@testing-library/react';
import { VoicesContent } from '@/components/VoicesContent';
import { installDialogMock, MockIntersectionObserver, mockReducedMotion } from './mocks';

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
  expect(screen.getByText(/The Indian Express/)).toBeInTheDocument();
});

test('Read more opens a dialog with the full review', () => {
  render(<VoicesContent />);
  const readMoreButtons = screen.getAllByRole('button', { name: /read more/i });
  fireEvent.click(readMoreButtons[0]!);
  expect(screen.getByRole('dialog')).toBeInTheDocument();
});
