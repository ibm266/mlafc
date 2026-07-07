import { ChapterEyebrow } from '@/components/ChapterEyebrow';
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
    <section aria-label="Key numbers" className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-5 pb-12">
        <Reveal>
          <div className="flex flex-col items-center pt-7">
            <span aria-hidden className="block h-14 w-px bg-gradient-to-b from-brass/0 via-brass/50 to-brass" />
            <span aria-hidden className="pulse-dot mt-1.5 block h-1.5 w-1.5 rounded-full bg-brass" />
            <ChapterEyebrow
              label="Dr Gupta's experience in numbers"
              className="mt-3 justify-center"
            />
          </div>
        </Reveal>
        <Reveal delay={80} className="mb-12 mt-10">
          <DotWall />
        </Reveal>
        <div className="grid gap-8 text-center sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
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
