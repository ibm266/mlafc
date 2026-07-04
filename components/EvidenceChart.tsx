'use client';

import { useReveal } from '@/lib/useReveal';

// [CITATION — verify] Placeholder values from the volume-outcome literature.
// Client must confirm figures and sources before launch (see data/citations.ts).
export const CHART_DATA = [
  { label: 'Lower-volume centres', value: 2.1, colour: 'var(--color-ink-mute)' },
  { label: 'Higher-volume centres', value: 0.9, colour: 'var(--color-brass-deep)' },
];

const MAX = 2.5;
const CHART_HEIGHT = 180;
const CHART_TOP = 36;
const BAR_WIDTH = 96;
const BAR_BASELINE = CHART_TOP + CHART_HEIGHT;

export function EvidenceChart() {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref}>
      <figure aria-label="Major complication rates at lower-volume versus higher-volume centres">
        <svg
          role="img"
          aria-labelledby="evidence-chart-title evidence-chart-desc"
          viewBox="0 0 520 300"
          className="mx-auto h-auto w-full max-w-xl overflow-visible"
        >
          <title id="evidence-chart-title">
            Major complication rates at lower-volume versus higher-volume centres
          </title>
          <desc id="evidence-chart-desc">
            A bar chart comparing 2.1% at lower-volume centres with 0.9% at higher-volume centres.
          </desc>
          <line
            x1="60"
            y1={BAR_BASELINE}
            x2="460"
            y2={BAR_BASELINE}
            stroke="var(--color-line)"
            strokeWidth="2"
          />
          {CHART_DATA.map((d, index) => {
            const height = (d.value / MAX) * CHART_HEIGHT;
            const x = index === 0 ? 96 : 328;
            const y = BAR_BASELINE - height;

            return (
              <g key={d.label}>
                <text
                  x={x + BAR_WIDTH / 2}
                  y={y - 16}
                  textAnchor="middle"
                  className="fill-ink font-serif text-3xl"
                >
                  {d.value}%
                </text>
                <rect
                  x={x}
                  y={y}
                  width={BAR_WIDTH}
                  height={height}
                  rx="6"
                  fill={d.colour}
                  className="transition-transform duration-700 ease-out"
                  style={{
                    transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom',
                  }}
                />
                <text
                  x={x + BAR_WIDTH / 2}
                  y="264"
                  textAnchor="middle"
                  className="fill-ink-soft text-sm font-semibold"
                >
                  {d.label}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-6 text-center text-sm text-ink-mute">
          Major complication rates after AF ablation, by centre volume.
          <sup>2, 4</sup> Published research consistently finds lower complication rates where
          more of these procedures are done. [CITATION — verify]
        </figcaption>
      </figure>
    </div>
  );
}
