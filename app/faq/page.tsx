import { pickupSpots } from "@/lib/pickup";
import { FOOTER_COMPLIANCE_NOTE } from "@/lib/site";

type FaqItem = {
  q: string;
  a: React.ReactNode;
  anchorId?: string;
};

const faqs: FaqItem[] = [
  {
    q: "What is PLUK?",
    a: "PLUK is a small, curated à la carte Indian baby, kids, and family pantry for Canada. We carry a limited shelf of breakfast, snack, and quick-meal products from trusted Indian brands — buy individual items, not bundles or subscription boxes.",
  },
  {
    q: "Is this a full Indian grocery store?",
    a: "No. We intentionally keep a short shelf — like an Aldi-style selection, not an ethnic aisle. If you need spices, pickles, or a full range of staples, a traditional Indian grocery is still the right place.",
  },
  {
    q: "Can I buy products individually?",
    a: "Yes. Every product on the shelf is available à la carte. Add one item or build your own basket.",
  },
  {
    q: "Do I have to buy a bundle?",
    a: "No. PLUK is à la carte. You can buy one product or build your own basket.",
  },
  {
    q: "Why are there only a few products?",
    a: "We keep the shelf intentionally small so parents do not have to compare endless options. Each SKU must earn its place.",
  },
  {
    q: "Are these baby products?",
    a: "Some items are for babies and toddlers (clearly labeled), others are for kids or the whole family. Each product page lists who it is for and suggested age where the brand provides it.",
  },
  {
    q: "How do you choose products?",
    a: "We pick one SKU per product type where we can — a cereal, a noodle mix, a snack — from brands families already trust. If families reorder it, it stays on the shelf. If not, we replace it.",
  },
  {
    q: "Are the products imported?",
    a: "Yes. These brands are made in India and imported for sale in Canada. Country of origin is listed on each product page.",
  },
  {
    q: "Are labels reviewed for Canada?",
    a: "Product details on this site are sourced from official brand listings. Always read the physical package label for the most up-to-date ingredients and allergen information.",
  },
  {
    q: "How does pickup or local delivery work?",
    anchorId: "pickup",
    a: (
      <>
        <p className="mb-3">
          At checkout you choose pickup or local delivery (when available).
          Pickup spots in Oakville:
        </p>
        <ul className="ml-5 list-disc space-y-1">
          {pickupSpots.map((s) => (
            <li key={s.id}>
              <span className="font-medium">{s.name}</span> — {s.address},{" "}
              {s.area} · {s.slot}
            </li>
          ))}
        </ul>
      </>
    ),
  },
  {
    q: "Can I request a product?",
    a: (
      <>
        Message us in the{" "}
        <a
          href="https://www.facebook.com/share/g/1cRmroAoyr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          Oakville group on Facebook
        </a>
        . We consider requests, but the shelf stays small — a new SKU usually
        replaces one that is not reordering.
      </>
    ),
  },
  {
    q: "What happens if a product does not sell?",
    a: "We remove it and try something else. The shelf is curated, not a permanent catalogue of every flavour a brand makes.",
  },
  {
    q: "What if my child has allergies?",
    a: "Always read the package label for allergen statements. Product pages summarize official source data where available, but the physical label is what matters — especially for babies, toddlers, and known allergies.",
  },
  {
    q: "How do I pay?",
    a: "Credit card at checkout — Visa, Mastercard, AmEx, Discover, Apple Pay, and Google Pay. Card details are handled on Stripe's secure page; this site never stores them.",
  },
  {
    q: "Can I cancel my order?",
    a: (
      <>
        Contact us in the{" "}
        <a
          href="https://www.facebook.com/share/g/1cRmroAoyr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          Oakville group on Facebook
        </a>{" "}
        as soon as possible if you need to cancel before we pack your order.
      </>
    ),
  },
];

export const metadata = {
  title: "FAQ — Pluk",
  description:
    "Questions about PLUK — curated Indian family pantry, à la carte shopping, pickup, delivery, and product labels.",
};

export default function FAQPage() {
  return (
    <article className="max-w-3xl">
      <header className="mb-12">
        <h1 className="text-4xl sm:text-5xl leading-[1.05]">
          Common questions, plain answers.
        </h1>
      </header>

      <div className="border-t border-line">
        {faqs.map((item) => (
          <details
            key={item.q}
            id={item.anchorId}
            className="group border-b border-line"
          >
            <summary className="flex items-center justify-between gap-3 py-5 cursor-pointer list-none hover:text-accent">
              <span className="font-medium text-base leading-snug">
                {item.q}
              </span>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0 transition-transform group-open:rotate-180"
                aria-hidden
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </summary>
            <div className="pb-5 pr-7 text-sm leading-relaxed text-foreground/85">
              {item.a}
            </div>
          </details>
        ))}
      </div>

      <p className="mt-12 text-xs text-muted leading-relaxed">
        {FOOTER_COMPLIANCE_NOTE}
      </p>

      <p className="mt-6 text-sm text-muted">
        Anything else?{" "}
        <a
          href="https://www.facebook.com/share/g/1cRmroAoyr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-foreground"
        >
          Ask in the Oakville group
        </a>{" "}
        — fastest way to reach us.
      </p>
    </article>
  );
}
