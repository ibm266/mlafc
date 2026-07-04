'use client';

import { useState } from 'react';
import type { Faq } from '@/data/types';

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
                className="flex w-full items-center justify-between gap-4 text-left font-serif text-xl"
              >
                {f.question}
                <span
                  aria-hidden
                  className={`text-brass-deep transition-transform ${open ? 'rotate-45' : ''}`}
                >
                  +
                </span>
              </button>
            </h3>
            {open ? (
              <p id={`faq-panel-${i}`} className="mt-3 max-w-2xl text-ink-soft">
                {f.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
