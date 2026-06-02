import { Leaf } from "@/components/Leaf";

const steps = [
  {
    sketch: "basket",
    title: "Build your basket",
    detail: "Tap Add to cart on anything you want this week.",
  },
  {
    sketch: "pickup",
    title: "During checkout: pick your spot",
    detail: "Choose 1 of 2 Oakville Sunday pickup locations. Cancel before the order window closes.",
  },
  {
    sketch: "checkout",
    title: "Then pay securely",
    detail: "Finish in under a minute with Stripe.",
  },
] as const;

function StepSketch({ kind }: { kind: "basket" | "pickup" | "checkout" }) {
  if (kind === "basket") {
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
        <rect x="0" y="0" width="320" height="240" fill="#fbfbf9" />
        <g stroke="#4b5563" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <rect x="72" y="90" width="176" height="108" rx="10" />
          <path d="M100 90V70c0-28 18-46 60-46s60 18 60 46v20" />
          <path d="M135 118c10 5 16 15 14 26-16 1-27-3-34-12 4-10 11-15 20-14Z" />
          <ellipse cx="162" cy="138" rx="10" ry="15" />
          <rect x="182" y="108" width="20" height="34" rx="4" />
          <path d="M192 98v10" />
        </g>
      </svg>
    );
  }

  if (kind === "pickup") {
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
        <rect x="0" y="0" width="320" height="240" fill="#fbfbf9" />
        <g stroke="#4b5563" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" fill="none">
          <path d="M160 36c-28 0-50 21-50 49 0 36 50 84 50 84s50-48 50-84c0-28-22-49-50-49Z" />
          <circle cx="160" cy="85" r="16" />
          <path d="M85 200h150" />
          <rect x="132" y="168" width="56" height="32" rx="4" />
          <path d="M144 168v-8c0-7 5-12 16-12s16 5 16 12v8" />
        </g>
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden>
      <rect x="0" y="0" width="320" height="240" fill="#fbfbf9" />
      <g stroke="#4b5563" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <rect x="112" y="28" width="96" height="184" rx="16" />
        <rect x="126" y="50" width="68" height="116" rx="6" />
        <path d="M147 184h26" />
        <rect x="42" y="88" width="54" height="34" rx="5" />
        <path d="M52 102h34M52 112h18" />
        <circle cx="252" cy="105" r="24" />
        <path d="m240 105 8 8 16-16" />
      </g>
    </svg>
  );
}

export function HowItWorks() {
  return (
    <section className="mb-12">
      <div className="mb-6 flex items-baseline gap-3 border-b border-line pb-3">
        <Leaf size={15} className="text-accent" />
        <h2 className="text-2xl">How it works</h2>
      </div>
      <p className="mb-5 text-sm text-muted">
        Simple flow: add items, choose your pickup during checkout, then pay.
      </p>
      <ol className="grid gap-6 sm:grid-cols-3 sm:gap-5">
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
