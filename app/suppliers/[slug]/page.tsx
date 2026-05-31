import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupplier, suppliers } from "@/lib/suppliers";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/ProductCard";
import { SocialIcon } from "@/components/SocialIcon";

export const dynamicParams = false;

export function generateStaticParams() {
  return suppliers.map((s) => ({ slug: s.slug }));
}

const TYPE_LABEL = {
  farmer: "Farmer",
  wholesaler: "Wholesaler",
  "farmer-wholesaler": "Farmer & wholesaler",
  maker: "Maker",
} as const;

export default async function SupplierPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supplier = getSupplier(slug);
  if (!supplier) notFound();

  const supplied = products.filter((p) => p.supplierId === supplier.id);

  return (
    <article>
      <header className="border-b border-line pb-10 mb-12 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div>
          <p className="eyebrow mb-3">{TYPE_LABEL[supplier.type]}</p>
          <h1 className="text-4xl sm:text-5xl mb-3 leading-[1.05]">
            {supplier.name}
          </h1>
          <p className="text-muted text-lg">{supplier.tagline}</p>
        </div>
        <div className="flex flex-col gap-3 sm:items-end">
          {supplier.logo && (
            <div className="relative h-12 w-32 sm:w-40">
              <Image
                src={supplier.logo}
                alt={`${supplier.name} logo`}
                fill
                sizes="160px"
                className="object-contain object-left sm:object-right"
              />
            </div>
          )}
          {supplier.location && (
            <p className="text-sm text-muted sm:text-right">
              {supplier.location}
            </p>
          )}
        </div>
      </header>

      <section className="grid gap-10 lg:grid-cols-[2fr_1fr] mb-16">
        <div className="text-base leading-relaxed text-foreground/85 space-y-4">
          {supplier.story.split(/\n\n+/).map((para) => (
            <p key={para.slice(0, 48)}>{para}</p>
          ))}
        </div>
        {supplier.links.length > 0 && (
          <aside className="border border-line p-6 bg-surface h-fit">
            <p className="eyebrow mb-4">Find them</p>
            <div className="flex flex-wrap gap-4 text-foreground">
              {supplier.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors"
                >
                  <SocialIcon href={l.href} label={l.label} size={22} />
                </a>
              ))}
            </div>
          </aside>
        )}
      </section>

      {supplier.location && (
        <section className="mb-16">
          <p className="eyebrow mb-3">On the map</p>
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
