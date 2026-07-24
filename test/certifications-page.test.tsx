import { fireEvent, render, screen, within } from '@testing-library/react';
import { CertificateWall } from '@/components/certifications/CertificateWall';
import { certifications, certificationSections } from '@/data/certifications';
import { installDialogMock, MockIntersectionObserver, mockReducedMotion } from './mocks';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
  installDialogMock();
});

test('the wall renders every room and a frame button for every certification', () => {
  render(<CertificateWall />);

  for (const section of certificationSections) {
    expect(screen.getByRole('region', { name: section.label })).toBeInTheDocument();
  }

  const frames = screen.getAllByRole('button', { name: /Open details/i });
  expect(frames).toHaveLength(certifications.length);
});

test('clicking a frame opens the dialog with that certificate story', () => {
  render(<CertificateWall />);

  const first = certifications[0];
  fireEvent.click(screen.getByRole('button', { name: new RegExp(first.title, 'i') }));

  const dialog = screen.getByRole('dialog');
  expect(within(dialog).getByText(first.story[0])).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: /next certificate/i })).toBeInTheDocument();
  expect(within(dialog).getByRole('button', { name: /previous certificate/i })).toBeInTheDocument();
});

test('next steps through the collection inside the dialog', () => {
  render(<CertificateWall />);

  fireEvent.click(screen.getByRole('button', { name: new RegExp(certifications[0].title, 'i') }));
  const dialog = screen.getByRole('dialog');

  fireEvent.click(within(dialog).getByRole('button', { name: /next certificate/i }));
  expect(within(dialog).getByText(certifications[1].story[0])).toBeInTheDocument();
});
