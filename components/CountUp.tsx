'use client';

import { useEffect, useState } from 'react';
import { usePrefersReducedMotion, useReveal } from '@/lib/useReveal';

type Props = {
  to: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
};

export function CountUp({ to, prefix = '', suffix = '', duration = 1400 }: Props) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;

    if (reduced) {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));

      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [visible, reduced, to, duration]);

  return (
    <span ref={ref}>
      {prefix}
      {value.toLocaleString('en-GB')}
      {suffix}
    </span>
  );
}
