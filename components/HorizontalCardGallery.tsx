'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

type Props = {
  ariaLabel: string;
  children: ReactNode[];
};

export function HorizontalCardGallery({ ariaLabel, children }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = children.length;

  const updateActive = useCallback(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;

    const slides = Array.from(el.children) as HTMLElement[];
    const center = el.scrollLeft + el.clientWidth / 2;
    let nearest = 0;
    let minDist = Infinity;

    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const dist = Math.abs(center - slideCenter);
      if (dist < minDist) {
        minDist = dist;
        nearest = i;
      }
    });

    setActive(nearest);
  }, [count]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActive();
    el.addEventListener('scroll', updateActive, { passive: true });
    window.addEventListener('resize', updateActive);

    return () => {
      el.removeEventListener('scroll', updateActive);
      window.removeEventListener('resize', updateActive);
    };
  }, [updateActive]);

  const scrollTo = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const slide = el.children[index] as HTMLElement | undefined;
    if (!slide) return;
    el.scrollTo({ left: slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2, behavior: 'smooth' });
  };

  if (count === 0) return null;

  return (
    <div className="mt-10">
      <div
        ref={scrollRef}
        role="region"
        aria-label={ariaLabel}
        className="flex gap-5 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-5 px-5 md:mx-0 md:px-0"
      >
        {children.map((child, i) => (
          <div
            key={i}
            className="w-[min(88vw,22rem)] shrink-0 snap-center sm:w-[min(78vw,24rem)] lg:w-[min(34vw,22rem)]"
          >
            {child}
          </div>
        ))}
      </div>

      {count > 1 ? (
        <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label={`${ariaLabel} pagination`}>
          {children.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show item ${i + 1} of ${count}`}
              onClick={() => scrollTo(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === active ? 'w-6 bg-brass' : 'w-2 bg-line hover:bg-brass/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
