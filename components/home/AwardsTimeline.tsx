'use client';

import { useRef } from 'react';
import { Reveal } from '@/components/Reveal';
import {
  AWARDS_ECG_BASELINE_Y,
  AWARDS_ECG_HEIGHT,
  AWARDS_ECG_PEAKS,
  AWARDS_ECG_TRACE,
  AWARDS_ECG_VIEWBOX,
} from '@/lib/ecg/design-paths';
import { useReveal } from '@/lib/useReveal';
import { useStrokeDraw } from '@/lib/useStrokeDraw';

/**
 * Ordered to match AWARDS_ECG_PEAKS: R-peak amplitude on the rhythm strip
 * encodes significance, so the NHS Silver beat is the tallest deflection.
 */
const AWARDS = [
  {
    tag: '2021',
    title: 'NHS National Silver Clinical Excellence Award',
    sub: 'Awarded 2021. Earlier Bronze in 2017.',
    highlight: true,
  },
  {
    tag: '2014',
    title: 'Arrhythmia Alliance Excellence in Practice Award',
    sub: 'Outstanding contribution to UK arrhythmia services',
  },
  {
    tag: '5 trials',
    title: 'Chief Investigator, multi-centre AF trials',
    sub: 'PRESSURE · SMAAN-PAF · PRAISE · VISTAX · CRAFT',
  },
  {
    tag: 'BHF',
    title: 'Author, British Heart Foundation AF booklet',
    sub: 'National patient education resource',
  },
] as const;

function AwardCard({ award, delay }: { award: (typeof AWARDS)[number]; delay: number }) {
  return (
    <Reveal
      delay={delay}
      className={`card-lift h-full rounded-xl border bg-paper p-5 ${
        award.highlight ? 'border-brass/50' : 'border-line'
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-brass-deep">
        {award.tag}
      </p>
      <p className="mt-2.5 font-semibold leading-snug text-ink">{award.title}</p>
      <p className="mt-2 text-sm text-ink-mute">{award.sub}</p>
    </Reveal>
  );
}

export function AwardsTimeline() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const desktopPathRef = useRef<SVGPathElement>(null);
  const mobilePathRef = useRef<SVGPathElement>(null);
  useStrokeDraw(desktopPathRef, visible, 2600);
  useStrokeDraw(mobilePathRef, visible, 2000);

  return (
    <div ref={ref}>
      {/* Desktop: annotated rhythm strip, one beat per honour, callipers down to cards */}
      <div className="hidden lg:block">
        <svg
          viewBox={AWARDS_ECG_VIEWBOX}
          role="img"
          aria-hidden
          className="block w-full"
          preserveAspectRatio="xMidYMax meet"
        >
          {AWARDS_ECG_PEAKS.map((peak, i) => (
            <line
              key={`calliper-${AWARDS[i].title}`}
              x1={peak.x}
              y1={AWARDS_ECG_BASELINE_Y + 30}
              x2={peak.x}
              y2={AWARDS_ECG_HEIGHT}
              stroke="#D9D3C7"
              strokeWidth="1.5"
            />
          ))}
          <path
            d={AWARDS_ECG_TRACE}
            fill="none"
            stroke="#D9D3C7"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={desktopPathRef}
            d={AWARDS_ECG_TRACE}
            fill="none"
            stroke="#B08D3E"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {AWARDS_ECG_PEAKS.map((peak, i) => (
            <g key={AWARDS[i].title}>
              <circle
                className="halo"
                style={{ animationDelay: `${i * 0.4}s` }}
                cx={peak.x}
                cy={peak.y}
                r="13"
                fill="#B08D3E"
              />
              <circle cx={peak.x} cy={peak.y} r="4.5" fill="#B08D3E" />
              <text
                x={peak.x}
                y={peak.y - 16}
                textAnchor="middle"
                fill="#8F7231"
                fontSize="13"
                fontWeight="600"
                letterSpacing="0.16em"
                className="font-sans"
              >
                {AWARDS[i].tag.toUpperCase()}
              </text>
            </g>
          ))}
        </svg>

        <div className="grid grid-cols-4 gap-5">
          {AWARDS.map((award, i) => (
            <AwardCard key={award.title} award={award} delay={240 + i * 90} />
          ))}
        </div>
      </div>

      {/* Mobile and tablet: decorative strip, then stacked cards */}
      <div className="lg:hidden">
        <svg
          viewBox={AWARDS_ECG_VIEWBOX}
          role="img"
          aria-hidden
          className="mb-6 block w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={AWARDS_ECG_TRACE}
            fill="none"
            stroke="#D9D3C7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            ref={mobilePathRef}
            d={AWARDS_ECG_TRACE}
            fill="none"
            stroke="#B08D3E"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {AWARDS_ECG_PEAKS.map((peak, i) => (
            <circle key={AWARDS[i].title} cx={peak.x} cy={peak.y} r="6" fill="#B08D3E" />
          ))}
        </svg>

        <div className="grid gap-4 sm:grid-cols-2">
          {AWARDS.map((award, i) => (
            <AwardCard key={award.title} award={award} delay={160 + i * 70} />
          ))}
        </div>
      </div>
    </div>
  );
}
