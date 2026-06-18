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
    q: "Are these products in stock right now?",
    a: (
      <>
        <p className="mb-3">
          No. PLUK is currently running a demand-first preorder test. We are
          not holding large inventory yet. We will place the order only if
          enough families reserve products.
        </p>
      </>
    ),
  },
  {
    q: "Why preorder instead of keeping inventory?",
    a: "We want to keep prices fair and avoid wasting money on products families may not actually want. Preorders help us learn which better Indian family foods people truly want in Canada before we import larger quantities.",
  },
  {
    q: "When will you place the order?",
    a: "We will place the order after the preorder window closes and the minimum quantity is reached. If the minimum quantity is not reached, we may cancel that test product or move it to a future round.",
  },
  {
    q: "How long will delivery take?",
    anchorId: "delivery",
    a: (
      <>
        <p className="mb-3">
          Expected arrival is usually{" "}
          <strong>10–20 days after the preorder closes</strong>. Every order is
          home delivered in Oakville once it arrives.
        </p>
        <p className="mb-2">This includes:</p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>confirming final quantities</li>
          <li>ordering from India</li>
          <li>packing and shipment handoff</li>
          <li>air shipment to Canada</li>
          <li>customs and clearance</li>
          <li>local sorting and delivery preparation</li>
        </ul>
      </>
    ),
  },
  {
    q: "Are you using air or sea shipping?",
    a: "For the first test batches, we plan to use air shipping because it is faster and better for learning demand. Sea shipping can be cheaper later, but it is too slow for early testing.",
  },
  {
    q: "Why does it still take 10–20 days if it is air shipping?",
    a: "The flight or air-freight leg may be faster, but the full process includes ordering, packing, handoff, customs, clearance, and local sorting. That is why we give a more realistic customer estimate.",
  },
  {
    q: "What happens if the order is delayed?",
    a: "We will update customers if there is a delay. Since this is an early preorder test, timing may vary due to supplier availability, courier handoff, customs, or weather and logistics delays.",
  },
  {
    q: "Do I pay now?",
    anchorId: "payment",
    a: (
      <>
        <p className="mb-3">For the first test, PLUK may collect either:</p>
        <ul className="ml-5 list-disc space-y-1.5 mb-3">
          <li>no payment and only an interest reservation, or</li>
          <li>a small refundable reservation deposit.</li>
        </ul>
        <p>
          Final payment or fulfillment details will be confirmed before the
          order is placed. At checkout today you can also pay by card or choose
          cash on delivery for when your order arrives.
        </p>
      </>
    ),
  },
  {
    q: "What if the product cannot be sourced or the final price changes?",
    a: "If we cannot source the product properly, or if the final landed cost becomes too high, we may cancel that product from the test. Any refundable reservation deposit will be returned.",
  },
  {
    q: "Is this a subscription?",
    a: "No. PLUK is not a subscription. You can preorder individual products à la carte.",
  },
  {
    q: "Can I suggest products?",
    a: "Yes. PLUK is built around what Indian families in Canada actually want. You can request products you miss from India or products you want at fairer Canadian prices.",
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
