import Image from 'next/image';
import { Reveal } from '@/components/Reveal';
import type { TeamMember } from '@/data/types';

/** Measured slot: ~440px in the two-column layout, capped at max-w-sm below it. */
const PORTRAIT_SIZES = '(min-width: 1024px) 440px, (min-width: 420px) 384px, 88vw';

function SideHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">{children}</h3>
  );
}

export function TeamProfile({ member }: { member: TeamMember }) {
  return (
    <article id={member.id} className="scroll-mt-24">
      {/* The name leads, ahead of both columns. Two consultants share a
          surname here, so nobody should meet the appointments before they
          know whose they are. */}
      <Reveal>
        <h2 className="font-serif text-[clamp(1.9rem,3.6vw,2.6rem)] leading-tight">{member.name}</h2>
        <p className="mt-2 font-semibold text-brass-deep">{member.postnominals}</p>
        <p className="mt-1 text-ink-soft">{member.role}</p>
      </Reveal>

      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
        <div className="mx-auto w-full max-w-sm lg:mx-0 lg:max-w-none">
          <Reveal>
            <figure className="overflow-hidden rounded-xl border border-line bg-paper shadow-[0_16px_36px_rgba(6,15,21,0.1)]">
              <Image
                src={member.photo.src}
                alt={member.photo.alt}
                width={member.photo.width}
                height={member.photo.height}
                sizes={PORTRAIT_SIZES}
                className="aspect-[4/5] w-full object-cover"
              />
            </figure>
          </Reveal>

          <Reveal delay={90} className="mt-8">
            <SideHeading>Where he practises</SideHeading>
            <ul className="mt-3 space-y-2.5 text-sm text-ink-soft">
              {member.appointments.map((appointment) => (
                <li key={appointment} className="flex gap-2.5">
                  <span aria-hidden className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-brass" />
                  {appointment}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={140} className="mt-8">
            <SideHeading>Training</SideHeading>
            <ul className="mt-3">
              {member.training.map((entry) => (
                <li
                  key={`${entry.period}-${entry.qualification}`}
                  className="border-t border-line py-3.5 last:border-b"
                >
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="font-semibold text-ink">{entry.qualification}</p>
                    <p className="shrink-0 text-sm font-semibold text-brass-deep">{entry.period}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-mute">{entry.institution}</p>
                  {entry.note ? <p className="mt-1 text-sm text-ink-soft">{entry.note}</p> : null}
                </li>
              ))}
            </ul>
          </Reveal>

          {member.interests ? (
            <Reveal delay={180} className="mt-8">
              <SideHeading>Away from the clinic</SideHeading>
              <p className="mt-3 text-sm text-ink-soft">{member.interests}</p>
            </Reveal>
          ) : null}
        </div>

        <div>
          <Reveal delay={80} className="space-y-4 text-ink-soft">
            {member.bio.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </Reveal>

          <Reveal delay={120} className="mt-9 rounded-xl border border-line bg-paper-soft p-6 md:p-8">
            <SideHeading>Why he is the right person to have on an AF case</SideHeading>
            <div className="mt-3.5 space-y-3.5 text-ink-soft">
              {member.afFocus.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={160} className="mt-9">
            <SideHeading>Selected published and presented work</SideHeading>
            <ul className="mt-3">
              {member.selectedWork.map((work) => (
                <li key={work.title} className="border-t border-line py-3.5 last:border-b">
                  <p className="font-serif text-lg leading-snug text-ink">{work.title}</p>
                  <p className="mt-0.5 text-sm text-ink-mute">{work.detail}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </article>
  );
}
