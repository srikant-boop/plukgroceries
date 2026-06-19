import { WHATSAPP_GROUP_URL } from "@/lib/site";

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
    q: "Why do prices cost what they do?",
    anchorId: "pricing",
    a: (
      <>
        <p className="mb-3">
          We are not a conventional grocery aisle — and these are not commodity
          boxes. You are comparing clean, millet-based, no-refined-sugar kids&apos;
          food to other{" "}
          <strong>clean and premium</strong> options (organic cereals, pouches,
          better-for-you snacks), which often sit around $6–12. Against that
          shelf, our prices are in line. Measuring against the cheapest pancake
          mix or pasta at a big-box store is the one comparison we cannot win —
          and we do not try.
        </p>
        <p className="mb-3">
          If you know what these brands cost in India, the Canada price can look
          steep. That gap is real — but most of it is not markup for its own
          sake. You are paying for the product{" "}
          <strong>here</strong>: vetted for clean ingredients, flown in, cleared
          through customs, handled locally, and home delivered from someone in
          your community. Freight and duty do not disappear when the batch is
          small.
        </p>
        <p className="mb-3">
          We would rather be open about that than hide it. Diaspora buyers
          usually accept that imported goods cost more in Canada. What erodes
          trust is feeling gouged — so we keep the shelf short, drop items we
          cannot defend at this price, and only stock what is worth the premium.
        </p>
        <p>
          <strong>More families in a round helps everyone.</strong> When enough
          people reserve the same product, we import a larger batch — freight,
          duty, and handling get spread across more units, and future rounds can
          come in lower. That is exactly why we run demand-first preorders
          instead of guessing inventory. Reserve what you want; if people come
          back for it, we know the price works and we keep going.
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
    a: "Choose e-transfer or cash on delivery when you reserve — nothing is collected until we confirm the preorder is going ahead.",
  },
  {
    q: "Who are these products for?",
    a: (
      <>
        <p className="mb-3">
          Cards show name, size, price, and a few tags — open a product for
          full details, ingredients, and suggested age.
        </p>
        <ul className="ml-5 list-disc space-y-1.5">
          <li>
            <strong>Baby & toddler:</strong> starting solids (from 6 months).
          </li>
          <li>
            <strong>Toddlers:</strong> 12 months+ — only on products tagged for
            them.
          </li>
          <li>
            <strong>Kids:</strong> school-age (3+).
          </li>
          <li>
            <strong>Family:</strong> everyone at the table.
          </li>
        </ul>
      </>
    ),
  },
  {
    q: "How do I check allergens and ingredients?",
    a: "Ingredients and nutrition are listed on every product.",
  },
  {
    q: "Request a product",
    anchorId: "request",
    a: (
      <>
        <p className="mb-3">
          Looking for a brand or product we do not stock yet? Tell us what you
          want — we use requests to decide what goes on the shelf next.
        </p>
        <p>
          Contact us on{" "}
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-accent"
          >
            WhatsApp
          </a>
          .
        </p>
      </>
    ),
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
