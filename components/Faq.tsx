type FaqItem = {
  q: string;
  a: React.ReactNode;
  anchorId?: string;
};

const faqs: FaqItem[] = [
  {
    q: "What is PLUK?",
    anchorId: "about",
    a: (
      <>
        <p className="mb-3">
          PLUK is a small, curated Indian pantry for Oakville — breakfast,
          snack, and quick-meal brands you can buy one at a time.
        </p>
        <p>
          We are not a full Indian grocery store, a subscription box, or a
          weekly drop. The shelf stays short on purpose — pick what you need
          and build your own basket.
        </p>
      </>
    ),
  },
  {
    q: "Who are these products for?",
    a: (
      <>
        <p className="mb-3">
          It varies by product — each page shows who it is for and a suggested
          age when the brand provides one.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Baby & toddler (from 6 months):</strong> our khichdi mix for
            starting solids.
          </li>
          <li>
            <strong>Toddlers & kids:</strong> cereal, noodles, pancakes, and
            similar — often from when a child can chew the texture.
          </li>
          <li>
            <strong>Family:</strong> most items work for the whole household,
            including adults.
          </li>
        </ul>
        <p className="mt-3">
          We do not use &ldquo;baby&rdquo; and &ldquo;kids&rdquo; to mean the
          same thing — check the product page if you are unsure.
        </p>
      </>
    ),
  },
  {
    q: "Why is the shelf so small?",
    a: "We carry one strong option per product type instead of dozens of flavours. If families reorder something, it stays. If not, we swap it out.",
  },
  {
    q: "Where do products come from?",
    a: "These brands are made in India and imported for sale in Canada.",
  },
  {
    q: "How do I check allergens and ingredients?",
    a: "Product pages summarize official brand listings. Always read the physical package for the latest ingredients and allergen statements — that is what matters, especially for starting solids, toddlers, and known allergies.",
  },
  {
    q: "How does delivery work?",
    anchorId: "delivery",
    a: "Every order is home delivered in Oakville. At checkout, leave your delivery address and we will bring your order to you.",
  },
  {
    q: "How do I pay?",
    a: "Pay by card at checkout or cash on delivery. For cash on delivery, choose that option at checkout — we will confirm timing before we deliver.",
  },
];

export function Faq() {
  return (
    <>
      <div className="border-t border-line">
        {faqs.map((item) => (
          <details
            key={item.q}
            id={item.anchorId}
            className="group border-b border-line scroll-mt-24"
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
    </>
  );
}
