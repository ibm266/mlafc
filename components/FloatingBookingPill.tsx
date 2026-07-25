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

// A phone screen is mostly reading space, so somebody who has seen the prompt
// can shrink it to a circle. The choice rides out the session so it does not
// pop back open on the next page.
const COLLAPSED_KEY = 'mlafc:booking-pill-collapsed';

export function FloatingBookingPill() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(COLLAPSED_KEY) === '1') {
        setCollapsed(true);
      }
    } catch {
      // Private browsing can block storage; the pill just stays expanded.
    }
  }, []);

  const collapse = () => {
    setCollapsed(true);
    try {
      window.sessionStorage.setItem(COLLAPSED_KEY, '1');
    } catch {
      // See above.
    }
  };

  return (
    <div
      className={`fixed bottom-5 right-5 z-[55] transition-[opacity,transform] duration-300 ${
        visible ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-3 opacity-0'
      }`}
    >
      <div className="relative">
        <Link
          href="/book"
          aria-label={collapsed ? 'Send an enquiry' : undefined}
          className={`flex items-center rounded-full bg-night font-semibold text-paper shadow-[0_12px_32px_rgba(6,15,21,0.35)] transition-colors hover:bg-night-soft md:h-auto md:w-auto md:gap-2.5 md:px-5 md:py-3.5 md:text-sm ${
            collapsed
              ? 'h-14 w-14 justify-center'
              : 'max-w-[calc(100vw-2.5rem)] gap-2.5 px-5 py-3.5 text-sm md:max-w-none'
          }`}
        >
          <span
            aria-hidden
            className={`pulse-dot h-2 w-2 shrink-0 rounded-full bg-brass ${
              collapsed ? 'hidden md:inline-block' : 'inline-block'
            }`}
          />
          <svg
            aria-hidden
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={collapsed ? 'md:hidden' : 'hidden'}
          >
            <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
            <path d="m3.5 6.5 8.5 6 8.5-6" />
          </svg>
          <span className={collapsed ? 'sr-only md:not-sr-only' : ''}>{pillLabel}</span>
        </Link>

        {collapsed ? null : (
          <button
            type="button"
            onClick={collapse}
            aria-label="Collapse the booking prompt"
            className="interactive absolute -right-2.5 -top-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-line-dark bg-ink text-paper shadow-md md:hidden"
          >
            <svg
              aria-hidden
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="m3 3 8 8M11 3l-8 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
