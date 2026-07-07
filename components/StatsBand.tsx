import { CountUp } from '@/components/CountUp';
import { DotWall } from '@/components/home/DotWall';
import { Reveal } from '@/components/Reveal';

const STATS = [
  {
    node: <CountUp to={300} suffix="+" />,
    label: 'AF ablations every year',
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
        <Reveal className="mb-12">
          <DotWall />
        </Reveal>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {STATS.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 80}
              className={`lg:px-7 ${i < STATS.length - 1 ? 'lg:border-r lg:border-line' : ''}`}
            >
              <div className="font-serif text-5xl text-ink">{s.node}</div>
              <p className="mt-2 font-semibold text-ink">{s.label}</p>
              <p className="mt-1 text-sm text-ink-soft">{s.sub}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
