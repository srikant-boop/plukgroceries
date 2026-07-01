/**
 * Everest Traders wholesale case prices (Jan 2026).
 * Case price ÷ units per case = per-unit landed cost for retail markup.
 */

export type EverestLine = {
  name: string;
  casePrice: number;
  unitsPerCase: number;
  unitLabel: string;
};

export function unitCostFromCase(casePrice: number, unitsPerCase: number): number {
  return Math.round((casePrice / unitsPerCase) * 100) / 100;
}

/** Full distributor list — add to shelf as needed. */
export const EVEREST_WHOLESALE: EverestLine[] = [
  { name: "Manchurian Noodles Family Pack", casePrice: 50, unitsPerCase: 36, unitLabel: "240 g" },
  { name: "Schezwan Noodles Family Pack", casePrice: 50, unitsPerCase: 36, unitLabel: "240 g" },
  { name: "Hot Garlic Noodles Family Pack", casePrice: 50, unitsPerCase: 36, unitLabel: "240 g" },
  { name: "Singapore Curry Noodles Family Pack", casePrice: 50, unitsPerCase: 36, unitLabel: "240 g" },
  { name: "Hakka Veg. Noodles", casePrice: 52, unitsPerCase: 15, unitLabel: "560 g" },
  { name: "Chowmein Noodles", casePrice: 52, unitsPerCase: 15, unitLabel: "560 g" },
  { name: "Veg. Hakka Noodles", casePrice: 35, unitsPerCase: 30, unitLabel: "140 g" },
  { name: "Chowmein Noodles", casePrice: 35, unitsPerCase: 30, unitLabel: "140 g" },
  { name: "Red Chilli Sauce", casePrice: 38, unitsPerCase: 24, unitLabel: "170 ml" },
  { name: "Schezwan Chutney", casePrice: 54, unitsPerCase: 24, unitLabel: "250 g" },
  { name: "Schezwan Chutney", casePrice: 72, unitsPerCase: 18, unitLabel: "600 g" },
  { name: "Tez Mustard Oil", casePrice: 82, unitsPerCase: 24, unitLabel: "473 ml" },
  { name: "Tez Mustard Oil", casePrice: 70, unitsPerCase: 12, unitLabel: "946 ml" },
  { name: "Tez Mustard Oil", casePrice: 70, unitsPerCase: 6, unitLabel: "1.89 L" },
  { name: "Tez Mustard Oil", casePrice: 108, unitsPerCase: 4, unitLabel: "4.73 L" },
  { name: "Tez Organic Mustard Oil", casePrice: 109, unitsPerCase: 12, unitLabel: "946 ml" },
  { name: "BB Red Label Black Tea", casePrice: 129, unitsPerCase: 24, unitLabel: "450 g" },
  { name: "BB Red Label Black Tea", casePrice: 122, unitsPerCase: 12, unitLabel: "900 g" },
  { name: "BB Red Label Black Tea", casePrice: 110, unitsPerCase: 6, unitLabel: "1.8 kg" },
  { name: "Maggi Masala Noodles", casePrice: 40, unitsPerCase: 12, unitLabel: "560 g" },
  { name: "Maggi Masala Noodles", casePrice: 40, unitsPerCase: 24, unitLabel: "280 g" },
  { name: "Maggi Masala bags", casePrice: 208, unitsPerCase: 60, unitLabel: "200 g" },
  { name: "Royal Basmati Rice", casePrice: 13.5, unitsPerCase: 1, unitLabel: "10 lb" },
  { name: "Tata Gold Tea", casePrice: 155, unitsPerCase: 24, unitLabel: "500 g" },
  { name: "Tata Gold Tea", casePrice: 146, unitsPerCase: 12, unitLabel: "1 kg" },
  { name: "Brooke Bond Taaza Tea", casePrice: 104, unitsPerCase: 18, unitLabel: "1 kg" },
  { name: "Lays Magic Masala", casePrice: 54, unitsPerCase: 70, unitLabel: "50–55 g" },
  { name: "Kurkure Masala Munch", casePrice: 55, unitsPerCase: 70, unitLabel: "~85 g" },
  { name: "Bingo Mad Angle Masala", casePrice: 42, unitsPerCase: 56, unitLabel: "~67 g" },
  { name: "Badshah Chana Masala", casePrice: 44, unitsPerCase: 24, unitLabel: "100 g" },
  { name: "Badshah Chhole Masala", casePrice: 44, unitsPerCase: 24, unitLabel: "100 g" },
  { name: "Badshah Pav Bhaji Masala", casePrice: 44, unitsPerCase: 24, unitLabel: "100 g" },
  { name: "Badshah Punjabi Garam Masala", casePrice: 44, unitsPerCase: 24, unitLabel: "100 g" },
  { name: "Badshah Rajwadi Garam Masala", casePrice: 44, unitsPerCase: 24, unitLabel: "100 g" },
  { name: "PK Masoor Whole", casePrice: 40, unitsPerCase: 10, unitLabel: "4 lb" },
  { name: "PK Masoor Dal Split", casePrice: 40, unitsPerCase: 10, unitLabel: "4 lb" },
];

