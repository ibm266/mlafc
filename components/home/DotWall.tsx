'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/lib/useReveal';

const COLS = 250;
const ROWS = 40;
const TOTAL = 10000;

export function DotWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!visible && !reduce) {
      setCount(0);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      setCount(TOTAL);
      return;
    }

    const pw = canvas.width / COLS;
    const ph = canvas.height / ROWS;
    let done = 0;

    const drawTo = (n: number) => {
      ctx.fillStyle = '#B08D3E';
      ctx.globalAlpha = 0.8;
      for (let i = done; i < n; i++) {
        const c = i % COLS;
        const r = Math.floor(i / COLS);
        ctx.beginPath();
        ctx.arc(c * pw + pw / 2, r * ph + ph / 2, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }
      done = n;
      setCount(n);
    };

    if (reduce) {
      drawTo(TOTAL);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const dur = 3600;

    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const n = Math.round(TOTAL * p ** 2.6);
      drawTo(n);
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
      <p className="mt-4 text-center">
        <span className="flex items-baseline justify-center gap-2">
          <span className="font-serif text-4xl tabular-nums text-ink">
            {count.toLocaleString('en-GB')}
          </span>
          <span className="text-[0.95rem] text-ink-mute">and counting</span>
        </span>
        <span className="mt-1.5 block text-sm text-ink-mute">
          AF ablations performed by Professor Gupta. Every dot is one.
        </span>
      </p>
    </div>
  );
}
