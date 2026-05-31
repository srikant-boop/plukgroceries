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
    a: "Weekly. The two spots run on different days so most weeks you'll have a choice between an evening and a weekend slot.",
  },
  {
    q: "Are these items high quality?",
    a: "Yes. Every listing features top-grade fresh produce inspected directly on the wholesale floor. We don't buy close-to-expiry inventory or second-rate items. By bypassing retail storefronts, we deliver peak freshness at near-wholesale prices. Certified organic options will always be clearly labeled.",
  },
  {
    q: "How do you try to keep prices low?",
    a: (
      <>
        <p>
          Four levers: direct sourcing, tiny catalog, pre-orders, thin
          markup.
        </p>
        <p className="mt-3">
          Whole Foods has 3–4 markup layers between farm and basket
          (consolidator → distributor → warehouse → store); we actively
          try to keep it to zero or one — most items come straight from
          the farmer, the rest from a single wholesaler. We stock around
          a dozen items (vs ~40,000 at Whole Foods) so we buy more of
          each. Because everything is pre-ordered before the drop, we
          buy exactly what was bought — no unsold inventory, no spoilage,
          no waste markup baked into your price. Markup is ~25%, vs Whole
          Foods&apos; ~40%.
        </p>
        <p className="mt-3">
          Lands us 20–40% below Whole Foods and 10–20% below Farm Boy most
          weeks. When a big store has a sale we lose — we mark it honestly
          on the page. No membership, no delivery fee.
        </p>
      </>
    ),
  },
  {
    q: "How do I pay?",
    a: "Credit card at checkout — Visa, Mastercard, AmEx, Discover, Apple Pay, and Google Pay. Card details are handled on Stripe's secure page; this site never sees them. You're charged when you place the order, not at pickup.",
  },
  {
    q: "Do you deliver to my house?",
    a: "Not yet. We're running pickup-only while we're small — it keeps the markup thin and the logistics simple. If enough people in one area ask for it, we'll think about adding a delivery slot.",
  },
  {
    q: "Where do you get the food?",
    a: (
      <>
        Direct from farmers like{" "}
        <Link
          href="/suppliers/pfennings-organic"
          className="underline underline-offset-4 hover:text-accent"
        >
          Pfenning&apos;s Organic Farms
        </Link>{" "}
        (who grow their own <em>and</em> wholesale to grocers), and from
        wholesalers like{" "}
        <Link
          href="/suppliers/terra-freska"
          className="underline underline-offset-4 hover:text-accent"
        >
          Terra Freska
        </Link>{" "}
        for items we can&apos;t source direct. Every product page shows
        exactly who supplied it and you can open their profile to see their
        story and links.
      </>
    ),
  },
  {
    q: "What's in the \"Discover\" section?",
    a: "Each drop we rotate in one or two small-batch finds — could be a farm jar, a baker's special, a craft, anything healthy and well-priced for what it is. Sometimes from a neighbour up the QEW, sometimes from further afield. Open the FB group for the current pick.",
  },
  {
    q: "What if I miss the pickup window?",
    a: "At this scale we can't hold orders or carry them to the next drop — we hand-pack for one pickup window, with no warehousing. If you've placed an order and can't make pickup, please let us know in the Facebook group before the order window closes (usually end of day Thursday).",
  },
  {
    q: "What if something is damaged or low quality?",
    a: "Tell us at pickup or message us afterwards with a photo — we refund the affected items or replace at the next drop, no arguing. We're hand-packing this stuff so we'd rather you trusted the next order than save a couple of dollars now.",
  },
];

export const metadata = {
  title: "FAQ — Pluk",
  description:
    "Common questions about Pluk pickup, payment, sourcing, and refunds.",
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
