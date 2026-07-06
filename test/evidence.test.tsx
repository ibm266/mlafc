import { render, screen } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { FaqConversation } from '@/components/FaqConversation';
import { faqs } from '@/data/faqs';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test('FAQ conversation renders questions and answers plainly', () => {
  render(<FaqConversation faqs={faqs} />);
  expect(screen.getByText(new RegExp(faqs[0].question.replace('?', '\\?')))).toBeInTheDocument();
  expect(screen.getByText(faqs[0].answer)).toBeInTheDocument();
  expect(screen.queryByRole('button')).not.toBeInTheDocument();
});
