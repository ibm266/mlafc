import Link from 'next/link';
import { OneSittingDiagram } from '@/components/home/OneSittingDiagram';
import { Reveal } from '@/components/Reveal';
import linksJson from '@/data/links.json';
import type { SiteLinks, TripFeature } from '@/data/types';

const links = linksJson as SiteLinks;

/** The gilt edge, taken from the certificate frames on /certifications. */
const GILT = 'linear-gradient(145deg, #D8B15A, #B08D3E 46%, #6E5826)';

const SEAL_BOX = 168;
const SEAL_CENTRE = SEAL_BOX / 2;
const SEAL_RING_RADIUS = 76;
const SEAL_TEXT_RADIUS = 63;
const SEAL_CIRCUMFERENCE = Math.round(2 * Math.PI * SEAL_TEXT_RADIUS);
const SEAL_FONT_SIZE = 10.5;
/** Rough advance of one uppercase character at that size, tracking included. */
const SEAL_CHAR_WIDTH = SEAL_FONT_SIZE * 0.72;

/**
 * The stamp, repeated as many whole times as the ring will hold. `textLength`
 * then spreads it over the exact circumference, so the legend closes the
 * circle whatever the stamp says and however the font measures.
 */
function sealLegend(stamp: string): string {
  const unit = `${stamp.toUpperCase()} · `;
  const repeats = Math.max(1, Math.floor(SEAL_CIRCUMFERENCE / (unit.length * SEAL_CHAR_WIDTH)));
  return unit.repeat(repeats);
}

/** The turning stamp: the legend rotates, the ECG beat inside it stays put. */
function FeatureSeal({ feature }: { feature: TripFeature }) {
  const pathId = `seal-ring-${feature.id}`;

  return (
    <svg
      viewBox={`0 0 ${SEAL_BOX} ${SEAL_BOX}`}
      role="img"
      aria-label={`${feature.stamp}, ${feature.eyebrow}`}
      className="block h-[132px] w-[132px] lg:h-[168px] lg:w-[168px]"
    >
      <g className="seal-turn">
        <circle
          cx={SEAL_CENTRE}
          cy={SEAL_CENTRE}
          r={SEAL_RING_RADIUS}
          fill="none"
          stroke="#B08D3E"
          strokeWidth="1.2"
        />
        <path
          id={pathId}
          fill="none"
          d={`M ${SEAL_CENTRE} ${SEAL_CENTRE - SEAL_TEXT_RADIUS} a ${SEAL_TEXT_RADIUS} ${SEAL_TEXT_RADIUS} 0 1 1 0 ${
            SEAL_TEXT_RADIUS * 2
          } a ${SEAL_TEXT_RADIUS} ${SEAL_TEXT_RADIUS} 0 1 1 0 ${-SEAL_TEXT_RADIUS * 2}`}
        />
        <text
          fill="#6E5826"
          fontSize={SEAL_FONT_SIZE}
          fontWeight="600"
          letterSpacing="0.22em"
          className="font-sans"
        >
          <textPath
            href={`#${pathId}`}
            startOffset="0"
            textLength={SEAL_CIRCUMFERENCE}
            lengthAdjust="spacing"
          >
            {sealLegend(feature.stamp)}
          </textPath>
        </text>
      </g>
      <g>
        <circle cx={SEAL_CENTRE} cy={SEAL_CENTRE} r="52" fill="none" stroke="#B08D3E" opacity="0.35" />
        <path
          d="M 40 84 L 66 84 L 72 70 L 80 100 L 86 84 L 128 84"
          fill="none"
          stroke="#B08D3E"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="72" cy="70" r="2.6" fill="#B08D3E" />
      </g>
    </svg>
  );
}

/**
 * The headline moment of a visit: the story on the left, the evidence for it
 * on the right. Below lg the two stack, story first, with the seal sitting at
 * the head of the evidence column instead of over the card's corner.
 *
 * Press coverage is looked up from data/links.json by `feature.storyId`: every
 * direct report is listed whether or not the Voices page features it, and the
 * outlet count follows the data rather than being written down here.
 */
