'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Props = {
  path: string;
  label?: string;
  progress: number;
  active: boolean;
  y: number;
  glowFilterId: string;
  variant?: 'monitor' | 'paper';
};

const STRIP_COLORS = {
  monitor: {
    label: '#F7F5F1',
    ghost: '#B08D3E',
    ghostOpacity: 0.2,
    trace: '#B08D3E',
    traceWidth: 1.75,
    glow: '#B08D3E',
    core: '#F7F5F1',
  },
  paper: {
    label: '#3A5468',
    ghost: '#B08D3E',
    ghostOpacity: 0.16,
    trace: '#B08D3E',
    traceWidth: 1.5,
    glow: '#B08D3E',
    core: '#F7F5F1',
  },
} as const;

export function EcgStrip({
  path,
  label,
  progress,
  active,
  y,
  glowFilterId,
  variant = 'monitor',
}: Props) {
  const colors = STRIP_COLORS[variant];
  const pathRef = useRef<SVGPathElement>(null);
  const glowRef = useRef<SVGCircleElement>(null);
  const coreRef = useRef<SVGCircleElement>(null);
  const [length, setLength] = useState(0);

  useLayoutEffect(() => {
    const el = pathRef.current;
    if (!el || typeof el.getTotalLength !== 'function') return;
    setLength(el.getTotalLength());
  }, [path]);

  useEffect(() => {
    const el = pathRef.current;
    const glow = glowRef.current;
    const core = coreRef.current;
    if (!el || !glow || !core || length === 0 || typeof el.getPointAtLength !== 'function') return;

    const clamped = Math.max(0, Math.min(1, progress));
    const drawTo = clamped * length;
    const point = el.getPointAtLength(drawTo);
    const showDot = active && clamped > 0.01 && clamped < 0.995;
    const opacity = showDot ? '1' : '0';

    glow.setAttribute('cx', String(point.x));
    glow.setAttribute('cy', String(point.y));
    glow.setAttribute('opacity', showDot ? '0.85' : '0');
    core.setAttribute('cx', String(point.x));
    core.setAttribute('cy', String(point.y));
    core.setAttribute('opacity', opacity);
  }, [progress, length, active]);

  const clamped = Math.max(0, Math.min(1, progress));
  const dashOffset = length > 0 ? length * (1 - clamped) : 0;

  return (
    <g>
      {label ? (
        <text
          x={0}
          y={y - 34}
          fill={colors.label}
          fontSize={13}
          fontWeight={500}
          letterSpacing="0.04em"
          style={{ fontFamily: 'var(--font-archivo), system-ui, sans-serif' }}
        >
          {label}
        </text>
      ) : null}

      <path
        d={path}
        fill="none"
        stroke={colors.ghost}
        strokeWidth={colors.traceWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity={colors.ghostOpacity}
      />

      <path
        ref={pathRef}
        d={path}
        fill="none"
        stroke={colors.trace}
        strokeWidth={colors.traceWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={length || undefined}
        strokeDashoffset={dashOffset}
        opacity={clamped > 0 ? 1 : 0}
      />

      <circle ref={glowRef} r={variant === 'paper' ? 7 : 9} fill={colors.glow} filter={`url(#${glowFilterId})`} opacity={0} />
      <circle ref={coreRef} r={variant === 'paper' ? 2 : 2.5} fill={colors.core} opacity={0} />
    </g>
  );
}
