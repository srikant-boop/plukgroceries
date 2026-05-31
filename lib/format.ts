export const money = (n: number) =>
  new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(n);

export const pct = (n: number) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(0)}%`;
