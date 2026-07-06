'use client';

import { useEffect, useRef } from 'react';
import { useReveal } from '@/lib/useReveal';

const COLS = 250;
const ROWS = 40;
const TOTAL = 10000;

export function DotWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, visible } = useReveal<HTMLDivElement>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const pw = canvas.width / COLS;
    const ph = canvas.height / ROWS;

    const drawTo = (n: number, from = 0) => {
      ctx.fillStyle = '#B08D3E';
      ctx.globalAlpha = 0.8;
      for (let i = from; i < n; i++) {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        ctx.beginPath();
        ctx.arc(c * pw + pw / 2, r * ph + ph / 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !visible) {
      drawTo(visible || reduce ? TOTAL : 0);
      return;
    }

    let raf = 0;
    let done = 0;
    const start = performance.now();
    const dur = 2600;

    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const n = Math.round(TOTAL * (1 - (1 - p) ** 2));
      drawTo(n, done);
      done = n;
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [visible]);

  return (
    <div ref={ref}>
      <canvas
        ref={canvasRef}
        width={1112}
        height={185}
        aria-hidden
        className="block h-auto w-full"
      />
      <p className="mt-3.5 text-sm text-ink-mute">
        Every dot is one AF ablation performed by Professor Gupta. 10,000 and counting.
      </p>
    </div>
  );
}
