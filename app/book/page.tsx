import type { Metadata } from 'next';
import { EnquiryForm } from '@/components/EnquiryForm';
import { PageHeader } from '@/components/PageHeader';
import { Reveal } from '@/components/Reveal';
import { ScrollProgress } from '@/components/ScrollProgress';
import { VisitDates } from '@/components/VisitDates';
import { site } from '@/data/site';
import visitsJson from '@/data/visits.json';
import type { Visit } from '@/data/types';

const visits = visitsJson as Visit[];

export const metadata: Metadata = {
  title: 'Book a Consultation - Mumbai London AF Clinic',
  description:
    'Send an enquiry or message the clinic on WhatsApp to book a consultation with Professor Dhiraj Gupta in Mumbai.',
};

export default function BookPage() {
  const phoneHref = site.phone.includes('[placeholder]') ? undefined : `tel:${site.phone}`;
  const emailHref = site.email.includes('[placeholder]') ? undefined : `mailto:${site.email}`;

  return (
    <main id="main" className="bg-paper">
      <ScrollProgress />
      <PageHeader
        idPrefix="book"
        eyebrow="Book a consultation"
        title={
          <>
            Start with a <em className="text-brass">conversation</em>.
          </>
        }
        description={`Tell us a little about the problem. The clinic team will contact you within ${site.responseDays} working days to arrange the next step.`}
      />

      <section className="bg-paper">
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 lg:grid-cols-[3fr_2fr] lg:gap-12">
          <Reveal className="rounded-xl border border-line bg-white p-8 md:p-10">
            <EnquiryForm />
          </Reveal>

          <div className="space-y-5">
            <Reveal delay={100} className="rounded-xl border border-line bg-paper-soft p-8">
              <h2 className="font-serif text-2xl">Prefer to talk directly?</h2>
              <ul className="mt-5 divide-y divide-line">
                <li>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive block py-3.5 font-semibold text-brass-deep hover:underline"
                  >
                    Message on WhatsApp &rarr;
                  </a>
                </li>
                <li>
                  {phoneHref ? (
                    <a href={phoneHref} className="interactive block py-3.5 font-semibold text-brass-deep hover:underline">
                      {site.phone}
                    </a>
                  ) : (
                    <span className="block py-3.5 font-semibold text-brass-deep">{site.phone}</span>
                  )}
                </li>
                <li>
                  {emailHref ? (
                    <a href={emailHref} className="interactive block py-3.5 font-semibold text-brass-deep hover:underline">
                      {site.email}
                    </a>
                  ) : (
                    <span className="block py-3.5 font-semibold text-brass-deep">{site.email}</span>
                  )}
                </li>
              </ul>
            </Reveal>

            <Reveal delay={160} className="rounded-xl border border-line bg-white p-8">
              <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">What happens next</h3>
              <ol className="mt-4 space-y-3.5 text-sm text-ink-soft">
                <li className="flex gap-3">
                  <span className="font-serif text-brass">i.</span>
                  The clinic team reviews your enquiry and calls you back.
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-brass">ii.</span>
                  A consultation is arranged during the next Mumbai visit, or by video if sooner is better.
                </li>
                <li className="flex gap-3">
                  <span className="font-serif text-brass">iii.</span>
                  You leave with a clear plan, whether or not it includes a procedure.
                </li>
              </ol>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-paper-soft">
        <div className="mx-auto max-w-6xl px-5 py-16">
          <Reveal>
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              Plan ahead
            </p>
            <h2 className="mt-3 font-serif text-4xl">Upcoming Mumbai visits.</h2>
          </Reveal>
          <div className="mt-8">
            <VisitDates visits={visits} />
          </div>
        </div>
      </section>
    </main>
  );
}
