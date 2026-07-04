'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  videoSrc: string;
  posterSrc: string;
  alt: string;
};

export function ConditionMedia({ videoSrc, posterSrc, alt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [reducedMotion, setReducedMotion] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <figure className="overflow-hidden rounded-lg border border-line bg-paper">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={posterSrc} alt={alt} className="aspect-video w-full object-cover" />
      </figure>
    );
  }

  return (
    <figure className="overflow-hidden rounded-lg border border-line bg-paper">
      <video
        ref={videoRef}
        className="aspect-video w-full object-cover"
        src={videoSrc}
        poster={posterSrc}
        muted
        loop
        playsInline
        aria-label={alt}
      />
    </figure>
  );
}
