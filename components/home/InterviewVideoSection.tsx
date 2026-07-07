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
    <Reveal delay={180} className="mt-9">
      {youtubeId ? (
        <div>
          <YouTubeEmbed videoId={youtubeId} title={interview.title} />
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-brass-deep">
            Watch · {interview.duration}
          </p>
          <p className="mt-1 max-w-2xl font-serif text-xl leading-snug text-ink">{interview.title}</p>
        </div>
      ) : (
        <a
          href={hasUrl ? interview.url : undefined}
          target={hasUrl ? '_blank' : undefined}
          rel={hasUrl ? 'noopener noreferrer' : undefined}
          className={`card-lift relative flex min-h-[280px] max-w-2xl flex-col justify-end overflow-hidden rounded-xl bg-night p-6 text-paper ${
            hasUrl ? '' : 'pointer-events-none'
          }`}
        >
          <span
            aria-hidden
            className="absolute left-1/2 top-[42%] flex h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brass text-night shadow-[0_12px_34px_rgba(176,141,62,0.35)]"
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
    </Reveal>
  );
}
