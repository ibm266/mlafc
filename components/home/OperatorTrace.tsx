'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/lib/useReveal';
import { OPERATOR_CONVERSION_TRACE } from '@/lib/ecg/design-paths';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { Reveal } from '@/components/Reveal';

const DESKTOP_VIEWBOX = '0 0 1400 180';
const MOBILE_VIEWBOX = '420 0 560 180';

export function OperatorTrace() {
  const traceRef = useRef<SVGPathElement>(null);
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [mobileCrop, setMobileCrop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setMobileCrop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const trace = traceRef.current;
    if (!trace || typeof trace.getTotalLength !== 'function') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const len = trace.getTotalLength();
    trace.style.strokeDasharray = String(len);

    if (reduce) {
      trace.style.strokeDashoffset = '0';
      return;
    }

    if (!visible) {
      trace.style.strokeDashoffset = String(len);
      return;
    }

    const DRAW = 4600;
    const HOLD = 1800;
    let raf = 0;
    let start = 0;

    const tick = (t: number) => {
      if (!start) start = t;
      const elapsed = (t - start) % (DRAW + HOLD);
      const p = Math.min(elapsed / DRAW, 1);
      const eased = 1 - (1 - p) ** 2;
      trace.style.strokeDashoffset = String(len * (1 - eased));
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  const afLabelX = mobileCrop ? 430 : 4;
  const steadyLabelX = mobileCrop ? 910 : 1396;
  const steadyAnchor = mobileCrop ? 'middle' : 'end';
  const labelFontSize = mobileCrop ? 9 : 12;
  const labelLetterSpacing = mobileCrop ? '0.1em' : '0.16em';

  return (
    <section aria-labelledby="constant-heading" className="overflow-hidden bg-paper">
      <div className="mx-auto max-w-6xl px-5 pt-20 text-center">
        <Reveal className="justify-center">
          <ChapterEyebrow chapter="01" label="The one constant" className="justify-center" />
        </Reveal>
        <Reveal delay={80}>
          <h2
            id="constant-heading"
            className="mx-auto mt-4 max-w-3xl font-serif text-4xl leading-tight md:text-5xl"
          >
            What changes the rhythm is <em className="text-brass-deep">the operator</em>.
          </h2>
        </Reveal>
      </div>
      <Reveal delay={160}>
        <div ref={ref} className="mx-auto mt-9 max-w-3xl px-5 md:max-w-[1400px]">
          <svg
            viewBox={mobileCrop ? MOBILE_VIEWBOX : DESKTOP_VIEWBOX}
            role="img"
            aria-label="An ECG trace beginning in chaotic atrial fibrillation, passing through a point marked the operator, and continuing as a steady sinus rhythm."
            className="block h-auto w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <text
              x={afLabelX}
              y="30"
              fill="#556675"
              fontSize={labelFontSize}
              fontWeight="600"
              letterSpacing={labelLetterSpacing}
              className="font-sans"
            >
              ATRIAL FIBRILLATION
            </text>
            <text
              x={steadyLabelX}
              y="30"
              textAnchor={steadyAnchor}
              fill="#556675"
              fontSize={labelFontSize}
              fontWeight="600"
              letterSpacing={labelLetterSpacing}
              className="font-sans"
            >
              STEADY RHYTHM
            </text>
            <path
              ref={traceRef}
              d={OPERATOR_CONVERSION_TRACE}
              fill="none"
              stroke="#122B3A"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle className="halo" cx="700" cy="90" r="17" fill="#B08D3E" />
            <circle cx="700" cy="90" r="6" fill="#B08D3E" />
            <text
              x="700"
              y="140"
              textAnchor="middle"
              fill="#6E5826"
              fontSize="12"
              fontWeight="600"
              letterSpacing="0.18em"
              className="font-sans"
            >
              THE OPERATOR
            </text>
          </svg>
        </div>
      </Reveal>
      <Reveal delay={220}>
        <p className="mx-auto max-w-xl px-5 pb-20 pt-7 text-center text-lg text-ink-mute">
          The same heart, before and after ablation. In the largest head-to-head trials, RFA and PFA performed
          comparably. The strongest predictor of a safe, successful outcome is the experience of the hands performing
          it.
        </p>
      </Reveal>
    </section>
  );
}
