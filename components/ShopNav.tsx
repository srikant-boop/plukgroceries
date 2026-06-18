import Link from "next/link";
import { PANTRY_COLLECTIONS } from "@/lib/pantry-catalog";

function Chevron({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

function CategoryMenu({
  className,
  linkClassName,
}: {
  className?: string;
  linkClassName?: string;
}) {
  return (
    <div className={className}>
      <Link href="/#pantry" className={linkClassName}>
        All products
      </Link>
      {PANTRY_COLLECTIONS.map((c) => (
        <Link key={c.slug} href={`/shop/${c.slug}`} className={linkClassName}>
          {c.navLabel}
        </Link>
      ))}
    </div>
  );
}

const menuLink =
  "block px-4 py-2 text-sm hover:bg-surface hover:text-accent transition-colors";

/** Shop entry with category links in a dropdown — desktop hover, mobile expand. */
export function ShopNav() {
  return (
    <>
      <div className="relative group hidden lg:block">
        <Link
          href="/#pantry"
          className="inline-flex items-center gap-1 hover:underline underline-offset-4"
        >
          Shop
          <Chevron className="opacity-60 transition-transform group-hover:rotate-180" />
        </Link>
        <div className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible pointer-events-none transition-opacity group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto">
          <div className="border border-line bg-background py-1 min-w-[11rem] shadow-sm">
            <CategoryMenu linkClassName={menuLink} />
          </div>
        </div>
      </div>

      <details className="lg:hidden relative">
        <summary className="inline-flex items-center gap-1 cursor-pointer list-none hover:underline underline-offset-4 [&::-webkit-details-marker]:hidden">
          Shop
          <Chevron className="opacity-60" />
        </summary>
        <div className="absolute left-0 top-full z-50 mt-2 border border-line bg-background py-1 min-w-[11rem] shadow-sm">
          <CategoryMenu linkClassName={menuLink} />
        </div>
      </details>
    </>
  );
}
