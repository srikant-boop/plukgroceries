import { SITE_URL, WHATSAPP_GROUP_URL } from "@/lib/site";

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
          Early prices are higher because we are{" "}
          <strong>importing in small batches</strong>. This is a demand-first
          test — we expect low order counts at first, so freight, customs, and
          handling land on fewer units. That is the main reason a box costs more
          here than in India.
        </p>
        <p className="mb-3">
          Our model is closer to <strong>Aldi than a specialty store</strong>:
          keep the shelf short, negotiate hard, take a thin margin, and pass
          savings through. We are not trying to charge premium for premium&apos;s
          sake — we want clean Indian food at the lowest fair price we can offer
          at this volume.
        </p>
        <p>
          <strong>Prices should drop as more people join.</strong> When enough
          families reserve the same product, we import a larger batch — fixed
          costs spread across more units and the next round can come in lower.
          Know another family who would want this? Share{" "}
          <a
            href={SITE_URL}
            className="underline underline-offset-2 hover:text-accent"
          >
            Pluk
          </a>{" "}
          or bring them into our{" "}
          <a
            href={WHATSAPP_GROUP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-accent"
          >
            WhatsApp group
          </a>
          . Every reservation helps.
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
