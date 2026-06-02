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
