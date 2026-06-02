/** Approximate visitor location from Vercel edge headers (no IP stored). */
export type VisitorGeo = {
  lat: number;
  lng: number;
  city?: string;
  region?: string;
};

export type VisitorGeoPoint = VisitorGeo & {
  sessionId: string;
  at: number;
};

export type VisitorGeoSummary = {
  /** One point per anonymous session in the selected window. */
  points: VisitorGeoPoint[];
  /** Sessions with a resolved lat/lng. */
  withGeo: number;
  /** Top cities by session count. */
  cityCounts: { city: string; count: number }[];
};

/** Map viewport — Oakville + nearby towns (Mississauga, Burlington margins). */
export const VISITOR_MAP_BOUNDS = {
  north: 43.58,
  south: 43.34,
  west: -79.9,
  east: -79.52,
} as const;

/** City centroids for west GTA — used when Vercel omits x-vercel-ip-city. */
const WEST_GTA_CITIES = [
  { name: "Oakville", lat: 43.4675, lng: -79.6877 },
  { name: "Burlington", lat: 43.3255, lng: -79.799 },
  { name: "Milton", lat: 43.5183, lng: -79.8774 },
  { name: "Mississauga", lat: 43.589, lng: -79.6441 },
  { name: "Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Hamilton", lat: 43.2557, lng: -79.8711 },
  { name: "Brampton", lat: 43.7315, lng: -79.7624 },
] as const;

/** Max distance from a centroid to accept that city label (IP geo is coarse). */
const CITY_MATCH_MAX_METERS = 55_000;

/** Nearest west-GTA municipality for approximate IP coordinates. */
export function cityFromLatLng(lat: number, lng: number): string | undefined {
  let best: { name: string; dist: number } | undefined;
  for (const c of WEST_GTA_CITIES) {
    const dist = geoDistanceMeters({ lat, lng }, c);
    if (!best || dist < best.dist) best = { name: c.name, dist };
  }
  if (!best || best.dist > CITY_MATCH_MAX_METERS) return undefined;
  return best.name;
}

/**
 * Best-effort city label: Vercel header first, then lat/lng → nearest town, then region.
 * Not street-level — IP geolocation is typically city- or neighborhood-scale.
 */
export function resolveVisitorCity(
  geo: Pick<VisitorGeo, "lat" | "lng" | "city" | "region">,
): string {
  const fromHeader = geo.city?.trim();
  if (fromHeader) return fromHeader;
  const fromCoords = cityFromLatLng(geo.lat, geo.lng);
  if (fromCoords) return fromCoords;
  const region = geo.region?.trim();
  if (region) return region;
  return "Unknown";
}

export function geoFromRequestHeaders(headers: Headers): VisitorGeo | null {
  const lat = Number.parseFloat(headers.get("x-vercel-ip-latitude") ?? "");
  const lng = Number.parseFloat(headers.get("x-vercel-ip-longitude") ?? "");
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  if (Math.abs(lat) < 0.01 && Math.abs(lng) < 0.01) return null;

  const rawCity = headers.get("x-vercel-ip-city");
  let city: string | undefined;
  if (rawCity) {
    try {
      city = decodeURIComponent(rawCity);
    } catch {
      city = rawCity;
    }
  }

  const region = headers.get("x-vercel-ip-country-region") ?? undefined;
  return { lat, lng, city, region };
}

export function projectLatLng(
  lat: number,
  lng: number,
  width: number,
  height: number,
): { x: number; y: number } {
  const { north, south, west, east } = VISITOR_MAP_BOUNDS;
  const x = ((lng - west) / (east - west)) * width;
  const y = ((north - lat) / (north - south)) * height;
  return { x, y };
}

/** Great-circle distance in meters (for deduping admin vs visitor dots). */
export function geoDistanceMeters(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** True when two geo points are likely the same household / IP block. */
export function isSameApproxLocation(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
  maxMeters = 2_500,
): boolean {
  return geoDistanceMeters(a, b) <= maxMeters;
}
