import Link from "next/link";
import { AboutFaq } from "@/components/AboutFaq";
import { Leaf } from "@/components/Leaf";

export const metadata = {
  title: "About — Pluk",
  description:
    "About PLUK — curated Indian family pantry, pickup, delivery, and common questions.",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl">
      <header className="mb-12 border-b border-line pb-8">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Leaf size={14} className="text-accent" aria-hidden />
          About PLUK
        </p>
        <h1 className="text-3xl sm:text-4xl mb-4 leading-[1.08]">
          A small curated Indian family pantry
        </h1>
        <p className="text-base leading-relaxed text-foreground/85 max-w-2xl">
          PLUK is an à la carte Indian baby, kids, and family pantry for Canada
          — not a full grocery store, not a subscription, and not a limited-time
          drop. You buy individual products and build your own basket.
        </p>
      </header>

      <AboutFaq />

      <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-10">
        <Link href="/#pantry" className="btn px-6 py-3 text-sm">
          Shop the Pantry
        </Link>
      </div>
    </article>
  );
}
