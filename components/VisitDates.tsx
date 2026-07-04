import { Reveal } from '@/components/Reveal';
import type { Visit } from '@/data/types';

const STATUS: Record<Visit['status'], { label: string; cls: string }> = {
  open: { label: 'Booking open', cls: 'bg-brass text-night' },
  waitlist: { label: 'Waitlist', cls: 'border border-line bg-paper-soft text-ink' },
  tbc: { label: 'TBC', cls: 'border border-line bg-paper-soft text-ink-soft' },
};

export function VisitDates({ visits }: { visits: Visit[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {visits.map((v, i) => (
        <Reveal as="li" key={v.id} delay={i * 80} className="rounded-lg border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-3">
            <span className="font-serif text-2xl">{v.month}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS[v.status].cls}`}>
              {STATUS[v.status].label}
            </span>
          </div>
          <p className="mt-3 text-sm text-ink-soft">{v.note}</p>
        </Reveal>
      ))}
    </ul>
  );
}
