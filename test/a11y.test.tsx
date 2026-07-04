import { render } from '@testing-library/react';
import { axe } from 'vitest-axe';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { ComparisonCards } from '@/components/home/ComparisonCards';
import { FaqAccordion } from '@/components/FaqAccordion';
import { faqs } from '@/data/faqs';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(true);
});

test.each([
  ['Nav', <Nav key="nav" />],
  ['Footer', <Footer key="footer" />],
  ['ComparisonCards', <ComparisonCards key="comparison" />],
  ['FaqAccordion', <FaqAccordion key="faq" faqs={faqs} />],
])('%s has no axe violations', async (_name, ui) => {
  const { container } = render(ui);
  expect(await axe(container)).toHaveNoViolations();
});
