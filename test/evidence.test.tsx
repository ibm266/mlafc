import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { EvidenceChart, CHART_DATA } from '@/components/EvidenceChart';
import { FaqAccordion } from '@/components/FaqAccordion';
import { faqs } from '@/data/faqs';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('chart values are readable as text (not only visual)', () => {
  render(<EvidenceChart />);
  for (const d of CHART_DATA) {
    expect(screen.getByText(`${d.value}%`)).toBeInTheDocument();
    expect(screen.getByText(d.label)).toBeInTheDocument();
  }
});

test('FAQ accordion expands an item on click', async () => {
  const user = userEvent.setup();
  render(<FaqAccordion faqs={faqs} />);
  const first = screen.getByRole('button', { name: faqs[0].question });
  expect(first).toHaveAttribute('aria-expanded', 'false');
  await user.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
});
