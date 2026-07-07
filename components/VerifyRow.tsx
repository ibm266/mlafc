import { LinkNeededFlag } from '@/components/LinkNeededFlag';
import type { ProfileLink } from '@/data/types';

function ProfilePill({ profile }: { profile: ProfileLink }) {
  const base =
    'inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition-colors duration-200';

  if (profile.url) {
    return (
      <a
        href={profile.url}
        target="_blank"
        rel="noopener noreferrer"
        title={profile.sublabel}
        className={`${base} border border-line-dark bg-paper/5 text-paper/85 hover:border-brass hover:text-paper`}
      >
        {profile.label}
        <span aria-hidden className="text-xs text-brass">
          ↗
        </span>
      </a>
    );
  }

  return (
    <span
      title={profile.sublabel}
      className={`${base} border border-dashed border-brass-deep bg-transparent text-paper/85`}
    >
      {profile.label}
      <LinkNeededFlag label="add link" />
    </span>
  );
}

export function VerifyRow({ profiles }: { profiles: ProfileLink[] }) {
  return (
    <div className="border-t border-line-dark pt-7">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-brass">
            Verify his record
          </h2>
          <p className="text-sm text-paper/50">Independent registers, profiles and reviews.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {profiles.map((profile) => (
            <ProfilePill key={profile.label} profile={profile} />
          ))}
        </div>
      </div>
    </div>
  );
}
