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
          PLUK is a small, curated Indian pantry — trusted
          breakfast, snack, and quick-meal brands you can buy one at a time.
        </p>
        <p>
          Not a full grocery store, subscription box, or weekly drop. The shelf
          stays short on purpose — one strong pick per product type. Want
          something we do not carry? Tell us.
        </p>
      </>
    ),
  },
  {
    q: "How does preordering work?",
    a: (
      <>
        <p className="mb-3">
          We are running a demand-first test — nothing is sitting in a warehouse
          yet. We place the order after the preorder window closes and enough
          families reserve a product. If the minimum is not reached, we may
          cancel that item or try it in a later round.
        </p>
        <p>
          Preorders keep prices fair and help us learn what Indian families in
          Canada actually want before we import larger quantities.
        </p>
      </>
    ),
  },
  {
    q: "How does delivery work?",
    anchorId: "delivery",
    a: (
      <>
        <p className="mb-3">
          Expect your order about{" "}
          <strong>10–20 days after the preorder closes</strong> — ordering from
          India, air freight, customs, and local prep all take time even when the
          flight leg is quick. We home deliver every order.
        </p>
        <p>
          If timing slips, we will update you. Early tests can shift because of
          suppliers, customs, or courier delays.
        </p>
      </>
    ),
  },
  {
    q: "How do I pay?",
    anchorId: "payment",
    a: "Pay by card at checkout or cash on delivery.",
  },
  {
    q: "Who are these products for?",
    a: (
      <>
        <p className="mb-3">
          It varies — each product page shows who it is for and suggested age
          when the brand provides one.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Baby & toddler:</strong> from when a product is marked for
            starting solids.
          </li>
          <li>
            <strong>Toddlers & kids:</strong> when the texture and age note fit
            your child.
          </li>
          <li>
            <strong>Family:</strong> many items work for the whole household.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "How do I check allergens and ingredients?",
    a: "Each product page has Ingredients and Nutrition sections.",
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
            <summary className="py-5 cursor-pointer list-none hover:text-accent font-medium text-base leading-snug">
              {item.q}
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
