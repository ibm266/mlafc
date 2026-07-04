import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Reveal } from '@/components/Reveal';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night text-paper">
      {/* Faint dotted London to Mumbai arc */}
      <svg
        aria-hidden
        className="mlafc-arc pointer-events-none absolute inset-0 h-full w-full text-brass opacity-25"
        viewBox="0 0 1200 600"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 150 180 Q 600 -60 1050 420"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="2 10"
          strokeLinecap="round"
        />
        <circle cx="150" cy="180" r="4" fill="currentColor" />
        <circle cx="1050" cy="420" r="4" fill="currentColor" />
      </svg>
      <div className="relative mx-auto grid max-w-6xl gap-12 px-5 py-24 md:grid-cols-[1.5fr_1fr] md:py-32">
        <div>
          <Reveal>
            <Logo variant="dark" />
          </Reveal>
          <h1 className="mt-8 font-serif text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.12]">
            <Reveal as="span" delay={150} className="block">
              The best ablation is the one done
            </Reveal>
            <Reveal as="span" delay={300} className="block">
              by <em className="text-brass">experienced hands</em>.
            </Reveal>
          </h1>
          <Reveal delay={450}>
            <p className="mt-6 max-w-xl text-lg text-paper/85">
              Professor Dhiraj Gupta has performed more than 5,000 AF ablations at the UK&rsquo;s largest heart
              centre &mdash; using both radiofrequency and pulsed field technology. He now sees patients in Mumbai.
              Whatever the machine, the hands holding it matter more.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="rounded-full bg-brass px-7 py-3.5 font-semibold text-night hover:bg-brass-deep hover:text-paper"
              >
                Book a consultation
              </Link>
              <Link
                href="/evidence"
                className="rounded-full border border-line-dark px-7 py-3.5 font-semibold text-paper hover:border-brass hover:text-brass"
              >
                See the evidence
              </Link>
            </div>
          </Reveal>
        </div>
        <Reveal delay={700} className="self-center border-l-2 border-brass pl-6">
          <p className="font-serif text-xl italic leading-relaxed text-paper/90">
            &ldquo;Patients in Mumbai deserve the same standard of arrhythmia care I provide in Liverpool &mdash; with
            the dignity of being treated close to home.&rdquo;
          </p>
          <p className="mt-4 text-sm font-semibold">Professor Dhiraj Gupta</p>
          <p className="text-sm text-paper/70">Consultant cardiologist &amp; electrophysiologist</p>
        </Reveal>
      </div>
    </section>
  );
}
