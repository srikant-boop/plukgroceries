import Link from "next/link";
import { pickupSpots } from "@/lib/pickup";

type FaqItem = {
  q: string;
  a: React.ReactNode;
};

const faqs: FaqItem[] = [
  {
    q: "Where do I pick up my order?",
    a: (
      <>
        One of two community spots in Oakville — you pick the one that&apos;s
        easier for you at checkout:
        <ul className="mt-2 ml-5 list-disc space-y-1">
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
    q: "How often are drops?",
    a: "Weekly. Both spots are on Sunday with two pickup windows — pick the time that works for you at checkout.",
  },
  {
    q: "Are these items high quality?",
    a: "Yes. Every listing features top-grade fresh produce inspected directly on the wholesale floor. We don't buy close-to-expiry inventory or second-rate items. With a shorter path from growers to your pickup bag, we aim for peak freshness at near-wholesale prices. Certified organic options will always be clearly labeled.",
  },
  {
    q: "How do you try to keep prices low?",
    a: (
      <>
        <p>
          Four levers: a short supply chain, tiny catalog, pre-orders, thin
          markup.
        </p>
        <p className="mt-3">
          Big national grocers often stack 3–4 markup layers between farm and
          basket (consolidator → distributor → warehouse → store). For now our
          weekly
          produce mostly comes through one wholesaler at the Ontario Food
          Terminal — one hop, not four — and we&apos;re working on more
          direct-from-farmer lines as we grow. We keep the catalog
          deliberately small — Aldi-style, not a wall of SKUs. Right now
          that&apos;s about a dozen items per drop; we may add a few over
          time, but the idea stays the same: fewer products, more volume on
          each. Because everything is pre-ordered before the drop, we
          buy exactly what was bought — no unsold inventory, no spoilage,
          no waste markup baked into your price. We add about 20–30% on our
          wholesale cost — the same ballpark hard discounters like Aldi aim
          for (they don&apos;t publish an exact number). That compares to
          roughly 40% stacked markup at many big supermarkets.
        </p>
        <p className="mt-3">
          Most weeks that lands us 20–40% below premium grocery chains and
          10–20% below mid-tier ones. When a major retailer runs a sale we
          lose — we mark it honestly on the page. No membership, no delivery
          fee.
        </p>
      </>
    ),
  },
  {
    q: "How do I pay?",
    a: "Credit card at checkout — Visa, Mastercard, AmEx, Discover, Apple Pay, and Google Pay. Card details are handled on Stripe's secure page; this site never sees them.",
  },
  {
    q: "Do you deliver to my house?",
    a: "Not for regular drops — pickup-only keeps the markup thin and the logistics simple.",
  },
  {
    q: "Where do you get the food?",
    a: (
      <>
        Right now most of the weekly produce list is sourced through{" "}
        <Link
          href="/suppliers/terra-freska"
          className="underline underline-offset-4 hover:text-accent"
        >
          Terra Freska
        </Link>
        , a wholesaler we buy from at the Ontario Food Terminal — still fewer
        stops than a big grocery, and we name them on every listing. We&apos;re
        trying to shift more of the list to named growers over time. The weekly
        highlight (small-batch honey, pantry finds, and the like) often comes
        straight from the maker. Every product page shows who supplied that
        item; open their profile for the full story and links.
      </>
    ),
  },
  {
    q: "What are the extra items on the homepage each week?",
    a: "Each drop we rotate in one or two small-batch finds — could be a farm jar, a baker's special, a craft, anything healthy and well-priced for what it is. Sometimes from a neighbour up the QEW, sometimes from further afield.",
  },
  {
    q: "What if I miss the pickup window?",
    a: "At this scale we can't hold orders or carry them to the next drop — we hand-pack for one pickup window, with no warehousing. If you know you can't make it, cancel before the order window closes (see below). If pickup day passes and you didn't cancel in time, we can often deliver to your home for a small fee — reach out as soon as you can.",
  },
  {
    q: "Can I cancel my order?",
    a: (
      <>
        Yes — as long as it&apos;s before the order window closes (usually end
        of day Thursday), so we haven&apos;t bought or packed your bag yet.
        After you&apos;ve checked out, message us in the{" "}
        <a
          href="https://www.facebook.com/share/g/1cRmroAoyr/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          Oakville group on Facebook
        </a>{" "}
        with your details. We&apos;ll cancel and refund the
        full amount to your card.
      </>
    ),
  },
];

export const metadata = {
  title: "FAQ — Pluk",
  description:
    "Common questions about Pluk pickup, payment, cancellations, sourcing, and refunds.",
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

      <p className="mt-12 text-sm text-muted">
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
