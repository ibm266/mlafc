import { PAGE_HEADER_ECG_STRIP } from '@/lib/ecg/design-paths';

type Props = {
  idPrefix: string;
  className?: string;
};

export function EcgPageStrip({ idPrefix, className = '' }: Props) {
  const winId = `${idPrefix}-win`;
  const maskId = `${idPrefix}-sweep-mask`;

  return (
    <svg
      aria-hidden
      viewBox="0 0 1440 120"
      preserveAspectRatio="xMidYMax slice"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[120px] w-full opacity-80 ${className}`}
    >
      <defs>
        <linearGradient id={winId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fff" stopOpacity="0" />
          <stop offset="52%" stopColor="#fff" stopOpacity="0" />
          <stop offset="80%" stopColor="#fff" stopOpacity="1" />
          <stop offset="94%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="1440" height="120">
          <rect className="ecg-sweep" x="0" y="0" width="420" height="120" fill={`url(#${winId})`} />
        </mask>
      </defs>
      <path
        d={PAGE_HEADER_ECG_STRIP}
        fill="none"
        stroke="#B08D3E"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.16"
      />
      <g mask={`url(#${maskId})`}>
        <path
          d={PAGE_HEADER_ECG_STRIP}
          fill="none"
          stroke="#D8B15A"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}
