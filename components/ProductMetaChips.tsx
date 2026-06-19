import { AudienceIcons } from "@/components/AudienceIcons";

export const META_CHIP_CLASS =
  "inline-flex items-center border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted leading-tight";

export function ProductMetaChips({
  audience,
  ageLabel,
  badges = [],
}: {
  audience: string[];
  ageLabel?: string;
  badges?: string[];
}) {
  return (
    <div className="flex flex-wrap gap-1">
      <AudienceIcons audience={audience} variant="chip" inline />
      {ageLabel ? <span className={META_CHIP_CLASS}>{ageLabel}</span> : null}
      {badges.map((badge) => (
        <span key={badge} className={META_CHIP_CLASS}>
          {badge}
        </span>
      ))}
    </div>
  );
}