export function TripFeatureCard({ feature }: { feature: TripFeature }) {
  const story = links.press.filter((item) => item.story === feature.storyId);
  const syndicated = story.flatMap((item) => item.syndicated ?? []);
  const outletCount = story.length + syndicated.length;

  return (
    <Reveal>
      <article
        id={feature.id}
        className="relative scroll-mt-24 overflow-visible rounded-2xl border border-brass/40 bg-white shadow-[0_24px_56px_rgba(18,43,58,0.08)]"
      >
        <span aria-hidden className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl" style={{ background: GILT }} />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
          <div className="p-6 md:p-10">
            <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
              <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
              {feature.eyebrow}
            </p>
            <h3 className="mt-3 font-serif text-[clamp(1.85rem,3.4vw,2.6rem)] leading-tight text-ink">
              {feature.title}
            </h3>
            {feature.body.map((paragraph) => (
              <p key={paragraph} className="mt-4 max-w-prose text-ink-soft">
                {paragraph}
              </p>
            ))}

            <blockquote className="mt-7 border-l-2 border-brass pl-5">
              <p className="font-serif text-lg leading-relaxed text-ink md:text-xl">{feature.quote.text}</p>
              <footer className="mt-4 text-sm">
                <strong className="block text-ink">{feature.quote.attribution}</strong>
                {feature.quote.detail ? <span className="text-ink-mute">{feature.quote.detail}</span> : null}
              </footer>
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/book"
                className="interactive rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper hover:bg-night"
              >
                Book a consultation
              </Link>
              <Link
                href="/testimonials#press"
                className="arrow-link interactive text-sm font-semibold text-brass-deep hover:underline"
              >
                Every report, in the press &rarr;
              </Link>
            </div>
          </div>

          <div className="relative flex flex-col gap-8 rounded-bl-2xl rounded-br-2xl border-t border-line bg-paper-soft/60 p-6 md:p-10 lg:rounded-bl-none lg:rounded-tr-2xl lg:border-l lg:border-t-0 lg:pt-40">
            {/* The overhang stops at 16px: the card sits 20px from the page
                edge, so a wider one would push the page sideways on a
                laptop-width window. */}
            <div className="pointer-events-none lg:absolute lg:-right-4 lg:-top-7">
              <FeatureSeal feature={feature} />
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-line pt-6">
              {feature.facts.map((fact) => (
                <div key={fact.label}>
                  <p className="font-serif text-3xl leading-none text-ink md:text-4xl">{fact.value}</p>
                  <p className="mt-2 break-words text-xs font-semibold uppercase tracking-[0.14em] text-ink-mute">
                    {fact.label}
                  </p>
                </div>
              ))}
            </div>

            <OneSittingDiagram steps={feature.steps} duration={feature.duration} />

            <div className="border-t border-line pt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brass-deep">
                Reported by {outletCount} outlets
              </p>

              <ul className="mt-4 space-y-4">
                {story.map((item) => (
                  <li key={item.url}>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
                      <span className="font-serif text-base text-ink">{item.outlet}</span>
                      {item.language ? (
                        <span className="rounded-full border border-line px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-ink-mute">
                          In {item.language}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-1.5 text-sm leading-snug text-ink-soft">{item.headline}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Read the ${item.outlet} report`}
                      className="arrow-link interactive mt-1.5 inline-block py-1 text-sm font-semibold text-brass-deep hover:underline"
                    >
                      Read ↗
                    </a>
                  </li>
                ))}
              </ul>

              {syndicated.length > 0 ? (
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-ink-mute">Also carried by</span>
                  {syndicated.map((outlet) => (
                    <a
                      key={outlet.url}
                      href={outlet.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="interactive rounded-full border border-line bg-white px-3 py-2 text-xs font-medium leading-5 text-ink-soft hover:border-brass hover:text-ink"
                    >
                      {outlet.outlet} ↗
                    </a>
                  ))}
                </div>
              ) : null}

              <Link
                href="/testimonials#press"
                className="arrow-link interactive mt-6 inline-block text-sm font-semibold text-brass-deep hover:underline"
              >
                All press coverage &rarr;
              </Link>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
