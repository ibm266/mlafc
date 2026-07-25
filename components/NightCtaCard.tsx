import Image from 'next/image';
import Link from 'next/link';
import { EcgPageStrip } from '@/components/ecg/EcgPageStrip';
import { Reveal } from '@/components/Reveal';

type Props = {
  idPrefix: string;
  title: React.ReactNode;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  footnote?: string;
  /** Optional photograph shown beside the copy. Without it the card is unchanged. */
  image?: { src: string; width: number; height: number; alt: string };
};

/** With an image the copy takes a little over half the card from md up. */
const IMAGE_SIZES = '(min-width: 768px) 40vw, 88vw';

export function NightCtaCard({
  idPrefix,
  title,
  description,
  ctaHref = '/book',
  ctaLabel = 'Book a consultation',
  footnote,
  image,
}: Props) {
  const copy = (
    <>
      <h2 className="max-w-2xl font-serif text-[clamp(1.9rem,3.6vw,2.8rem)] leading-tight">{title}</h2>
      <p className="mt-4 max-w-lg text-paper/85">{description}</p>
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <Link
          href={ctaHref}
          className="interactive rounded-full bg-brass px-7 py-3.5 font-semibold text-night hover:bg-brass-deep hover:text-paper"
        >
          {ctaLabel}
        </Link>
        {footnote ? <p className="text-sm text-paper/70">{footnote}</p> : null}
      </div>
    </>
  );

  return (
    <Reveal>
      <div className="relative overflow-hidden rounded-2xl bg-night text-paper shadow-[0_30px_60px_rgba(6,15,21,0.25)]">
        <EcgPageStrip idPrefix={idPrefix} className="!h-[100px]" />
        <div className="relative z-[2] px-8 pb-36 pt-14 md:px-16 md:pb-40 md:pt-16">
          {image ? (
            <div className="grid gap-8 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-12">
              <div>{copy}</div>
              <figure className="overflow-hidden rounded-xl border border-line-dark">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes={IMAGE_SIZES}
                  className="aspect-[4/3] h-full w-full object-cover"
                />
              </figure>
            </div>
          ) : (
            copy
          )}
        </div>
      </div>
    </Reveal>
  );
}
