import { FOOTER_COMPLIANCE_NOTE } from "@/lib/site";

const facebookGroupHref = "https://www.facebook.com/share/g/1cRmroAoyr/";

type FaqItem = {
  q: string;
  a: React.ReactNode;
  anchorId?: string;
};

const faqs: FaqItem[] = [
  {
    q: "Who are these products for?",
    a: "Some items are for babies and toddlers, others for kids or the whole family. Each product page shows who it is for and suggested age where the brand provides it.",
  },
  {
    q: "Why only a few products?",
    a: "We keep a short shelf on purpose — one strong option per product type instead of dozens of flavours. If families reorder something, it stays. If not, we swap it out. Have a suggestion? Message us in the Oakville Facebook group — we read requests, but a new SKU usually replaces one that is not reordering.",
  },
  {
    q: "Where do products come from?",
    a: "These brands are made in India and imported for sale in Canada.",
  },
  {
    q: "Allergens and label information",
    a: "Product pages summarize official brand listings. Always read the physical package for the latest ingredients and allergen statements — that is what matters, especially for babies, toddlers, and known allergies.",
  },
  {
    q: "Home delivery",
    anchorId: "delivery",
    a: "All orders are home delivered in Oakville. At checkout, leave your delivery address and we will bring your order to you.",
  },
  {
    q: "How do I pay?",
    a: "Pay by card at checkout, cash on delivery, or e-transfer. For e-transfer or cash, choose that option at checkout — we will confirm payment details before we deliver.",
  },
  {
    q: "Cancellations and other questions",
    a: (
      <>
        Need to cancel before we pack your order, or have another question?
        Message us in the{" "}
        <a
          href={facebookGroupHref}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 hover:text-accent"
        >
          Oakville group on Facebook
        </a>{" "}
        — that is the fastest way to reach us.
      </>
    ),
  },
];

export function AboutFaq() {
  return (
    <section id="faq" className="scroll-mt-24">
      <h2 className="text-2xl mb-6 border-b border-line pb-3">
        Common questions
      </h2>
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
      <p className="mt-10 text-xs text-muted leading-relaxed">
        {FOOTER_COMPLIANCE_NOTE}
      </p>
    </section>
  );
}
