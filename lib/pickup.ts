// The two pickup spots Pluk runs each week. Each spot has a fixed weekly
// window. Update this array when the survey results finalise (open till
// Sunday) or when the rotation changes.

export type PickupSpot = {
  id: string;
  name: string;
  address: string;
  postal: string;
  area: string; // human label for which side of Oakville this covers
  slot: string; // pickup window, e.g. "Friday · 6:00 – 7:00 PM"
  mapsHref: string;
};

export const pickupSpots: PickupSpot[] = [
  {
    id: "iroquois-ridge",
    name: "Iroquois Ridge Community Centre",
    address: "1051 Glenashton Dr",
    postal: "Oakville, ON L6H 0E1",
    area: "East Oakville",
    slot: "Friday · 6:00 – 7:00 PM",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Iroquois+Ridge+Community+Centre+1051+Glenashton+Dr+Oakville",
  },
  {
    id: "glen-abbey",
    name: "Glen Abbey Community Centre",
    address: "1415 Third Line",
    postal: "Oakville, ON L6M 3G2",
    area: "West Oakville",
    slot: "Sunday · 4:00 – 5:00 PM",
    mapsHref:
      "https://www.google.com/maps/search/?api=1&query=Glen+Abbey+Community+Centre+1415+Third+Line+Oakville",
  },
];

export const getPickupSpot = (id: string) =>
  pickupSpots.find((s) => s.id === id);
