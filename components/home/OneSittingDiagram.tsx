'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/lib/useReveal';
import type { TripStep } from '@/data/types';

const LINE_START = 28;
const LINE_END = 372;
const LINE_Y = 60;
const FIRST_NODE_X = 105;
const LAST_NODE_X = 295;
const BRACKET_Y = 106;
const BRACKET_TICK = 8;

/** Evenly spaces however many steps a visit combined, two in the usual case. */
function nodeX(index: number, count: number): number {
  if (count < 2) return (FIRST_NODE_X + LAST_NODE_X) / 2;
  return FIRST_NODE_X + ((LAST_NODE_X - FIRST_NODE_X) * index) / (count - 1);
}

type Props = {
  steps: TripStep[];
  duration: string;
};

/**
 * The combined procedures on one timeline, under a bracket that says they
 * happened in a single sitting. The line draws itself when the diagram comes
 * into view. Under reduced motion, and in environments without
 * `getTotalLength`, the finished line is shown at once.
 *
 * The type is sized for the narrowest phone the card has to hold: at 335px
 * wide the 400-unit viewBox scales the step labels to about 10px.
 */
export function OneSittingDiagram({ steps, duration }: Props) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const lineRef = useRef<SVGLineElement>(null);
  const [length, setLength] = useState<number | null>(null);

  useEffect(() => {
    const line = lineRef.current;
    if (!line || typeof line.getTotalLength !== 'function') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setLength(line.getTotalLength());
  }, []);

  const draw =
    length === null
      ? undefined
      : {
          strokeDasharray: String(length),
          strokeDashoffset: String(visible ? 0 : length),
          transition: 'stroke-dashoffset 1.6s cubic-bezier(0.22,0.61,0.36,1)',
        };

  const stepList = steps.map((step) => step.label).join(' and ');

  return (
    <div ref={ref}>
      <svg
        viewBox="0 0 400 132"
        role="img"
        aria-label={`${stepList}, done in one procedure lasting ${duration}.`}
        className="block h-auto w-full"
      >
        <line
          ref={lineRef}
          x1={LINE_START}
          y1={LINE_Y}
          x2={LINE_END}
          y2={LINE_Y}
          stroke="#122B3A"
          strokeWidth="1.5"
          strokeLinecap="round"
          style={draw}
        />
        {steps.map((step, i) => {
          const x = nodeX(i, steps.length);

          return (
            <g key={step.label}>
              <circle className="halo" cx={x} cy={LINE_Y} r="14" fill="#B08D3E" />
              <circle cx={x} cy={LINE_Y} r="5.5" fill="#B08D3E" />
              <text
                x={x}
                y="32"
                textAnchor="middle"
                fill="#6E5826"
                fontSize="12"
                fontWeight="600"
                letterSpacing="0.1em"
                className="font-sans"
              >
                {step.label.toUpperCase()}
              </text>
              <text x={x} y="88" textAnchor="middle" fill="#556675" fontSize="11" className="font-sans">
                {step.detail}
              </text>
            </g>
          );
        })}
        <path
          d={`M ${LINE_START} ${BRACKET_Y - BRACKET_TICK} L ${LINE_START} ${BRACKET_Y} L ${LINE_END} ${BRACKET_Y} L ${LINE_END} ${BRACKET_Y - BRACKET_TICK}`}
          fill="none"
          stroke="#B08D3E"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
        <text
          x={(LINE_START + LINE_END) / 2}
          y="124"
          textAnchor="middle"
          fill="#6E5826"
          fontSize="11"
          fontWeight="600"
          letterSpacing="0.16em"
          className="font-sans"
        >
          {`ONE PROCEDURE · ${duration}`}
        </text>
      </svg>
    </div>
  );
}
