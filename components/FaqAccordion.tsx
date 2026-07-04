'use client';

import { useState } from 'react';
import type { Faq } from '@/data/types';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      className={`shrink-0 text-brass-deep transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
    >
      <path
        d="M5 8l5 5 5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {faqs.map((f, i) => {
        const open = openIndex === i;

        return (
          <div key={f.question} className="py-4">
            <h3>
              <button
                type="button"
                aria-expanded={open}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpenIndex(open ? null : i)}
                className="interactive flex w-full cursor-pointer items-center justify-between gap-4 text-left font-serif text-xl"
              >
                {f.question}
                <ChevronIcon open={open} />
              </button>
            </h3>
            <div
              id={`faq-panel-${i}`}
              className={`faq-panel ${open ? 'faq-panel-open' : 'faq-panel-closed'}`}
            >
              <div className="faq-panel-inner">
                <p className="pt-3 max-w-2xl text-ink-soft">{f.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
