import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupplier, suppliers, supplierIntroLabel } from "@/lib/suppliers";
import { products, isStorefrontProduct } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { BrandLogo } from "@/components/BrandLogo";
import { SocialIcon } from "@/components/SocialIcon";

/** Short label beside icon — avoids noisy handles in the sidebar. */
function linkLabel(href: string, label: string): string {
  const l = label.toLowerCase();
  if (l.startsWith("instagram")) return "Instagram";
  if (l.startsWith("facebook")) return "Facebook";
  if (l === "website" || l.startsWith("website")) return "Website";
  try {
    const h = new URL(href).hostname.replace(/^www\./, "");
    if (h.includes("instagram.com")) return "Instagram";
    if (h.includes("facebook.com")) return "Facebook";
  } catch {
    /* use label */
  }
  return label;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return suppliers.map((s) => ({ slug: s.slug }));
}

const TYPE_LABEL = {
  farmer: "Farmer",
  wholesaler: "Wholesaler",
  "farmer-wholesaler": "Farmer & wholesaler",
  maker: "Maker",
  brand: "Brand",
} as const;

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) notFound();

  const supplied = products.filter(
    (p) => p.supplierId === supplier.id && isStorefrontProduct(p),
  );

  return (
    <article>
      <header className="border-b border-line pb-10 mb-12 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          {supplier.type !== "maker" && (
            <p className="eyebrow mb-3">{TYPE_LABEL[supplier.type]}</p>
          )}
          <h1 className="text-4xl sm:text-5xl mb-3 leading-[1.05]">
            {supplier.name}
          </h1>
          <p className="text-muted text-lg">{supplier.tagline}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          <BrandLogo supplier={supplier} className="relative h-14 w-36 sm:h-16 sm:w-44" />
          {supplier.location && (
            <p className="text-sm text-muted sm:text-right">
              {supplier.location}
            </p>
          )}
        </div>
      </header>

      <section className="grid gap-10 lg:grid-cols-[2fr_1fr] mb-16">
        <div>
          {supplierIntroLabel(supplier) && (
            <p className="eyebrow mb-4">{supplierIntroLabel(supplier)}</p>
          )}
          <div className="text-base leading-relaxed text-foreground/90 space-y-5">
            {supplier.story.split(/\n\n+/).map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
        </div>
        {(supplier.links.length > 0 || supplier.location) && (
          <aside className="border border-line p-6 bg-surface h-fit space-y-4">
            {supplier.location && (
              <div>
                <p className="eyebrow mb-2">
                  {supplier.type === "maker" ? "Their shop" : "Location"}
                </p>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {supplier.location}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(supplier.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm underline underline-offset-4 mt-2 inline-block hover:text-accent"
                >
                  Directions ↗
                </a>
              </div>
            )}
            {supplier.links.length > 0 && (
              <div>
                <p className="eyebrow mb-2">Online</p>
                <ul className="space-y-3 text-sm">
                  {supplier.links.map((l) => (
                    <li key={l.href}>
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2.5 text-foreground/90 hover:text-accent transition-colors"
                      >
                        <SocialIcon
                          href={l.href}
                          label={l.label}
                          size={18}
                          className="shrink-0 opacity-80"
                        />
                        <span className="underline underline-offset-4">
                          {linkLabel(l.href, l.label)}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </section>

      {supplier.location && (
        <section className="mb-16">
          <p className="eyebrow mb-3">Where to find them</p>
          <div className="aspect-[3/1] overflow-hidden border border-line bg-surface">
            <iframe
              src={`https://www.google.com/maps?q=${encodeURIComponent(supplier.location)}&output=embed`}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`Map of ${supplier.name}`}
            />
          </div>
        </section>
      )}

      {supplied.length > 0 && (
        <section>
          <div className="mb-6 flex items-baseline justify-between border-b border-line pb-3">
            <h2 className="text-2xl">From {supplier.name}</h2>
            <span className="eyebrow">
              {supplied.length} {supplied.length === 1 ? "item" : "items"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {supplied.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <Link
        href="/"
        className="inline-block mt-12 text-sm text-muted hover:text-foreground underline underline-offset-4"
      >
        ← Back to shop
      </Link>
    </article>
  );
}
