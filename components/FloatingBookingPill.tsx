'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function FloatingBookingPill() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <Link
      href="/book"
      className={`fixed bottom-6 right-6 z-[55] flex items-center gap-2.5 rounded-full bg-night px-5 py-3.5 text-sm font-semibold text-paper shadow-[0_12px_32px_rgba(6,15,21,0.35)] transition-[opacity,transform] duration-300 hover:bg-night-soft ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span aria-hidden className="pulse-dot inline-block h-2 w-2 rounded-full bg-brass" />
      Next Mumbai visit: March 2026 · Booking open
    </Link>
  );
}
