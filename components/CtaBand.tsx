import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { WhatsAppIcon } from '@/components/WhatsAppIcon';
import { site } from '@/data/site';
import { whatsappLink } from '@/lib/contact';

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="bg-ink text-paper">
      <div className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Reveal>
          <h2 id="cta-heading" className="font-serif text-4xl leading-tight md:text-5xl">
            Take the first step. <em className="text-brass">It costs nothing to ask.</em>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-paper/85">
            Send a short enquiry and the clinic team will come back to you, or reach us straight away on WhatsApp.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/book"
              className="interactive inline-block rounded-full bg-brass px-7 py-3.5 font-semibold text-night hover:bg-brass-deep hover:text-paper"
            >
              Send an enquiry
            </Link>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="interactive inline-flex items-center gap-2 rounded-full border border-brass px-6 py-3 font-semibold text-brass hover:bg-brass hover:text-night"
            >
              <WhatsAppIcon size={20} />
              Message on WhatsApp
            </a>
          </div>
          <p className="mt-6 text-sm text-paper/70">
            Or call{' '}
            <a href={site.phoneHref} className="interactive font-semibold text-brass hover:underline">
              {site.phone}
            </a>{' '}
            and email{' '}
            <a href={`mailto:${site.email}`} className="interactive font-semibold text-brass hover:underline">
              {site.email}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
