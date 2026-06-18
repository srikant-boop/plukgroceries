import Link from "next/link";
import { activePantryCollections } from "@/lib/pantry-catalog";

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
  const collections = activePantryCollections();

  return (
    <div className={className}>
      <Link href="/#pantry" className={linkClassName}>
        All products
      </Link>
      {collections.map((c) => (
        <Link key={c.slug} href={`/shop/${c.slug}`} className={linkClassName}>
          {c.navLabel}
        </Link>
      ))}
    </div>
  );
}

const menuLink =
  "block px-4 py-2 text-sm hover:bg-surface hover:text-accent transition-colors";

const dropdownPanel =
  "border border-line bg-background py-1 min-w-[11rem] shadow-md";

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
        <div className="absolute left-0 top-full z-50 opacity-0 invisible pointer-events-none transition-opacity group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto">
          {/* Invisible bridge so the menu stays open when moving the cursor down */}
          <div className="h-2" aria-hidden />
          <div className={dropdownPanel}>
            <CategoryMenu linkClassName={menuLink} />
          </div>
        </div>
      </div>

      <details className="lg:hidden relative">
        <summary className="inline-flex items-center gap-1 cursor-pointer list-none hover:underline underline-offset-4 [&::-webkit-details-marker]:hidden">
          Shop
          <Chevron className="opacity-60" />
        </summary>
        <div className={`absolute left-0 top-full z-50 mt-1 ${dropdownPanel}`}>
          <CategoryMenu linkClassName={menuLink} />
        </div>
      </details>
    </>
  );
}
