import { Reveal } from '@/components/Reveal';

const STEPS = [
  {
    n: 'i.',
    title: 'An unhurried first visit',
    body: 'A full consultation in Mumbai — your history, your recordings, your questions. In English, Hindi or Punjabi. You leave with a clear plan.',
  },
  {
    n: 'ii.',
    title: 'Procedure in Mumbai',
    body: 'If a procedure is right for you, Professor Gupta performs it himself during a scheduled Mumbai visit, using the technology that suits your heart.',
  },
  {
    n: 'iii.',
    title: 'Continuity, locally',
    body: 'Follow-up happens close to home with trusted local cardiologists, coordinated under his supervision between visits.',
  },
];

export function Steps() {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {STEPS.map((s, i) => (
        <Reveal key={s.n} delay={i * 90}>
          <div className="text-sm font-semibold text-brass-deep">
            {s.n} {s.title}
          </div>
          <h3 className="sr-only">{s.title}</h3>
          <p className="mt-2 text-ink-soft">{s.body}</p>
        </Reveal>
      ))}
    </div>
  );
}
