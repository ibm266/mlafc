import Image from 'next/image';
import Link from 'next/link';
import { EcgHeroMonitor } from '@/components/ecg/EcgHeroMonitor';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import type { SiteLinks } from '@/data/types';

const links = linksJson as SiteLinks;

const gmcUrl = links.profiles.find((p) => p.label === 'GMC Register')?.url;
const mmcUrl = links.profiles.find((p) => p.label === 'MMC Register')?.url;

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-night text-paper">
      <EcgHeroMonitor />
      <div className="relative z-[2] mx-auto grid max-w-6xl items-center gap-10 px-5 py-24 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:py-32">
        <div>
          <h1 className="font-serif text-[clamp(2.2rem,5.5vw,3.8rem)] leading-[1.12]">
            <Reveal as="span" delay={150} className="block">
              The best ablation is the one done
            </Reveal>
            <Reveal as="span" delay={300} className="block">
              by <em className="text-brass">experienced hands</em>.
            </Reveal>
          </h1>
          <Reveal delay={450}>
            <p className="mt-6 max-w-xl text-lg text-paper/85">
              Professor Dhiraj Gupta has performed more than 10,000 AF ablations at the UK&apos;s largest heart centre,
              using both radiofrequency and pulsed field technology. He now sees patients in Mumbai. Whatever the
              machine, the hands holding it matter more.
            </p>
          </Reveal>
          <Reveal delay={600}>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/book"
                className="interactive rounded-full bg-brass px-7 py-3.5 font-semibold text-night hover:bg-brass-deep hover:text-paper"
              >
                Book a consultation
              </Link>
              <Link
                href="/evidence"
                className="interactive rounded-full border border-line-dark px-7 py-3.5 font-semibold text-paper hover:border-brass hover:text-brass"
              >
                See the evidence
              </Link>
            </div>
          </Reveal>
          <Reveal delay={680}>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-line-dark/50 pt-6 text-sm text-paper/80">
              {gmcUrl ? (
                <li>
                  <a
                    href={gmcUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive hover:text-brass"
                  >
                    GMC registered (Specialist Register) ↗
                  </a>
                </li>
              ) : (
                <li>GMC registered (Specialist Register)</li>
              )}
              {mmcUrl ? (
                <li>
                  <a
                    href={mmcUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="interactive hover:text-brass"
                  >
                    MMC registered ↗
                  </a>
                </li>
              ) : (
                <li>MMC registered</li>
              )}
              <li>English · Hindi · Punjabi</li>
            </ul>
          </Reveal>
          <Reveal delay={750} className="mt-10 max-w-xl border-l-2 border-brass pl-6">
            <p className="font-serif text-xl italic leading-relaxed text-paper/90">
              &ldquo;Patients in Mumbai deserve the same standard of arrhythmia care I provide in Liverpool, with the
              dignity of being treated close to home.&rdquo;
            </p>
            <p className="mt-4 text-sm font-semibold">Professor Dhiraj Gupta</p>
            <p className="text-sm text-paper/70">Consultant cardiologist &amp; electrophysiologist</p>
          </Reveal>
        </div>

        <Reveal delay={650} className="mx-auto w-full max-w-md md:mx-0 md:justify-self-end">
          <figure className="overflow-hidden rounded-xl border border-line-dark bg-paper shadow-[0_24px_48px_color-mix(in_srgb,var(--color-night)_60%,transparent)]">
            <Image
              src="/images/professor-gupta.png"
              alt="Professor Dhiraj Gupta, consultant cardiologist and electrophysiologist"
              width={573}
              height={612}
              priority
              className="aspect-[573/612] w-full object-cover object-top"
            />
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
