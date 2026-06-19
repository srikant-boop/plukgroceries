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

function CategoryMenu({ linkClassName }: { linkClassName?: string }) {
  const collections = activePantryCollections();

  return (
    <>
      <Link href="/#pantry" className={linkClassName}>
        All products
      </Link>
      {collections.map((c) => (
        <Link key={c.slug} href={`/shop/${c.slug}`} className={linkClassName}>
          {c.navLabel}
        </Link>
      ))}
    </>
  );
}

const menuLink =
  "block whitespace-nowrap px-3 py-1.5 text-sm hover:bg-surface hover:text-accent transition-colors";

const dropdownPanel =
  "border border-line bg-background py-1 shadow-md w-max min-w-[9.5rem]";

/** Shop entry with category links in a dropdown — desktop hover, mobile expand. */
export function ShopNav() {
  return (
    <>
      <div className="relative hidden lg:inline-block">
        <div className="group peer">
          <Link
            href="/#pantry"
            className="inline-flex items-center gap-1 hover:underline underline-offset-4"
          >
            Shop
            <Chevron className="opacity-60 transition-transform group-hover:rotate-180" />
          </Link>
        </div>
        <div
          className="absolute left-0 top-full z-50 pt-2 opacity-0 invisible pointer-events-none transition-opacity peer-hover:opacity-100 peer-hover:visible peer-hover:pointer-events-auto peer-focus-within:opacity-100 peer-focus-within:visible peer-focus-within:pointer-events-auto hover:opacity-100 hover:visible hover:pointer-events-auto focus-within:opacity-100 focus-within:visible focus-within:pointer-events-auto"
          role="menu"
          aria-label="Shop categories"
        >
          <div className={dropdownPanel}>
            <CategoryMenu linkClassName={menuLink} />
          </div>
        </div>
      </div>

      <details className="relative lg:hidden w-fit">
        <summary className="inline-flex items-center gap-1 cursor-pointer list-none hover:underline underline-offset-4 [&::-webkit-details-marker]:hidden">
          Shop
          <Chevron className="opacity-60" />
        </summary>
        <div className={`absolute left-0 top-full z-50 pt-2 ${dropdownPanel}`}>
          <CategoryMenu linkClassName={menuLink} />
        </div>
      </details>
    </>
  );
}
