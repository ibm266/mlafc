'use client';

import { Children, useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  ariaLabel: string;
  children: ReactNode;
  className?: string;
  itemsPerPage?: number;
};

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
      <path
        d={direction === 'left' ? 'M10 3 L5 8 L10 13' : 'M6 3 L11 8 L6 13'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HorizontalCardGallery({ ariaLabel, children, className = '', itemsPerPage = 1 }: Props) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const pageCount = Math.max(1, Math.ceil(count / itemsPerPage));

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activePage, setActivePage] = useState(0);

  const getSlideScrollLeft = useCallback((el: HTMLDivElement, slide: HTMLElement) => {
    const containerRect = el.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    return el.scrollLeft + slideRect.left - containerRect.left;
  }, []);

  const updateActivePage = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;

    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    if (maxScrollLeft <= 0) {
      setActivePage(0);
      return;
    }

    // The final page often has fewer slides than itemsPerPage, so max scroll
    // cannot align that page's first slide to the viewport edge.
    if (el.scrollLeft >= maxScrollLeft - 1) {
      setActivePage(pageCount - 1);
      return;
    }

    if (el.scrollLeft <= 1) {
      setActivePage(0);
      return;
    }

    const slideEls = Array.from(el.children) as HTMLElement[];
    const containerLeft = el.getBoundingClientRect().left;

    let firstVisible = 0;
    for (let i = 0; i < slideEls.length; i++) {
      const slideRect = slideEls[i].getBoundingClientRect();
      if (slideRect.right > containerLeft + 1) {
        firstVisible = i;
        break;
      }
    }

    const page = Math.min(Math.floor(firstVisible / itemsPerPage), pageCount - 1);
    setActivePage(page);
  }, [count, itemsPerPage, pageCount]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActivePage();
    el.addEventListener('scroll', updateActivePage, { passive: true });
    window.addEventListener('resize', updateActivePage);

    return () => {
      el.removeEventListener('scroll', updateActivePage);
      window.removeEventListener('resize', updateActivePage);
    };
  }, [updateActivePage]);

  const scrollToPage = (page: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const clamped = Math.max(0, Math.min(page, pageCount - 1));

    if (clamped === pageCount - 1) {
      const maxScrollLeft = el.scrollWidth - el.clientWidth;
      el.scrollTo({ left: maxScrollLeft, behavior: 'smooth' });
      return;
    }

    const slideIndex = clamped * itemsPerPage;
    const slide = el.children[slideIndex] as HTMLElement | undefined;
    if (!slide) return;

    el.scrollTo({ left: getSlideScrollLeft(el, slide), behavior: 'smooth' });
  };

  if (count === 0) return null;

  const canGoPrev = activePage > 0;
  const canGoNext = activePage < pageCount - 1;

  return (
    <div className={className ?? 'mt-10'}>
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0"
      >
        {slides.map((child, i) => (
          <div
            key={i}
            className="w-[min(88vw,22rem)] shrink-0 snap-start sm:w-[min(78vw,24rem)] lg:w-[min(34vw,22rem)]"
          >
            {child}
          </div>
        ))}
      </div>

      {pageCount > 1 ? (
        <div
          className="mt-5 flex items-center justify-center gap-3"
          role="group"
          aria-label={`${ariaLabel} pagination`}
        >
          <button
            type="button"
            onClick={() => scrollToPage(activePage - 1)}
            disabled={!canGoPrev}
            aria-label="Previous"
            className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronIcon direction="left" />
          </button>

          <div className="flex gap-2" role="tablist" aria-label={`${ariaLabel} pages`}>
            {Array.from({ length: pageCount }, (_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === activePage}
                aria-label={`Page ${i + 1} of ${pageCount}`}
                onClick={() => scrollToPage(i)}
                className={`h-2 rounded-full transition-all duration-200 ${
                  i === activePage ? 'w-6 bg-brass' : 'w-2 bg-line hover:bg-brass/50'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToPage(activePage + 1)}
            disabled={!canGoNext}
            aria-label="Next"
            className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
          >
            <ChevronIcon direction="right" />
          </button>
        </div>
      ) : null}
    </div>
  );
}
