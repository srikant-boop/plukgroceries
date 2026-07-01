export type GroupBuyActivityLine = {
  productId: string;
  name: string;
  qty: number;
  reserved: number;
  target: number;
  filled: boolean;
};

export type GroupBuyActivityEvent = {
  id: string;
  at: number;
  orderId: string;
  label: string;
  lines: GroupBuyActivityLine[];
};

export function formatActivityHeadline(event: GroupBuyActivityEvent): string {
  if (event.lines.length === 1) {
    const line = event.lines[0]!;
    const fill = line.filled
      ? " — case filled!"
      : ` — ${line.reserved}/${line.target} reserved`;
    return `${event.label} reserved ${line.qty}× ${line.name}${fill}`;
  }
  const names = event.lines
    .slice(0, 2)
    .map((l) => `${l.qty}× ${l.name}`)
    .join(", ");
  const extra =
    event.lines.length > 2 ? ` +${event.lines.length - 2} more` : "";
  return `${event.label} reserved ${names}${extra}`;
}
