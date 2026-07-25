'use client';

import { useState } from 'react';
import type { MilestoneVideo as Video } from '@/data/types';

/**
 * A film in the timeline's photo window.
 *
 * The narration carries the piece, so this never autoplays and is never muted.
 * Nothing but the poster loads until the viewer presses play, which keeps a
 * several megabyte file off the critical path of a page that is mostly reading.
 */
export function MilestoneVideo({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (!playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-night-soft"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={video.posterSrc}
          alt=""
          width={video.width}
          height={video.height}
          className="absolute inset-0 h-full w-full object-contain"
        />
        <span aria-hidden className="absolute inset-0 bg-night/35 transition-colors group-hover:bg-night/20" />
        <span className="relative flex flex-col items-center gap-2.5 text-paper">
          <span
            aria-hidden
            className="flex h-12 w-12 items-center justify-center rounded-full border border-brass/70 bg-night/70 backdrop-blur-sm transition-transform duration-200 group-hover:scale-105 sm:h-16 sm:w-16"
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-brass sm:ml-1 sm:h-6 sm:w-6">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="rounded-full bg-night/70 px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.12em] backdrop-blur-sm sm:text-xs sm:tracking-[0.16em]">
            Watch, {video.duration}
          </span>
        </span>
        <span className="sr-only">Play the film: {video.label}</span>
      </button>
    );
  }

  return (
    <video
      className="aspect-[4/3] w-full bg-night-soft object-contain"
      src={video.src}
      poster={video.posterSrc}
      controls
      autoPlay
      playsInline
      aria-label={video.label}
    />
  );
}
