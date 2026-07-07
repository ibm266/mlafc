'use client';

import { useEffect, type RefObject } from 'react';

export function useStrokeDraw(
  pathRef: RefObject<SVGPathElement | null>,
  visible: boolean,
  duration = 2400,
) {
  useEffect(() => {
    const path = pathRef.current;
    if (!path || typeof path.getTotalLength !== 'function') return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const len = path.getTotalLength();
    path.style.strokeDasharray = String(len);

    if (reduce) {
      path.style.strokeDashoffset = '0';
      return;
    }

    if (!visible) {
      path.style.strokeDashoffset = String(len);
      return;
    }

    let raf = 0;
    let start = 0;

    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - (1 - p) ** 2;
      path.style.strokeDashoffset = String(len * (1 - eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [pathRef, visible, duration]);
}
