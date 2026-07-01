/** Wholesale case MOQ — price from distributor only locks when this many units are reserved. */
export const GROUP_BUY_TARGETS: Record<string, number> = {
  "aashirvaad-atta-20lb": 2,
  "basmati-rice-10lb": 15,
  "sona-masoori-rice-20lb": 10,
  "toor-dal-10lb": 10,
  "masoor-dal-10lb": 10,
  "urad-dal-10lb": 10,
  "chana-dal-10lb": 10,
  "moong-dal-10lb": 10,
  "rajma-10lb": 10,
  "kabuli-chana-10lb": 10,
  "besan-2kg": 8,
  "rava-sooji-2kg": 5,
  "turmeric-100g": 24,
  "red-chilli-100g": 10,
  "cumin-100g": 24,
  "coriander-100g": 24,
  "mdh-masala": 10,
  "nanak-ghee": 12,
  "paneer": 12,
  "dahi": 12,
  "indian-pickle": 12,
  "makhana": 12,
  "poha": 12,
  "red-label-tea": 12,
  "maggi-noodles": 24,
  "mustard-oil-1l": 12,
  "sunflower-oil-1l": 6,
  "salt-1kg": 12,
  "sugar-2kg": 12,
  "lays-chips": 70,
  "papad": 24,
};

export const DEFAULT_GROUP_BUY_TARGET = 12;

export type GroupBuyProgress = {
  productId: string;
  target: number;
  reserved: number;
  filled: boolean;
  pct: number;
};

export function getGroupBuyTarget(productId: string): number {
  return GROUP_BUY_TARGETS[productId] ?? DEFAULT_GROUP_BUY_TARGET;
}

export function buildGroupBuyProgress(
  productId: string,
  reserved: number,
): GroupBuyProgress {
  const target = getGroupBuyTarget(productId);
  const pct = target > 0 ? Math.min(100, Math.round((reserved / target) * 100)) : 0;
  return {
    productId,
    target,
    reserved,
    filled: reserved >= target,
    pct,
  };
}
