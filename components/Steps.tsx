'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal';
import { useReveal } from '@/lib/useReveal';

const STEPS = [
  {
    title: 'An unhurried first visit',
    body: 'A full consultation in Mumbai - your history, your recordings, your questions. In English, Hindi or Punjabi. You leave with a clear plan.',
  },
  {
    title: 'Procedure in Mumbai',
    body: 'If a procedure is right for you, Professor Gupta performs it himself during a scheduled Mumbai visit, using the technology that suits your heart.',
  },
  {
    title: 'Continuity, locally',
    body: 'Follow-up happens close to home with trusted local cardiologists, coordinated under his supervision between visits.',
  },
] as const;

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className="card-lift h-full rounded-lg border border-line bg-paper p-4">
      <h3 className="text-xs font-semibold text-brass-deep sm:text-sm">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
    </div>
  );
}

/** Mobile gallery card: numbered, with an ECG-style arrow pointing to the next step. */
function GalleryStepCard({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const isLast = index === STEPS.length - 1;

  return (
    <div className="card-lift flex h-full flex-col rounded-lg border border-line bg-paper p-5">
      <div className="flex items-center justify-between">
        <span aria-hidden className="font-serif text-2xl leading-none text-brass">
          0{index + 1}
        </span>
        {isLast ? (
          <span aria-hidden className="mr-1 inline-block h-2 w-2 rounded-full bg-brass" />
        ) : (
          <svg viewBox="0 0 48 12" className="h-3 w-12 text-brass" fill="none" aria-hidden>
            <circle cx="3" cy="6" r="2" fill="currentColor" className="opacity-75" />
            <path d="M8 6 H30" stroke="#D9D3C7" strokeWidth="1" strokeLinecap="round" />
            <path d="M30 6 H38" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
            <path
              d="M34 2.5 L41 6 L34 9.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
      <h3 className="mt-3 text-sm font-semibold text-brass-deep">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
    </div>
  );
}

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

function StepArrow({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center self-center text-brass ${compact ? 'w-10' : 'w-14'}`}
      aria-hidden
    >
      <svg viewBox="0 0 48 12" className={compact ? 'h-3 w-10' : 'h-3.5 w-14'} fill="none">
        <circle cx="3" cy="6" r="2" fill="currentColor" className="opacity-75" />
        <path d="M8 6 H30" stroke="#D9D3C7" strokeWidth="1" strokeLinecap="round" />
        <path d="M30 6 H38" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <path
          d="M34 2.5 L41 6 L34 9.5"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function StepsRow() {
  return (
    <div className="flex items-stretch justify-center">
      {STEPS.map((step, i) => (
        <Fragment key={step.title}>
          {i > 0 ? <StepArrow /> : null}
          <Reveal delay={i * 90} className="w-[min(14rem,28vw)] sm:w-56 lg:w-60">
            <StepCard step={step} />
          </Reveal>
        </Fragment>
      ))}
    </div>
  );
}

function MobileStepsGallery() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const updateActiveStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Cards are centre-snapped, so the active card is the one whose centre
    // sits closest to the viewport centre.
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-step-card]'));
    const containerRect = el.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let nearest = 0;
    let nearestDistance = Infinity;
    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - containerCenter);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = i;
      }
    }

    setActiveStep(nearest);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateActiveStep();
    el.addEventListener('scroll', updateActiveStep, { passive: true });
    window.addEventListener('resize', updateActiveStep);

    return () => {
      el.removeEventListener('scroll', updateActiveStep);
      window.removeEventListener('resize', updateActiveStep);
    };
  }, [updateActiveStep]);

  const scrollToStep = (index: number) => {
    const el = scrollRef.current;
    if (!el) return;

    const card = el.querySelector<HTMLElement>(`[data-step-card="${index}"]`);
    if (!card) return;

    // Match the cards' snap-center alignment so the snap doesn't re-adjust
    // after the programmatic scroll settles.
    const containerRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const left =
      el.scrollLeft + (cardRect.left + cardRect.width / 2) - (containerRect.left + containerRect.width / 2);
    const clamped = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth));
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';

    el.scrollTo({ left: clamped, behavior });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        role="region"
        aria-label="How the Mumbai clinic works"
        className="flex items-stretch gap-3 overflow-x-auto overscroll-x-contain -mt-2 pt-2 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-5 px-[calc(50vw-min(42vw,10rem))]"
      >
        {STEPS.map((step, i) => (
          <div key={step.title} data-step-card={i} className="w-[min(84vw,20rem)] shrink-0 snap-center">
            <GalleryStepCard step={step} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollToStep(activeStep - 1)}
          disabled={activeStep === 0}
          aria-label="Previous step"
          className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronIcon direction="left" />
        </button>

        <div className="flex gap-2" role="tablist" aria-label="Clinic steps">
          {STEPS.map((step, i) => (
            <button
              key={step.title}
              type="button"
              role="tab"
              aria-selected={i === activeStep}
              aria-label={`Step ${i + 1}: ${step.title}`}
              onClick={() => scrollToStep(i)}
              className={`h-2 rounded-full transition-all duration-200 ${
                i === activeStep ? 'w-6 bg-brass' : 'w-2 bg-line hover:bg-brass/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToStep(activeStep + 1)}
          disabled={activeStep === STEPS.length - 1}
          aria-label="Next step"
          className="interactive flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-soft disabled:pointer-events-none disabled:opacity-35"
        >
          <ChevronIcon direction="right" />
        </button>
      </div>
    </div>
  );
}

export function Steps() {
  const { ref } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div className="hidden md:block">
        <StepsRow />
      </div>

      <div className="md:hidden">
        <MobileStepsGallery />
      </div>
    </div>
  );
}
