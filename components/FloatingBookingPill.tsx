'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import visitsJson from '@/data/visits.json';
import type { Visit } from '@/data/types';

const visits = visitsJson as Visit[];

// The pill exists to convert, so it advertises the next visit somebody can
// actually book, not simply the next one in the calendar. Reading it from the
// data means it cannot drift out of date the way a hardcoded month did.
const nextBookable = visits.find((v) => v.status === 'open');
const pillLabel = nextBookable
  ? `Next Mumbai visit: ${nextBookable.month} · Booking open`
  : 'Book a consultation';

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
      className={`fixed bottom-[5.5rem] right-5 z-[55] flex items-center gap-2.5 rounded-full bg-night px-5 py-3.5 text-sm font-semibold text-paper shadow-[0_12px_32px_rgba(6,15,21,0.35)] transition-[opacity,transform] duration-300 hover:bg-night-soft ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <span aria-hidden className="pulse-dot inline-block h-2 w-2 rounded-full bg-brass" />
      {pillLabel}
    </Link>
  );
}
