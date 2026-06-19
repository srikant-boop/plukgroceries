import Link from "next/link";

/** Shop — one short shelf, no category dropdown. */
export function ShopNav() {
  return (
    <Link href="/#pantry" className="hover:underline underline-offset-4">
      Shop
    </Link>
  );
}
