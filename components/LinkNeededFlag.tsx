type Props = {
  label?: string;
  className?: string;
};

export function LinkNeededFlag({
  label = 'link needed · links.json',
  className = '',
}: Props) {
  return (
    <span
      className={`inline-block whitespace-nowrap rounded border border-dashed border-brass-deep px-2 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.08em] text-brass-bright ${className}`}
    >
      {label}
    </span>
  );
}
