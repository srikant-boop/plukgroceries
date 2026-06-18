import Link from "next/link";
import { Faq } from "@/components/Faq";

export const metadata = {
  title: "FAQ — Pluk",
  description:
    "Questions about PLUK — preorder testing, delivery in Oakville, payment, and product labels.",
};

export default function FaqPage() {
  return (
    <article className="max-w-3xl">
      <header className="mb-10">
        <h1 className="text-4xl sm:text-5xl leading-[1.05]">FAQ</h1>
        <p className="mt-4 text-base leading-relaxed text-foreground/80 max-w-2xl">
          Plain answers about PLUK, preorders, delivery, and product labels.
        </p>
      </header>

      <Faq />

      <div className="mt-12 flex flex-wrap gap-3 border-t border-line pt-10">
        <Link href="/#pantry" className="btn px-6 py-3 text-sm">
          Shop the Pantry
        </Link>
      </div>
    </article>
  );
}
