import { LinkNeededFlag } from '@/components/LinkNeededFlag';
import { YouTubeEmbed } from '@/components/YouTubeEmbed';
import { Reveal } from '@/components/Reveal';
import type { InterviewLink } from '@/data/types';
import { youtubeVideoId } from '@/lib/youtube';

type Props = {
  interview: InterviewLink;
};

export function InterviewVideoSection({ interview }: Props) {
  const youtubeId = interview.url ? youtubeVideoId(interview.url) : null;
  const hasUrl = Boolean(interview.url);

  return (
    <Reveal delay={220} className="mt-11">
      <div className="grid items-stretch gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        {youtubeId ? (
          <div className="flex min-h-[340px] flex-col justify-end rounded-xl bg-night p-6 text-paper">
            <YouTubeEmbed videoId={youtubeId} title={interview.title} className="max-w-none" />
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              Watch · {interview.duration}
            </p>
            <p className="mt-2 max-w-md font-serif text-xl leading-snug">{interview.title}</p>
          </div>
        ) : (
          <a
            href={hasUrl ? interview.url : undefined}
            target={hasUrl ? '_blank' : undefined}
            rel={hasUrl ? 'noopener noreferrer' : undefined}
            className={`card-lift relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-xl bg-night p-6 text-paper ${
              hasUrl ? '' : 'pointer-events-none'
            }`}
          >
            <span
              aria-hidden
              className="absolute left-1/2 top-[38%] flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brass text-night shadow-[0_12px_34px_rgba(176,141,62,0.35)]"
            >
              <svg width="22" height="26" viewBox="0 0 22 26" aria-hidden="true">
                <polygon points="2,2 22,13 2,24" fill="currentColor" />
              </svg>
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-bright">
              Watch · {interview.duration}
            </span>
            <span className="mt-2 max-w-md font-serif text-xl leading-snug">{interview.title}</span>
            {!hasUrl ? (
              <LinkNeededFlag
                label="video link needed · links.json > interview.url"
                className="mt-3 self-start"
              />
            ) : null}
          </a>
        )}

        <div className="flex flex-col justify-center gap-2.5 rounded-xl border border-line bg-white p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">The interview</p>
          <p className="text-ink-soft">
            Hear him explain, in his own words, how he assesses a heart in atrial fibrillation and how he decides who
            needs a procedure and who does not.
          </p>
          <p className="text-sm text-ink-mute">{youtubeId ? 'Watch above.' : 'Opens in a new tab.'}</p>
        </div>
      </div>
    </Reveal>
  );
}
