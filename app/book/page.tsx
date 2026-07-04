import type { Metadata } from 'next';
import { Reveal } from '@/components/Reveal';
import { EnquiryForm } from '@/components/EnquiryForm';
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
  return (
    <main id="main" className="bg-paper">
      <section className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">Book a consultation</p>
          <h1 className="mt-3 max-w-2xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight">
            Start with a <em className="text-brass-deep">conversation</em>.
          </h1>
          <p className="mt-5 max-w-xl text-ink-soft">
            Tell us a little about the problem. The clinic team will contact you within {site.responseDays} working
            days to arrange the next step.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-[3fr_2fr]">
          <Reveal className="rounded-lg border border-line bg-white p-8">
            <EnquiryForm />
          </Reveal>
          <div className="space-y-6">
            <Reveal delay={100} className="rounded-lg border border-line bg-paper-soft p-8">
              <h2 className="font-serif text-2xl">Prefer to talk directly?</h2>
              <ul className="mt-5">
                <li>
                  <a
                    href={site.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-2.5 font-semibold text-brass-deep hover:underline"
                  >
                    Message on WhatsApp →
                  </a>
                </li>
                <li>
                  <a href={`tel:${site.phone}`} className="inline-block py-2.5 font-semibold text-brass-deep hover:underline">
                    {site.phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${site.email}`} className="inline-block py-2.5 font-semibold text-brass-deep hover:underline">
                    {site.email}
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <Reveal>
            <h2 className="font-serif text-3xl">Upcoming Mumbai visits.</h2>
          </Reveal>
          <div className="mt-8">
            <VisitDates visits={visits} />
          </div>
        </div>
      </section>
    </main>
  );
}
