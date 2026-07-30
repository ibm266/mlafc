import '@testing-library/jest-dom/vitest';
import * as axeMatchers from 'vitest-axe/matchers';
import { expect, vi } from 'vitest';

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  // Derived from jsdom's own URL so a test can drive it with
  // history.replaceState rather than re-mocking the module.
  useSearchParams: () => new URLSearchParams(window.location.search),
}));

expect.extend(axeMatchers);

// Default matchMedia mock (reduced motion OFF). Tests can override.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }),
});
