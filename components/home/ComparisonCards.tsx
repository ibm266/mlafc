import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

export function ComparisonCards() {
  return (
    <section aria-labelledby="compare-heading" className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass-deep">RFA and PFA</p>
          <h2 id="compare-heading" className="mt-3 max-w-2xl font-serif text-4xl leading-tight">
            Two technologies. <em className="text-brass-deep">One question that matters more than both.</em>
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <Reveal className="card-hover rounded-lg border border-line bg-paper-soft p-7">
            <h3 className="font-serif text-2xl">Radiofrequency ablation (RFA)</h3>
            <p className="mt-3 text-ink-soft">
              Uses carefully controlled heat to treat the small areas of heart tissue that trigger AF. In worldwide use
              for over twenty years, with long-term results documented in thousands of published studies.
            </p>
          </Reveal>
          <Reveal delay={90} className="card-hover rounded-lg border border-line bg-paper-soft p-7">
            <h3 className="font-serif text-2xl">Pulsed field ablation (PFA)</h3>
            <p className="mt-3 text-ink-soft">
              Uses short electrical pulses instead of heat, designed to target heart tissue selectively. A newer
              approach. In the largest head-to-head trials, published in 2025, its results were broadly comparable to
              RFA.<sup>1</sup>
            </p>
          </Reveal>
          <Reveal delay={180} className="card-hover rounded-lg border-2 border-brass bg-night p-7 text-paper">
            <h3 className="font-serif text-2xl text-brass">The operator</h3>
            <p className="mt-3 text-paper/90">
              In those trials, both technologies produced broadly comparable results. What consistently predicts a safe,
              successful ablation in published research is the experience of the doctor performing it.<sup>2</sup>{' '}
              Professor Gupta
              offers both RFA and PFA, and recommends the right one for you.
            </p>
            <Link href="/evidence" className="interactive mt-5 inline-block font-semibold text-brass hover:underline">
              See the evidence &rarr;
            </Link>
          </Reveal>
        </div>
        <Reveal delay={240}>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            <Link
              href="/book"
              className="interactive rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-night"
            >
              Book a consultation
            </Link>
            <p className="text-sm text-ink-soft">Not sure which technology? Start with a conversation.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
