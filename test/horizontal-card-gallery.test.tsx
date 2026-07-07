import { act, fireEvent, render, screen } from '@testing-library/react';
import { HorizontalCardGallery } from '@/components/HorizontalCardGallery';

function mockScrollContainer(el: HTMLElement, scrollLeft: number, scrollWidth: number, clientWidth: number) {
  Object.defineProperty(el, 'scrollLeft', { configurable: true, value: scrollLeft, writable: true });
  Object.defineProperty(el, 'scrollWidth', { configurable: true, value: scrollWidth });
  Object.defineProperty(el, 'clientWidth', { configurable: true, value: clientWidth });
  Object.defineProperty(el, 'scrollTo', {
    configurable: true,
    value: vi.fn((options: ScrollToOptions) => {
      if (typeof options.left === 'number') {
        Object.defineProperty(el, 'scrollLeft', { configurable: true, value: options.left, writable: true });
      }
    }),
  });
}

test('highlights the last pagination bubble when scrolled to the end', () => {
  render(
    <HorizontalCardGallery ariaLabel="Test gallery" itemsPerPage={3}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i}>Card {i + 1}</div>
      ))}
    </HorizontalCardGallery>,
  );

  const region = screen.getByRole('region', { name: 'Test gallery' });
  mockScrollContainer(region, 2400, 3000, 600);

  act(() => {
    fireEvent.scroll(region);
  });

  expect(screen.getByRole('tab', { name: 'Page 7 of 7' })).toHaveAttribute('aria-selected', 'true');
});

test('scrolls to max scroll position for the last page', () => {
  render(
    <HorizontalCardGallery ariaLabel="Test gallery" itemsPerPage={3}>
      {Array.from({ length: 20 }, (_, i) => (
        <div key={i}>Card {i + 1}</div>
      ))}
    </HorizontalCardGallery>,
  );

  const region = screen.getByRole('region', { name: 'Test gallery' });
  mockScrollContainer(region, 0, 3000, 600);

  fireEvent.click(screen.getByRole('tab', { name: 'Page 7 of 7' }));

  expect(region.scrollTo).toHaveBeenCalledWith({ left: 2400, behavior: 'smooth' });
});
