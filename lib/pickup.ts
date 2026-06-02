// The two pickup spots Pluk runs each week. Each spot has a fixed weekly
// window. Update this array when locations or times change.

export type PickupSpot = {
  id: string;
  name: string;
  address: string;
  postal: string;
  area: string; // human label for which side of Oakville this covers
  slot: string; // pickup window, e.g. "Sunday · 4:00 – 5:00 PM"
  mapsHref: string;
  lat: number;
  lng: number;
};

export const pickupSpots: PickupSpot[] = [
  {
    id: "iroquois-ridge",
    name: "Iroquois Ridge Community Centre",
    address: "1051 Glenashton Dr",
    postal: "Oakville, ON L6H 0E1",
    area: "East Oakville",
    slot: "Sunday · 4:00 – 5:00 PM",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Iroquois+Ridge+Community+Centre+1051+Glenashton+Dr+Oakville",
    lat: 43.4768,
    lng: -79.6989,
  },
  {
    id: "sixteen-mile",
    name: "Sixteen Mile Sports Complex",
    address: "3070 Neyagawa Blvd",
    postal: "Oakville, ON L6H 7K7",
    area: "North Oakville",
    slot: "Sunday · 6:00 – 7:00 PM",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Sixteen+Mile+Sports+Complex+3070+Neyagawa+Blvd+Oakville",
    lat: 43.4725,
    lng: -79.7368,
  },
];

/** Resolve spot by id; `glen-abbey` kept for orders placed before the survey finalised. */
export const getPickupSpot = (id: string) => {
  if (id === "glen-abbey") return pickupSpots.find((s) => s.id === "sixteen-mile");
  return pickupSpots.find((s) => s.id === id);
};
