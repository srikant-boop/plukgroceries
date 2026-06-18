import Link from "next/link";
import { Leaf } from "@/components/Leaf";

export default function AboutPage() {
  return (
    <article className="max-w-2xl">
      <header className="mb-10 border-b border-line pb-8">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Leaf size={14} className="text-accent" aria-hidden />
          About PLUK
        </p>
        <h1 className="text-3xl sm:text-4xl mb-4">
          A small curated Indian family pantry
        </h1>
        <p className="text-base leading-relaxed text-foreground/85">
          PLUK is an à la carte curated Indian baby, kids, and family pantry for
          Canada — not a full grocery store, not a subscription, and not a
          limited-time drop.
        </p>
      </header>

      <div className="space-y-6 text-sm leading-relaxed text-foreground/85">
        <section>
          <h2 className="text-lg mb-2">What we are</h2>
          <p>
            We carry a intentionally small shelf of Indian breakfast, snack, and
            quick-meal products from trusted brands like Slurrp Farm, Early
            Foods, Farmley, and Timios. You buy individual products — one cereal,
            one noodle pack, one cookie tin — and build your own basket.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-2">What we are not</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Not a full Indian grocery store</li>
            <li>Not a weekly drop or preorder window</li>
            <li>Not a subscription box or forced bundle</li>
            <li>Not a wellness or supplement shop</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg mb-2">Limited selection, on purpose</h2>
          <p>
            We keep the shelf intentionally small so parents do not have to
            compare endless options. Each SKU must earn its place. If families
            reorder it, it stays on the shelf. If not, we replace it.
          </p>
        </section>

        <section>
          <h2 className="text-lg mb-2">Fulfillment</h2>
          <p>
            Orders are fulfilled with Oakville pickup or local delivery options
            shown at checkout — the same simple flow as before, now for pantry
            products instead of produce.
          </p>
        </section>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/#pantry" className="btn px-6 py-3 text-sm">
          Shop the Pantry
        </Link>
        <Link
          href="/#how-we-choose"
          className="inline-flex items-center px-6 py-3 text-sm border border-line hover:bg-surface"
        >
          How we choose products
        </Link>
      </div>
    </article>
  );
}
