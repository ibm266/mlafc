export class MockIntersectionObserver {
  static instances: MockIntersectionObserver[] = [];
  elements = new Set<Element>();
  constructor(public callback: IntersectionObserverCallback) {
    MockIntersectionObserver.instances.push(this);
  }
  observe(el: Element) { this.elements.add(el); }
  unobserve(el: Element) { this.elements.delete(el); }
  disconnect() { this.elements.clear(); }
  takeRecords() { return []; }
  root = null; rootMargin = ''; thresholds = [];
  trigger(isIntersecting: boolean) {
    const entries = [...this.elements].map((target) => ({ target, isIntersecting } as IntersectionObserverEntry));
    this.callback(entries, this as unknown as IntersectionObserver);
  }
  static reset() { MockIntersectionObserver.instances = []; }
  static install() {
    MockIntersectionObserver.reset();
    (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver = MockIntersectionObserver;
  }
}

export function mockReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: query.includes('prefers-reduced-motion') ? matches : false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