/** Per-unit costs used on the live shelf (Everest case ÷ units). */
export const EVEREST_UNIT_COSTS = {
  basmati10lb: 13.5,
  /** 24 × 450 g case @ $129 → $5.38/450 g; 900 g ≈ 2 × 450 g */
  redLabelTea450g: unitCostFromCase(129, 24),
  redLabelTea900g: unitCostFromCase(129, 24) * 2,
  /** Tez 12 × 946 ml — shelf uses cheaper Apna 1 L @ A1 instead */
  tezMustard946ml: unitCostFromCase(70, 12),
  maggi280g: unitCostFromCase(40, 24),
  /** 70 × 50–55 g @ $54 case */
  lays55g: unitCostFromCase(54, 70),
  badshahMasala100g: unitCostFromCase(44, 24),
} as const;

/** Prorate a verified pack cost to a different retail size (same product). */
export function proratePackCost(
  costForSize: number,
  sizeAmount: number,
  targetAmount: number,
): number {
  return Math.round(((costForSize * targetAmount) / sizeAmount) * 100) / 100;
}

/** Lower of A1 walk-in and Everest case ÷ units (optional scale, e.g. 4 lb → 10 lb). */
export function minUnitCost(
  a1WalkIn: number,
  everestCase?: { casePrice: number; unitsPerCase: number; scale?: number },
): number {
  if (!everestCase) return a1WalkIn;
  const scale = everestCase.scale ?? 1;
  const fromEverest =
    unitCostFromCase(everestCase.casePrice, everestCase.unitsPerCase) * scale;
  return Math.round(Math.min(a1WalkIn, fromEverest) * 100) / 100;
}

/**
 * A1 Cash & Carry walk-in prices — verified Jun 2026 via products/*.json.
 * Dals use min(A1, Everest) when Everest lists an equivalent pack.
 */
export const A1_UNIT_COSTS = {
  mustardOil1L: 4.49,
  sonaMasoori20lb: 24.19,
  sugar2kg: 3.449,
  salt1kg: 1.79,
  deepHotMangoPickle700g: 4.79,
  toorDal10lb: 18.19,
  masoorDal10lb: minUnitCost(8.29, { casePrice: 40, unitsPerCase: 10, scale: 2.5 }),
  uradDal10lb: 16.79,
  chanaDal10lb: 12.29,
  moongDal10lb: 14.99,
  rajma10lb: 17.59,
  kabuliChana10lb: 8.99,
  /** Cheapest desi ghee 1.6 kg tub on A1 (Modhani); Nanak is $27.79. */
  desiGhee1_6kg: 27.49,
  nanakGhee1_6kg: 27.79,
  /** Retail-pack malai paneer — lowest paneer walk-in on A1. */
  apnaPaneer300g: 4.99,
  apnaPaneer1_6kg: 21.99,
  dahi1_8kg: 7.29,
} as const;

/** 750 ml shelf unit — prorated from cheapest 1.6 kg desi ghee on A1. */
export const A1_GHEE_750ML = proratePackCost(A1_UNIT_COSTS.desiGhee1_6kg, 1600, 750);
