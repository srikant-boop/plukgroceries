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
          PLUK is Aldi-style Indian grocery for the diaspora — a short shelf
          of 33 staples (atta, rice, dal, spices, and everyday pantry), not a
          full store.
        </p>
        <p>
          We keep margins thin on price-memorized items like atta and toor dal,
          and home deliver in Oakville. Want something we do not carry? Tell us.
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
          people reserve a product. If the minimum is not reached, we may
          cancel that item or try it in a later round.
        </p>
        <p>
          Preorders keep prices fair and help us learn what Oakville shoppers
          actually want before we import larger quantities.
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
          Our model is closer to <strong>Aldi than a specialty store</strong>:
          keep the shelf short, negotiate hard, and pass savings through.{" "}
          <strong>Atta and rice are at wholesale (0% markup)</strong> — you
          know those prices by heart. Everything else carries a{" "}
          <strong>20% margin</strong>, and only locks in once enough orders
          fill the same case.
        </p>
        <p className="mb-3">
          This is a demand-first group buy. We import after the preorder window
          closes and a product hits its case minimum — that is when we get
          distributor pricing from Everest Traders and A1 Cash and Carry. Freight,
          customs, and handling land on fewer units at first, which is why a box
          may cost more here than in India today.
        </p>
        <p>
          When enough people reserve a product, we import a larger batch — fixed
          costs spread across more units and the next round can come in lower.
          Know someone else who would want this? Share{" "}
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
    a: "Everyday Indian pantry staples — atta, rice, dal, spices, and cooking essentials for home kitchens in Oakville.",
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
