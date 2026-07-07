'use client';

import { useEffect, useState } from 'react';
import { useReveal } from '@/lib/useReveal';

export const CHART_DATA = [
  { label: 'Lower-volume centres', sublabel: 'under 50 ablations a year', value: 2.1, colour: '#8A97A3', x: 96 },
  {
    label: 'Higher-volume centres',
    sublabel: '300+ ablations a year',
    value: 0.9,
    colour: '#B08D3E',
    x: 328,
  },
];

const MAX = 2.5;
const CHART_HEIGHT = 151;
const CHART_TOP = 65;
const BAR_WIDTH = 96;
const BAR_BASELINE = CHART_TOP + CHART_HEIGHT;

function useAnimatedPercent(value: number, visible: boolean) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!visible) {
      setDisplay(0);
      return;
    }
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplay(value);
      return;
    }
    const dur = 1100;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      setDisplay(Math.round(value * (1 - (1 - p) ** 3) * 10) / 10);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, visible]);

  return display;
}

export function EvidenceChart() {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const low = useAnimatedPercent(CHART_DATA[0].value, visible);
  const high = useAnimatedPercent(CHART_DATA[1].value, visible);

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
          <line x1="40" y1={BAR_BASELINE} x2="480" y2={BAR_BASELINE} stroke="var(--color-line)" strokeWidth="2" />
          {CHART_DATA.map((d, index) => {
            const height = (d.value / MAX) * CHART_HEIGHT;
            const y = BAR_BASELINE - height;
            const labelY = d.value > 1.5 ? 48 : 134;
            const display = index === 0 ? low : high;

            return (
              <g key={d.label}>
                <text
                  x={d.x + BAR_WIDTH / 2}
                  y={labelY}
                  textAnchor="middle"
                  className="fill-ink font-serif text-[34px]"
                >
                  {display}%
                </text>
                <rect
                  x={d.x}
                  y={y}
                  width={BAR_WIDTH}
                  height={height}
                  rx="6"
                  fill={d.colour}
                  className="transition-transform duration-[1100ms] ease-out"
                  style={{
                    transform: visible ? 'scaleY(1)' : 'scaleY(0)',
                    transformBox: 'fill-box',
                    transformOrigin: 'bottom',
                  }}
                />
                <text
                  x={d.x + BAR_WIDTH / 2}
                  y="248"
                  textAnchor="middle"
                  className="fill-ink-soft text-sm font-semibold"
                >
                  {d.label}
                </text>
                <text
                  x={d.x + BAR_WIDTH / 2}
                  y="268"
                  textAnchor="middle"
                  className={`text-xs ${d.value < 1 ? 'fill-brass-deep' : 'fill-ink-mute'}`}
                >
                  {d.sublabel}
                </text>
              </g>
            );
          })}
        </svg>
        <figcaption className="mt-6 text-center text-sm text-ink-mute">
          Major complication rates after AF ablation, by centre volume.
          <sup>2, 4</sup> Published research consistently finds lower complication rates where more of these
          procedures are done.
        </figcaption>
      </figure>
    </div>
  );
}
