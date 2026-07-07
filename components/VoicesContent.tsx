'use client';

import { LinkNeededFlag } from '@/components/LinkNeededFlag';
import { NightCtaCard } from '@/components/NightCtaCard';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import testimonialsJson from '@/data/testimonials.json';
import type { PressLink, SiteLinks, Testimonial } from '@/data/types';

const testimonials = testimonialsJson as Testimonial[];
const links = linksJson as SiteLinks;

function HospitalLetter({ t }: { t: Testimonial }) {
  if (!t.letter) return null;

  return (
    <div className="mx-auto mt-11 max-w-3xl rounded border border-line bg-[#FFFEFB] p-8 shadow-[0_24px_56px_rgba(18,43,58,0.1)] md:p-14">
      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">{t.letter.tag}</p>
          <p className="mt-2 font-serif text-xl text-ink md:text-2xl">{t.letter.org}</p>
          <p className="text-sm text-ink-mute">{t.letter.subtitle}</p>
        </div>
        <p className="shrink-0 text-sm text-ink-mute">{t.letter.date}</p>
      </div>
      <div className="mt-7 space-y-4 font-serif text-lg leading-relaxed text-ink">
        {t.letter.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-3.5 text-sm text-ink-soft">
        <span aria-hidden className="inline-block h-0.5 w-9 bg-brass" />
        <p>
          <strong className="text-ink">{t.letter.sigName}</strong> · {t.letter.sigRole}
        </p>
      </div>
    </div>
  );
}

function ReferenceCard({ t }: { t: Testimonial }) {
  const tag = t.letter?.tag ?? 'Hospital reference';

  return (
    <article className="card-lift flex flex-col rounded-xl border border-line bg-white p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.14em] text-brass-deep">{tag}</div>
      <p className="mt-3 flex-1 text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
      <footer className="mt-4 text-sm">
        <strong className="block text-ink">{t.attribution}</strong>
        <span className="text-ink-mute">
          {t.detail}
          {t.letter?.date ? ` · ${t.letter.date.replace('Issued ', '')}` : ''}
        </span>
      </footer>
    </article>
  );
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
        ) : (
          <LinkNeededFlag />
        )}
      </footer>
    </article>
  );
}

export function VoicesContent() {
  const leadLetter = testimonials.find((t) => t.id === 'hosp1');
  const hospitalRefs = testimonials.filter((t) => t.category === 'hospital' && t.id !== 'hosp1');
  const patients = testimonials.filter((t) => t.category === 'patient');
  const peers = testimonials.filter((t) => t.category === 'peer');
  const pressFeatured = links.press.filter((p) => p.featured);
  const pressMore = links.press.filter((p) => !p.featured);

  return (
    <>
      <section aria-labelledby="hospitals-heading" className="bg-paper">
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
          {leadLetter ? (
            <Reveal delay={100}>
              <HospitalLetter t={leadLetter} />
            </Reveal>
          ) : null}
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {hospitalRefs.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <ReferenceCard t={t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="patients-heading" className="border-t border-line bg-paper-soft">
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
                <article className="card-lift flex flex-col rounded-xl border border-line bg-white p-6">
                  <p className="flex-1 font-serif text-lg leading-relaxed text-ink">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-4 text-sm">
                    <strong className="block text-ink">{t.attribution}</strong>
                    {t.detail ? <span className="text-ink-mute">{t.detail}</span> : null}
                  </footer>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="peers-heading" className="border-t border-line bg-paper">
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
          <div className="mt-11 grid gap-0 sm:grid-cols-2">
            {peers.map((t, i) => (
              <Reveal key={t.id} delay={i * 60}>
                <blockquote className="border-t border-line py-7 pr-0 sm:pr-7">
                  <p className="text-ink-soft">&ldquo;{t.quote}&rdquo;</p>
                  <footer className="mt-3 text-sm">
                    <strong className="block text-ink">{t.attribution}</strong>
                    {t.detail ? <span className="text-ink-mute">{t.detail}</span> : null}
                  </footer>
                </blockquote>
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
              Covered across India, March 2025.
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
                    ) : (
                      <LinkNeededFlag label="link needed" />
                    )}
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
    </>
  );
}
