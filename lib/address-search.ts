export type AddressSuggestion = {
  id: string;
  label: string;
};

/** Oakville / Halton-ish viewbox — west, south, east, north */
export const OAKVILLE_VIEWBOX = "-79.85,43.35,-79.55,43.55";

export function formatCanadianAddress(displayName: string): string {
  const parts = displayName.split(", ").filter(Boolean);
  if (parts.length <= 4) return displayName;

  const country = parts.at(-1);
  if (country !== "Canada") return displayName;

  const postal = parts.at(-2)?.match(/^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i)
    ? parts.at(-2)
    : undefined;
  const province = postal ? parts.at(-3) : parts.at(-2);
  const cityIndex = postal ? -4 : -3;
  const city = parts.at(cityIndex);

  const streetParts = parts.slice(0, parts.length + cityIndex);
  const street = streetParts.join(", ");

  if (street && city && province) {
    return [street, city, province, postal].filter(Boolean).join(", ");
  }

  return displayName;
}
