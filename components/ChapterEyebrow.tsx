type Props = {
  chapter?: string;
  label: string;
  dark?: boolean;
  className?: string;
};

export function ChapterEyebrow({ chapter, label, dark = false, className = '' }: Props) {
  return (
    <p
      className={`flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em] ${
        dark ? 'text-brass' : 'text-brass-deep'
      } ${className}`}
    >
      <span aria-hidden className="pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-brass" />
      {chapter ? `${chapter} · ${label}` : label}
    </p>
  );
}
