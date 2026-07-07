'use client';

import { Fragment, useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { Reveal } from '@/components/Reveal';
import { buildSingleEcgBeat } from '@/lib/ecg/design-paths';
import { useReveal } from '@/lib/useReveal';
import { useStrokeDraw } from '@/lib/useStrokeDraw';

const STEPS = [
  {
    n: 'i.',
    title: 'An unhurried first visit',
    body: 'A full consultation in Mumbai - your history, your recordings, your questions. In English, Hindi or Punjabi. You leave with a clear plan.',
  },
  {
    n: 'ii.',
    title: 'Procedure in Mumbai',
    body: 'If a procedure is right for you, Professor Gupta performs it himself during a scheduled Mumbai visit, using the technology that suits your heart.',
  },
  {
    n: 'iii.',
    title: 'Continuity, locally',
    body: 'Follow-up happens close to home with trusted local cardiologists, coordinated under his supervision between visits.',
  },
] as const;

const STEP_AMPS = [44, 48, 40];

function StepCard({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <div className="card-lift h-full rounded-lg border border-line bg-paper p-4">
      <p className="text-xs font-semibold text-brass-deep sm:text-sm">
        {step.n} {step.title}
      </p>
      <h3 className="sr-only">{step.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.body}</p>
    </div>
  );
}

function EcgBeatStrip({
  amp,
  pathRef,
  className,
}: {
  amp: number;
  pathRef: RefObject<SVGPathElement | null>;
  className?: string;
}) {
  const trace = buildSingleEcgBeat(amp);

  return (
    <svg viewBox={trace.viewBox} aria-hidden className={className} preserveAspectRatio="xMidYMid meet">
      <path
        d={trace.path}
        fill="none"
        stroke="#D9D3C7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        ref={pathRef}
        d={trace.path}
        fill="none"
        stroke="#B08D3E"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={trace.peak.x} cy={trace.peak.y} r="4" fill="#B08D3E" />
    </svg>
  );
}

function EcgConnector({
  amp,
  visible,
  compact = false,
}: {
  amp: number;
  visible: boolean;
  compact?: boolean;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  useStrokeDraw(pathRef, visible, 1200);

  return (
    <div
      className={`flex shrink-0 items-center self-center ${compact ? 'w-9 px-0.5' : 'w-12 px-1 md:w-14'}`}
      aria-hidden
    >
      <EcgBeatStrip amp={amp} pathRef={pathRef} className={`w-full ${compact ? 'h-7' : 'h-8 md:h-9'}`} />
    </div>
  );
}

function StepsRow({ visible }: { visible: boolean }) {
  return (
    <div className="flex items-stretch justify-center">
      {STEPS.map((step, i) => (
        <Fragment key={step.n}>
          {i > 0 ? <EcgConnector amp={STEP_AMPS[i - 1]!} visible={visible} /> : null}
          <Reveal delay={i * 90} className="w-[min(14rem,28vw)] sm:w-56 lg:w-60">
            <StepCard step={step} />
          </Reveal>
        </Fragment>
      ))}
    </div>
  );
}

function MobileStepsGallery({ visible }: { visible: boolean }) {
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
          <Fragment key={step.n}>
            {i > 0 ? <EcgConnector amp={STEP_AMPS[i - 1]!} visible={visible} compact /> : null}
            <div data-step-card={i} className="w-[min(68vw,13.5rem)] shrink-0 snap-center">
              <StepCard step={step} />
            </div>
          </Fragment>
        ))}
      </div>

      <div className="mt-4 flex justify-center gap-2" role="tablist" aria-label="Clinic steps">
        {STEPS.map((step, i) => (
          <button
            key={step.n}
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
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <div className="hidden md:block">
        <StepsRow visible={visible} />
      </div>

      <div className="md:hidden">
        <MobileStepsGallery visible={visible} />
      </div>
    </div>
  );
}
