import { EcgPageStrip } from '@/components/ecg/EcgPageStrip';
import { Reveal } from '@/components/Reveal';

type Props = {
  idPrefix: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: string;
};

export function PageHeader({ idPrefix, eyebrow, title, description }: Props) {
  return (
    <section className="relative overflow-hidden bg-night text-paper">
      <EcgPageStrip idPrefix={idPrefix} />
      <div className="relative z-[2] mx-auto max-w-6xl px-5 pb-32 pt-20 md:pb-36 md:pt-24">
        <Reveal>
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] text-brass">
            <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="mt-4 max-w-3xl font-serif text-[clamp(2rem,5vw,3.2rem)] leading-tight tracking-tight">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={160}>
            <p className="mt-5 max-w-xl text-lg text-paper/85">{description}</p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
