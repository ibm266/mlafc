'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  buildNormalRhythmPath,
  ECG_COMPLETE_HOLD,
  ECG_LAYOUT,
  ECG_VARIANTS,
  type EcgVariant,
} from '@/lib/ecg/paths';
import { EcgStrip } from '@/components/conditions/EcgStrip';

type Phase = 'normal' | 'hold' | 'abnormal' | 'complete';

type Props = {
  alt: string;
  variant: EcgVariant;
};

const LOOP_MS = 8800;
const NORMAL_END = 0.4;
const HOLD_END = 0.46;

function loopScale(abnormalPhaseEnd: number): number {
  return Math.min(1, abnormalPhaseEnd + ECG_COMPLETE_HOLD);
}

function phaseProgress(
  t: number,
  abnormalPhaseEnd: number,
): { phase: Phase; normal: number; abnormal: number } {
  if (t < NORMAL_END) {
    return { phase: 'normal', normal: t / NORMAL_END, abnormal: 0 };
  }
  if (t < HOLD_END) {
    return { phase: 'hold', normal: 1, abnormal: 0 };
  }
  if (t < abnormalPhaseEnd) {
    const local = (t - HOLD_END) / (abnormalPhaseEnd - HOLD_END);
    return { phase: 'abnormal', normal: 1, abnormal: local };
  }
  return { phase: 'complete', normal: 1, abnormal: 1 };
}

export function EcgComparisonAnimation({ alt, variant }: Props) {
  const [t, setT] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const loopStartRef = useRef<number>(0);
  const filterId = useId().replace(/:/g, '');

  const { stripPaddingX, stripWidth, normalY, abnormalY, viewWidth, viewHeight } = ECG_LAYOUT;
  const offsetX = stripPaddingX;
  const { label, buildAbnormal, abnormalPhaseEnd } = ECG_VARIANTS[variant];
  const scale = loopScale(abnormalPhaseEnd);

  const normalPath = buildNormalRhythmPath(stripWidth, normalY);
  const abnormalPath = buildAbnormal(stripWidth, abnormalY);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry?.isIntersecting ?? false),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      cancelAnimationFrame(rafRef.current);
      setT(1);
      return;
    }

    if (!inView) {
      cancelAnimationFrame(rafRef.current);
      return;
    }

    loopStartRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - loopStartRef.current;
      let rawT = (elapsed % LOOP_MS) / LOOP_MS;

      if (rawT >= scale) {
        loopStartRef.current = now;
        rawT = 0;
      }

      setT(rawT / scale);
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [reducedMotion, inView, scale]);

  const { phase, normal, abnormal } = reducedMotion
    ? { phase: 'hold' as Phase, normal: 1, abnormal: 1 }
    : phaseProgress(t, abnormalPhaseEnd);

  return (
    <figure
      ref={containerRef}
      className="overflow-hidden rounded-lg border border-line-dark bg-night shadow-[0_8px_32px_color-mix(in_srgb,var(--color-ink)_18%,transparent)]"
      aria-label={alt}
    >
      <svg
        viewBox={`0 0 ${viewWidth} ${viewHeight}`}
        className="aspect-video w-full"
        role="img"
        aria-hidden={!alt ? true : undefined}
      >
        <defs>
          <pattern id={`ecg-grid-${filterId}`} width="24" height="24" patternUnits="userSpaceOnUse">
            <path
              d="M 24 0 L 0 0 0 24"
              fill="none"
              stroke="#2A4254"
              strokeWidth="0.5"
              opacity="0.45"
            />
          </pattern>
          <filter id={`ecg-dot-glow-${filterId}`} x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="6.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id={`ecg-fade-${filterId}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0C1F2B" stopOpacity="0" />
            <stop offset="8%" stopColor="#0C1F2B" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0C1F2B" stopOpacity="0" />
          </linearGradient>
        </defs>

        <rect width={viewWidth} height={viewHeight} fill="#0C1F2B" />
        <rect width={viewWidth} height={viewHeight} fill={`url(#ecg-grid-${filterId})`} opacity="0.35" />

        {[
          [20, 20],
          [viewWidth - 20, 20],
          [20, viewHeight - 20],
          [viewWidth - 20, viewHeight - 20],
        ].map(([cx, cy], i) => (
          <g key={i} stroke="#3A5468" strokeWidth="0.75" opacity="0.7">
            <line x1={cx - 6} y1={cy} x2={cx + 6} y2={cy} />
            <line x1={cx} y1={cy - 6} x2={cx} y2={cy + 6} />
          </g>
        ))}

        <rect x={32} y={72} width={576} height={88} rx={4} fill="#16303F" opacity="0.35" />
        <rect x={32} y={202} width={576} height={88} rx={4} fill="#16303F" opacity="0.35" />

        <g transform={`translate(${offsetX}, 0)`}>
          <EcgStrip
            path={normalPath}
            label="Normal rhythm"
            progress={normal}
            active={phase === 'normal'}
            y={normalY}
            glowFilterId={`ecg-dot-glow-${filterId}`}
          />
          <EcgStrip
            path={abnormalPath}
            label={label}
            progress={abnormal}
            active={phase === 'abnormal'}
            y={abnormalY}
            glowFilterId={`ecg-dot-glow-${filterId}`}
          />
        </g>

        <rect width={viewWidth} height={viewHeight} fill={`url(#ecg-fade-${filterId})`} opacity="0.15" pointerEvents="none" />
      </svg>
    </figure>
  );
}
