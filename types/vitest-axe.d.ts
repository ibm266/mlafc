/**
 * vitest-axe 0.1 augments the old global `Vi.Assertion` namespace, which
 * vitest 4 no longer reads, so `toHaveNoViolations` type-checks as unknown
 * even though the matcher is registered in vitest.setup.ts. This restores it.
 */
import 'vitest';

declare module 'vitest' {
  interface Matchers<T = unknown> {
    toHaveNoViolations(): T;
  }
}
