import { render, screen, act } from '@testing-library/react';
import { MockIntersectionObserver, mockReducedMotion } from './mocks';
import { Reveal } from '@/components/Reveal';
import { CountUp } from '@/components/CountUp';

beforeEach(() => {
  MockIntersectionObserver.install();
  mockReducedMotion(false);
});

test('Reveal becomes visible when intersecting', () => {
  render(<Reveal><p>hello</p></Reveal>);
  const wrapper = screen.getByText('hello').parentElement!;
  expect(wrapper.className).toContain('reveal');
  expect(wrapper.className).not.toContain('reveal-visible');
  act(() => MockIntersectionObserver.instances.at(-1)!.trigger(true));
  expect(wrapper.className).toContain('reveal-visible');
});

test('Reveal renders visible immediately under reduced motion', () => {
  mockReducedMotion(true);
  render(<Reveal><p>static</p></Reveal>);
  expect(screen.getByText('static').parentElement!.className).toContain('reveal-visible');
});

test('CountUp shows final value immediately under reduced motion', () => {
  mockReducedMotion(true);
  render(<CountUp to={10000} suffix="+" />);
  act(() => MockIntersectionObserver.instances.at(-1)?.trigger(true));
  expect(screen.getByText('10,000+')).toBeInTheDocument();
});
