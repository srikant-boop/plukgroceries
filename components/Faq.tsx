import { FOOTER_COMPLIANCE_NOTE } from "@/lib/site";

const facebookGroupHref = "https://www.facebook.com/share/g/1cRmroAoyr/";

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
          PLUK is a small, curated Indian baby, kids, and family pantry for
          Canada — breakfast, snack, and quick-meal products you can buy one at
          a time.
        </p>
        <p>
          We are not a full Indian grocery store, a subscription box, or a
          weekly drop. The shelf stays short on purpose so you are not comparing
          endless options — pick what you need and build your own basket.
        </p>
      </>
    ),
  },
  {
    q: "Who are these products for?",
    a: "Some items are for babies and toddlers, others for kids or the whole family. Each product page shows who it is for and suggested age where the brand provides it.",
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
    a: "Product pages summarize official brand listings. Always read the physical package for the latest ingredients and allergen statements — that is what matters, especially for babies, toddlers, and known allergies.",
  },
  {
    q: "How does delivery work?",
    anchorId: "delivery",
    a: "Every order is home delivered in Oakville. At checkout, leave your delivery address and we will bring your order to you.",
  },
  {
    q: "How do I pay?",
    a: "Pay by card at checkout, cash on delivery, or e-transfer. For cash or e-transfer, choose that option at checkout — we will confirm payment details before we deliver.",
  },
  {
    q: "How do I cancel or ask something else?",
    a: (
      <>
        Message us in the{" "}
        <a
          href={facebookGroupHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          Oakville group on Facebook
        </a>
        . That is the fastest way to reach us — whether you need to cancel before
        we pack your order, suggest a product, or ask anything else.
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
      <p className="mt-10 text-xs text-muted leading-relaxed">
        {FOOTER_COMPLIANCE_NOTE}
      </p>
    </>
  );
}
