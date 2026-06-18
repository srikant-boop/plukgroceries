import { Leaf } from "@/components/Leaf";

const steps = [
  {
    sketch: "choose" as const,
    title: "Choose what you need",
    detail:
      "Shop individual products à la carte. No bundles required.",
  },
  {
    sketch: "cart" as const,
    title: "Add to cart",
    detail:
      "Pick one item or build your own family pantry basket.",
  },
  {
    sketch: "pickup" as const,
    title: "Choose pickup or local delivery",
    detail:
      "At checkout, select Oakville pickup or local delivery — options shown when you order.",
  },
  {
    sketch: "reorder" as const,
    title: "Reorder favourites",
    detail:
      "The shelf stays small. Products that families love stay; products that do not reorder get replaced.",
  },
];

function StepSketch({
  kind,
}: {
  kind: "choose" | "cart" | "pickup" | "reorder";
}) {
  const fill = "#fbfbf9";
  const stroke = "#4b5563";

  if (kind === "choose") {
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
        <rect x="0" y="0" width="320" height="240" fill={fill} />
        <g
          stroke={stroke}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <rect x="48" y="56" width="88" height="120" rx="6" />
          <rect x="152" y="72" width="88" height="104" rx="6" />
          <path d="M68 88h48M68 108h36" />
          <path d="M172 96h48M172 116h32" />
        </g>
      </svg>
    );
  }

  if (kind === "cart") {
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
        <rect x="0" y="0" width="320" height="240" fill={fill} />
        <g
          stroke={stroke}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <rect x="72" y="90" width="176" height="108" rx="10" />
          <path d="M100 90V70c0-28 18-46 60-46s60 18 60 46v20" />
          <rect x="128" y="118" width="64" height="48" rx="4" />
        </g>
      </svg>
    );
  }

  if (kind === "pickup") {
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
        <rect x="0" y="0" width="320" height="240" fill={fill} />
        <g
          stroke={stroke}
          strokeWidth="2.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <path d="M160 36c-28 0-50 21-50 49 0 36 50 84 50 84s50-48 50-84c0-28-22-49-50-49Z" />
          <circle cx="160" cy="85" r="16" />
          <path d="M85 200h150" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
      <rect x="0" y="0" width="320" height="240" fill={fill} />
      <g
        stroke={stroke}
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M88 160V96l72-40 72 40v64" />
        <rect x="120" y="120" width="80" height="40" rx="4" />
        <path d="M160 56v24M140 140h40" />
      </g>
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mb-16">
      <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-3">
        <Leaf size={15} className="text-accent" />
        <h2 className="text-2xl">How it works</h2>
      </div>
      <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
        {steps.map((step, i) => (
          <li key={step.title} className="group">
            <div className="relative mb-4 aspect-[4/3] overflow-hidden border border-line bg-surface">
              <div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.02]">
                <StepSketch kind={step.sketch} />
              </div>
              <span
                className="absolute left-3 top-3 flex h-8 w-8 items-center justify-center bg-foreground text-sm font-medium text-background"
                aria-hidden
              >
                {i + 1}
              </span>
            </div>
            <h3 className="text-lg leading-tight">{step.title}</h3>
            <p className="mt-1 text-sm text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function HowWeChoose() {
  return (
    <section id="how-we-choose" className="mb-16 border-t border-line pt-12">
      <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-3">
        <Leaf size={15} className="text-accent" />
        <h2 className="text-2xl">How we choose products</h2>
      </div>
      <div className="max-w-2xl text-sm leading-relaxed text-foreground/85 space-y-4">
        <p>
          The shelf is intentionally small — like an Aldi-style aisle, not a
          full Indian grocery store. Each SKU must earn its place: a real meal
          occasion, a trusted brand, and something families actually reorder.
        </p>
        <p>
          If families reorder it, it stays on the shelf. If not, we replace it.
          We do not force bundles or kits — every product is available à la
          carte.
        </p>
        <p>
          We focus on cleaner Indian breakfast, snack, and quick-meal options
          for babies, kids, and parents — without hunting across expensive
          import sites or comparing endless labels.
        </p>
      </div>
    </section>
  );
}
