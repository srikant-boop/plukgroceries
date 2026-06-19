import { AudienceIcons } from "@/components/AudienceIcons";
import { highlightLabel, productHighlights } from "@/lib/product-highlights";

export const META_CHIP_CLASS =
  "inline-flex items-center border border-line px-2 py-0.5 text-[9px] uppercase tracking-wide text-muted leading-normal";

export function ProductBadgeChips({
  badges = [],
  max = badges.length,
  forCard = false,
}: {
  badges?: string[];
  max?: number;
  forCard?: boolean;
}) {
  const labels = productHighlights(badges, { max, forCard });
  if (labels.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-1.5 gap-y-1.5">
      {labels.map((badge) => (
        <span key={badge} className={META_CHIP_CLASS}>
          {badge}
        </span>
      ))}
    </div>
  );
}

/** Product page — age shows on hover via native tooltip on audience chips. */
export function ProductDetailMeta({
  audience,
  ageLabel,
  badges = [],
}: {
  audience: string[];
  ageLabel?: string;
  badges?: string[];
}) {
  const hasAudience = audience.length > 0;
  const highlightLabels = productHighlights(badges, { max: badges.length });

  if (!hasAudience && highlightLabels.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {hasAudience && (
        <AudienceIcons
          audience={audience}
          variant="chip"
          ageHint={ageLabel}
        />
      )}
      {highlightLabels.length > 0 && (
        <ProductBadgeChips badges={badges} max={badges.length} />
      )}
    </div>
  );
}

// Re-export for any legacy imports
export { highlightLabel };
