import { AUDIENCE_CHIP_LABEL } from "@/lib/audience";

export const META_CHIP_CLASS =
  "inline-flex items-center border border-line px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted leading-tight";

export function formatAudienceLine(
  audience: string[],
  ageLabel?: string,
): string | null {
  if (audience.length === 0 && !ageLabel) return null;
  const who = audience
    .map((item) => AUDIENCE_CHIP_LABEL[item] ?? item)
    .join(" · ");
  if (!ageLabel) return who || null;
  return who ? `${who} · ${ageLabel}` : ageLabel;
}

export function ProductAudienceLine({
  audience,
  ageLabel,
}: {
  audience: string[];
  ageLabel?: string;
}) {
  const line = formatAudienceLine(audience, ageLabel);
  if (!line) return null;
  return (
    <p className="text-[11px] text-muted leading-snug">{line}</p>
  );
}

export function ProductBadgeChips({ badges = [] }: { badges?: string[] }) {
  if (badges.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {badges.map((badge) => (
        <span key={badge} className={META_CHIP_CLASS}>
          {badge}
        </span>
      ))}
    </div>
  );
}
