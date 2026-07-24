import Image from 'next/image';
import type { Certification } from '@/data/types';

/**
 * Renders the "artwork" for a certification: for a scan, the restored
 * photograph already set inside an ornate gilt frame; for a plate, a typeset
 * certificate. Shared so a frame and its dialog show the same object.
 */
export function CertificateArt({
  certification: c,
  variant,
}: {
  certification: Certification;
  variant: 'frame' | 'dialog';
}) {
  if (c.kind === 'scan' && c.image) {
    return (
      <Image
        src={c.image.src}
        width={c.image.width}
        height={c.image.height}
        alt={c.image.alt}
        sizes={
          variant === 'dialog'
            ? '(max-width: 768px) 92vw, 620px'
            : '(max-width: 768px) 90vw, (max-width: 1024px) 46vw, 32vw'
        }
        className="block h-auto w-full"
      />
    );
  }

  const dialog = variant === 'dialog';
  const initial = c.awardingBody.charAt(0);

  return (
    <div
      className={`flex flex-col items-center justify-center bg-[#FBF9F4] text-center ${
        dialog ? 'gap-3 px-8 py-14' : 'gap-2 px-5 py-10'
      }`}
      style={{ minHeight: dialog ? undefined : '300px' }}
    >
      <span
        aria-hidden
        className={`flex items-center justify-center rounded-full border border-brass font-serif text-brass-deep ${
          dialog ? 'h-12 w-12 text-xl' : 'h-9 w-9 text-base'
        }`}
      >
        {initial}
      </span>
      <span
        className={`font-semibold uppercase tracking-[0.14em] text-brass-deep ${
          dialog ? 'text-xs' : 'text-[10px]'
        }`}
      >
        {c.awardingBody}
      </span>
      <span
        className={`font-serif leading-snug text-ink ${dialog ? 'text-2xl' : 'text-[1.05rem]'}`}
      >
        {c.title}
      </span>
      <span aria-hidden className={`bg-brass ${dialog ? 'mt-1 h-px w-8' : 'mt-0.5 h-px w-7'}`} />
      <span className={`font-serif italic text-ink-mute ${dialog ? 'text-sm' : 'text-xs'}`}>
        {c.location ? `${c.location}, ${c.year}` : c.year}
      </span>
    </div>
  );
}

export function CertificateFrame({
  certification: c,
  onOpen,
}: {
  certification: Certification;
  onOpen: (c: Certification) => void;
}) {
  const isScan = c.kind === 'scan' && c.image;

  return (
    <>
      <button
        type="button"
        onClick={() => onOpen(c)}
        aria-haspopup="dialog"
        aria-label={`${c.title}. ${c.awardingBody}, ${c.year}. Open details.`}
        className={isScan ? 'cert-photo block w-full' : 'cert-frame block w-full'}
      >
        {isScan ? (
          <CertificateArt certification={c} variant="frame" />
        ) : (
          <span className="cert-frame-mat block">
            <span className="block overflow-hidden shadow-[inset_0_0_0_1px_rgba(18,43,58,0.16)]">
              <CertificateArt certification={c} variant="frame" />
            </span>
          </span>
        )}
      </button>
      <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[0.16em] text-paper/55">
        {c.postnominal} <span className="text-brass">·</span> {c.year}
      </p>
    </>
  );
}
