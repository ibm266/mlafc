import Link from 'next/link';
import { EcgHeroMonitor } from '@/components/ecg/EcgHeroMonitor';
import { HeroPortrait, HeroQuote } from '@/components/home/HeroPortraitBubble';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import { latestTrip } from '@/data/trips';
import type { SiteLinks } from '@/data/types';

const links = linksJson as SiteLinks;

const feature = latestTrip.feature;

const gmcUrl = links.profiles.find((p) => p.label === 'GMC Register')?.url;
const mmcUrl = links.profiles.find((p) => p.label === 'MMC Register')?.url;

export function Hero() {
  return (
    <section className="bg-paper px-5 pb-8 pt-6 md:pb-12 md:pt-10">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-2xl border border-line-dark bg-night text-paper shadow-[0_28px_64px_rgba(6,15,21,0.28),0_0_0_1px_rgba(58,84,104,0.22)]">
        <EcgHeroMonitor />
        <div className="relative z-[2] grid items-center gap-8 px-5 py-10 md:grid-cols-[1.15fr_0.85fr] md:gap-12 md:px-10 md:py-20 lg:px-12 lg:py-24">
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
              <div className="mt-6 max-w-xl space-y-4 text-lg text-paper/85">
                <p>
                  Professor Dr Dhiraj Gupta is one of the most experienced and highly regarded cardiac
                  electrophysiologists globally. Over a span of 25 years in the UK, he has performed more than
                  10,000 catheter ablations, and has pioneered several advances in AF ablation with both
                  radiofrequency (RF) and pulsed field ablation (PFA) technology.
                </p>
                <p>
                  Dr Gupta now sees patients and performs ablation procedures in Mumbai, and promises the same
                  excellent outcomes as in the United Kingdom.
                </p>
              </div>
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
          </div>

          {/* On mobile this wrapper is display:contents, so the portrait and the quote
              become grid items in their own right: portrait first, quote last. */}
          <div className="contents md:block md:w-full md:max-w-md md:justify-self-end">
            <Reveal delay={120} className="order-first mx-auto w-full max-w-sm md:order-none md:mx-0 md:max-w-none">
              <HeroPortrait />
            </Reveal>
            <Reveal delay={650} className="order-last md:order-none">
              <HeroQuote />
            </Reveal>
          </div>
        </div>

        {feature ? (
          <Link
            href={feature.href}
            className="ticker-in relative z-[2] flex min-h-[44px] flex-col items-start gap-x-3 gap-y-1 border-t border-line-dark/60 bg-night-soft/40 px-5 py-3 text-sm text-paper/85 transition-colors hover:bg-night-soft/70 hover:text-paper md:flex-row md:flex-wrap md:items-baseline md:px-10 lg:px-12"
          >
            <span className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brass">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              Latest
            </span>
            <span className="font-serif text-base leading-snug lg:text-lg">{feature.title}</span>
            <span className="text-paper/60 md:hidden">{feature.eyebrow}</span>
            <span className="whitespace-nowrap font-semibold text-brass md:ml-auto">Read the story &rarr;</span>
          </Link>
        ) : null}
      </div>
    </section>
  );
}
