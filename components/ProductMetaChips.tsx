import { AUDIENCE_CHIP_LABEL } from "@/lib/audience";
import { productHighlights } from "@/lib/product-highlights";

export function formatProductMetaLine(
  audience: string[],
  ageLabel: string | undefined,
  badges: string[],
  { maxHighlights = 2 }: { maxHighlights?: number } = {},
): string | null {
  const parts: string[] = [];

  for (const item of audience) {
    parts.push(AUDIENCE_CHIP_LABEL[item] ?? item);
  }
  if (ageLabel) parts.push(ageLabel);

  parts.push(
    ...productHighlights(badges, {
      max: maxHighlights,
      forCard: maxHighlights <= 2,
    }),
  );

  return parts.length > 0 ? parts.join(" · ") : null;
}

export function ProductMetaLine({
  audience,
  ageLabel,
  badges = [],
  maxHighlights = 2,
}: {
  audience: string[];
  ageLabel?: string;
  badges?: string[];
  /** Cards: 2 highlights max. Product page: pass a higher number for the full set. */
  maxHighlights?: number;
}) {
  const line = formatProductMetaLine(audience, ageLabel, badges, {
    maxHighlights,
  });
  if (!line) return null;
  return (
    <p className="text-[11px] text-muted leading-snug line-clamp-2">{line}</p>
  );
}
