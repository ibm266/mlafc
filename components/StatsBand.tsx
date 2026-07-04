import { CountUp } from '@/components/CountUp';
import { Reveal } from '@/components/Reveal';

const STATS = [
  {
    node: <CountUp to={5000} suffix="+" />,
    label: 'AF ablation procedures performed - placing him among the highest-volume operators in the world',
  },
  {
    node: <CountUp to={1} prefix="<" suffix="%" />,
    label: "Complication rate - published in peer-reviewed journals, on par with the world's best",
  },
  {
    node: <CountUp to={18} suffix="+" />,
    label: "Years as consultant at Liverpool Heart and Chest Hospital, the UK's largest cardiothoracic centre",
  },
  {
    node: <CountUp to={350} suffix="+" />,
    label: 'Peer-reviewed scientific publications, cited over 13,000 times',
  },
];

export function StatsBand() {
  return (
    <section aria-label="Key numbers" className="border-y border-line bg-paper-soft">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={i} delay={i * 80}>
            <div className="font-serif text-5xl text-ink">{s.node}</div>
            <p className="mt-2 text-sm text-ink-soft">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
