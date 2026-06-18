export type ProductDetailAccordionItem = {
  id: string;
  title: string;
  content: React.ReactNode;
};

export function ProductDetailAccordion({
  items,
}: {
  items: ProductDetailAccordionItem[];
}) {
  return (
    <div className="border-t border-line">
      {items.map((item) => (
        <details key={item.id} id={item.id} className="group border-b border-line">
          <summary className="flex items-center justify-between gap-3 py-4 cursor-pointer list-none hover:text-accent">
            <span className="eyebrow">{item.title}</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 transition-transform group-open:rotate-180"
              aria-hidden
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </summary>
          <div className="pb-5 text-sm leading-relaxed text-foreground/85">
            {item.content}
          </div>
        </details>
      ))}
    </div>
  );
}
