'use client';

import { useRef, useState } from 'react';
import { NightCtaCard } from '@/components/NightCtaCard';
import { Reveal } from '@/components/Reveal';
import { TestimonialReviewDialog } from '@/components/TestimonialReviewDialog';
import { VoicesFeaturedGallery } from '@/components/VoicesFeaturedGallery';
import { VoicesQuoteCard } from '@/components/VoicesQuoteCard';
import linksJson from '@/data/links.json';
import testimonialsJson from '@/data/testimonials.json';
import type { PressLink, SiteLinks, Testimonial } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];
const links = linksJson as SiteLinks;

const FEATURED_IDS = {
  hospital: 'hosp1',
  patient: 'pat3',
  peer: 'peer2',
} as const;

function findTestimonial(id: string) {
  return testimonials.find((t) => t.id === id)!;
}

function PressCard({ item }: { item: PressLink }) {
  return (
    <article className="flex flex-col rounded-xl border border-line bg-white p-6">
      <div className="flex items-baseline justify-between gap-2 border-b border-line pb-3">
        <span className="font-serif text-lg text-ink">{item.outlet}</span>
        <span className="text-xs text-ink-mute">{item.date}</span>
      </div>
      <h3 className="mt-3 text-base leading-snug text-ink">{item.headline}</h3>
      {item.note ? <p className="mt-3 flex-1 text-sm text-ink-soft">{item.note}</p> : <div className="flex-1" />}
      <footer className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-ink-mute">
        {item.credit ? <span>{item.credit}</span> : <span />}
        {item.url ? (
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="arrow-link text-sm font-semibold text-brass-deep hover:underline"
          >
            Read article ↗
          </a>
        ) : null}
      </footer>
    </article>
  );
}

export function VoicesContent() {
  const [review, setReview] = useState<Testimonial | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const hospitalRefs = testimonials.filter(
    (t) => t.category === 'hospital' && t.id !== FEATURED_IDS.hospital,
  );
  const patients = testimonials.filter((t) => t.category === 'patient');
  const peers = testimonials.filter((t) => t.category === 'peer');
  const pressFeatured = links.press.filter((p) => p.featured);
  const pressMore = links.press.filter((p) => !p.featured);

  const featuredSlides = [
    {
      id: 'featured-hospitals',
      eyebrow: 'From the hospitals',
      title: 'What his own institutions put in writing.',
      testimonial: findTestimonial(FEATURED_IDS.hospital),
      seeAllLabel: 'See all hospitals',
      sectionId: 'hospitals',
    },
    {
      id: 'featured-patients',
      eyebrow: 'From patients',
      title: 'The people he has treated.',
      testimonial: findTestimonial(FEATURED_IDS.patient),
      seeAllLabel: 'See all patients',
      sectionId: 'patients',
    },
    {
      id: 'featured-peers',
      eyebrow: 'From peers',
      title: 'The doctors who refer to him.',
      testimonial: findTestimonial(FEATURED_IDS.peer),
      seeAllLabel: 'See all peers',
      sectionId: 'peers',
    },
  ];

  const openReview = (testimonial: Testimonial) => {
    setReview(testimonial);
    dialogRef.current?.showModal();
  };

  const closeReview = () => {
    setReview(null);
  };

  return (
    <>
      <VoicesFeaturedGallery slides={featuredSlides} />

      <section id="hospitals" aria-labelledby="hospitals-heading" className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              01 · From the hospitals
            </p>
            <h2 id="hospitals-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
              What his own institutions put in writing.
            </h2>
          </Reveal>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hospitalRefs.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <VoicesQuoteCard t={t} onReadMore={openReview} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="patients" aria-labelledby="patients-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              02 · From patients
            </p>
            <h2 id="patients-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
              The people he has treated.
            </h2>
          </Reveal>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {patients.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <VoicesQuoteCard t={t} onReadMore={openReview} quoteClassName="font-serif text-lg leading-relaxed text-ink" />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="peers" aria-labelledby="peers-heading" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              03 · From peers
            </p>
            <h2 id="peers-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
              The doctors who refer to him.
            </h2>
          </Reveal>
          <div className="mt-11 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {peers.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <VoicesQuoteCard t={t} onReadMore={openReview} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="press-heading" className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-20">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              04 · In the press
            </p>
            <h2 id="press-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
              Covered across India.
            </h2>
          </Reveal>
          <div className="mt-11 grid gap-5 lg:grid-cols-2">
            {pressFeatured.map((item, i) => (
              <Reveal key={`${item.outlet}-${item.headline}`} delay={i * 70}>
                <PressCard item={item} />
              </Reveal>
            ))}
          </div>
          {pressMore.length > 0 ? (
            <Reveal delay={120} className="mt-10">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">More coverage</h3>
              <div className="mt-2 border-t border-line">
                {pressMore.map((item) => (
                  <div
                    key={`${item.outlet}-${item.headline}`}
                    className="flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line py-3.5"
                  >
                    <span className="min-w-[170px] font-semibold text-ink">{item.outlet}</span>
                    <span className="min-w-[220px] flex-1 text-ink-soft">{item.headline}</span>
                    <span className="text-xs text-ink-mute">{item.date}</span>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-brass-deep hover:underline"
                      >
                        Read ↗
                      </a>
                    ) : null}
                  </div>
                ))}
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-5 pb-20">
          <NightCtaCard
            idPrefix="voices-cta"
            title={
              <>
                Hear it for yourself. <em className="text-brass">Start with a conversation.</em>
              </>
            }
            description="A short enquiry costs nothing, and every one is answered."
            footnote="Next Mumbai visit: March 2026 · Booking open"
          />
        </div>
      </section>

      <TestimonialReviewDialog testimonial={review} dialogRef={dialogRef} onClose={closeReview} />
    </>
  );
}
