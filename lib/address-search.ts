export type AddressSuggestion = {
  id: string;
  label: string;
};

/** Oakville / Halton-ish viewbox — west, south, east, north */
export const OAKVILLE_VIEWBOX = "-79.85,43.35,-79.55,43.55";

export type NominatimAddress = {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  town?: string;
  municipality?: string;
  county?: string;
  state?: string;
  postcode?: string;
  country?: string;
};

const ADMIN_NOISE = new Set([
  "Halton Region",
  "Golden Horseshoe",
  "Regional Municipality of Halton",
  "Canada",
]);

const PROVINCE_ABBR: Record<string, string> = {
  Ontario: "ON",
  Quebec: "QC",
  "British Columbia": "BC",
  Alberta: "AB",
};

function provinceShort(state?: string): string | undefined {
  if (!state) return undefined;
  return PROVINCE_ABBR[state] ?? state;
}

function cityFromAddress(addr: NominatimAddress): string | undefined {
  return (
    addr.city ??
    addr.town ??
    addr.municipality ??
    addr.suburb ??
    addr.neighbourhood
  );
}

/** Build a short delivery line: street, city, ON postal */
export function formatNominatimAddress(
  address?: NominatimAddress,
  displayName?: string,
): string {
  if (address) {
    const street = [address.house_number, address.road]
      .filter(Boolean)
      .join(" ");
    const city = cityFromAddress(address) ?? "Oakville";
    const province = provinceShort(address.state);
    const tail = [city, province, address.postcode].filter(Boolean).join(" ");

    if (street) return `${street}, ${tail}`;
    if (tail) return tail;
  }

  if (displayName) return formatCanadianAddress(displayName);
  return "";
}

/** Fallback when structured address fields are missing. */
export function formatCanadianAddress(displayName: string): string {
  const parts = displayName
    .split(", ")
    .map((p) => p.trim())
    .filter(Boolean);

  const postal = parts.find((p) => /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i.test(p));
  const provincePart = parts.find((p) => p === "Ontario") ?? parts.at(-3);
  const province = provincePart ? provinceShort(provincePart) : undefined;

  const city =
    parts.find(
      (p) =>
        !ADMIN_NOISE.has(p) &&
        p !== provincePart &&
        p !== postal &&
        p !== "Canada" &&
        !/^\d/.test(p) &&
        !p.includes("Region") &&
        !p.includes("Horseshoe"),
    ) ?? "Oakville";

  const cityIndex = parts.indexOf(city);
  const streetParts = parts
    .slice(0, cityIndex > 0 ? cityIndex : parts.length - 4)
    .filter((p) => !ADMIN_NOISE.has(p) && p !== "Canada");

  const street = streetParts.join(" ").replace(/,\s*$/, "");
  const tail = [city, province, postal].filter(Boolean).join(" ");

  if (street && tail) return `${street}, ${tail}`;
  return tail || displayName;
}
