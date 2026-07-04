import { CountUp } from '@/components/CountUp';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';

const STATS = [
  {
    node: <CountUp to={5000} suffix="+" />,
    label: 'AF ablations performed',
    sub: 'Among the highest-volume operators worldwide',
  },
  {
    node: <CountUp to={1} prefix="<" suffix="%" />,
    label: 'Complication rate',
    sub: 'Published in peer-reviewed journals',
  },
  {
    node: <CountUp to={18} suffix="+" />,
    label: 'Years as consultant',
    sub: "At Liverpool Heart and Chest Hospital, the UK's largest cardiothoracic centre",
  },
  {
    node: <CountUp to={350} suffix="+" />,
    label: 'Scientific publications',
    sub: 'Cited over 13,000 times',
  },
];

export function StatsBand() {
  return (
    <section aria-label="Key numbers" className="border-y border-line bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="font-serif text-5xl text-ink">{s.node}</div>
              <p className="mt-2 font-semibold text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.sub}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={320}>
          <div className="mt-10 flex flex-wrap items-center gap-4 border-t border-line pt-8">
            <Link
              href="/evidence"
              className="interactive rounded-full bg-ink px-6 py-3 font-semibold text-paper hover:bg-night"
            >
              See the evidence
            </Link>
            <p className="text-sm text-ink-soft">Volume and experience matter more than the machine.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
