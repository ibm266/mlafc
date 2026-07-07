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

    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-step-card]'));
    const containerLeft = el.getBoundingClientRect().left;

    for (let i = 0; i < cards.length; i++) {
      const rect = cards[i].getBoundingClientRect();
      if (rect.left + rect.width / 2 >= containerLeft) {
        setActiveStep(i);
        break;
      }
    }
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

    const containerRect = el.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const left = el.scrollLeft + cardRect.left - containerRect.left;

    el.scrollTo({ left, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={scrollRef}
        role="region"
        aria-label="How the Mumbai clinic works"
        className="flex items-stretch gap-0 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory -mx-5 px-5"
      >
        {STEPS.map((step, i) => (
          <Fragment key={step.title}>
            {i > 0 ? <StepArrow compact /> : null}
            <div data-step-card={i} className="w-[min(68vw,13.5rem)] shrink-0 snap-center">
              <StepCard step={step} />
            </div>
          </Fragment>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Clinic steps">
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
