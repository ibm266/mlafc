import { LinkNeededFlag } from '@/components/LinkNeededFlag';
import type { ProfileLink } from '@/data/types';

export function VerifyIndependentlyStrip({ profiles }: { profiles: ProfileLink[] }) {
  const featured = profiles.filter((p) => p.featured);

  return (
    <div className="mt-11 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-line pt-6">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-mute">
        Verify independently
      </span>
      {featured.map((profile) =>
        profile.url ? (
          <a
            key={profile.label}
            href={profile.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brass-deep hover:text-ink"
          >
            {profile.label}
            <span aria-hidden className="text-brass">
              ↗
            </span>
          </a>
        ) : (
          <span key={profile.label} className="inline-flex items-center gap-2 text-sm font-semibold text-brass-deep">
            {profile.label}
            <LinkNeededFlag />
          </span>
        ),
      )}
    </div>
  );
}
