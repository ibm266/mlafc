import Image from 'next/image';
import Link from 'next/link';
import { ChapterEyebrow } from '@/components/ChapterEyebrow';
import { Reveal } from '@/components/Reveal';
import { teamMembers } from '@/data/team';
import type { TeamMember } from '@/data/types';

/** The card is narrow, so the portrait only ever needs a small derivative. */
const PORTRAIT_SIZES = '(min-width: 640px) 112px, 96px';

function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="card-lift flex h-full flex-col rounded-xl border border-line bg-white p-6 md:p-7">
      <div className="flex items-start gap-5">
        <figure className="w-24 shrink-0 overflow-hidden rounded-lg border border-line bg-paper sm:w-28">
          <Image
            src={member.photo.src}
            alt={member.photo.alt}
            width={member.photo.width}
            height={member.photo.height}
            sizes={PORTRAIT_SIZES}
            className="aspect-[4/5] w-full object-cover"
          />
        </figure>
        <div className="min-w-0">
          <h3 className="font-serif text-2xl leading-tight">{member.name}</h3>
          <p className="mt-1.5 text-sm font-semibold text-brass-deep">{member.postnominals}</p>
          <p className="mt-1 text-sm text-ink-soft">{member.role}</p>
        </div>
      </div>

      <p className="mt-5 text-ink-soft">{member.excerpt}</p>

      <Link
        href={`/team#${member.id}`}
        className="arrow-link interactive mt-auto pt-5 text-sm font-semibold text-brass-deep hover:underline"
      >
        Read the full profile &rarr;
      </Link>
    </article>
  );
}

export function TeamSection() {
  return (
    <section aria-labelledby="team-heading" className="bg-paper-soft">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <Reveal>
          <ChapterEyebrow chapter="10" label="The rest of the team" />
        </Reveal>
        <Reveal delay={80}>
          <h2 id="team-heading" className="mt-3 font-serif text-4xl">
            Meet the rest of the team.
          </h2>
          <p className="mt-4 max-w-2xl text-ink-soft">
            Professor Gupta leads every case and performs every procedure himself. Between his Mumbai visits, two
            consultants at Lilavati Hospital hold the clinic: a father and son whose practice in the city goes back to
            1979. They see you, read your recordings, adjust what needs adjusting, and put anything that needs his
            decision in front of him.
          </p>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {teamMembers.map((member, i) => (
            <Reveal key={member.id} delay={i * 90} className="h-full">
              <TeamCard member={member} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <Link
            href="/team"
            className="arrow-link interactive mt-8 inline-block font-semibold text-brass-deep hover:underline"
          >
            Meet the whole team, and why they know AF &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
