import { EnquiryForm } from '@/components/EnquiryForm';
import { Reveal } from '@/components/Reveal';
import { site } from '@/data/site';

export function CtaBand() {
  return (
    <section aria-labelledby="cta-heading" className="bg-ink text-paper">
      <div className="mx-auto grid max-w-6xl items-start gap-12 px-5 py-20 md:grid-cols-2">
        <Reveal>
          <h2 id="cta-heading" className="font-serif text-4xl leading-tight">
            Take the first step. <em className="text-brass">It costs nothing to ask.</em>
          </h2>
          <p className="mt-4 max-w-md text-paper/85">
            Send a short enquiry and the clinic team will come back to you, or message us directly on WhatsApp.
          </p>
          <a
            href={site.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="interactive mt-6 inline-block rounded-full border border-brass px-6 py-3 font-semibold text-brass hover:bg-brass hover:text-night"
          >
            Message on WhatsApp
          </a>
        </Reveal>
        <Reveal delay={120} className="rounded-lg bg-paper p-6 text-ink">
          <EnquiryForm compact />
        </Reveal>
      </div>
    </section>
  );
}
