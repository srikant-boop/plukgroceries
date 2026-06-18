import Image from "next/image";
import Link from "next/link";
import type { Supplier } from "@/lib/suppliers";

export function BrandLogo({
  supplier,
  linked = false,
  className = "relative h-10 w-28",
}: {
  supplier: Pick<Supplier, "slug" | "name" | "logo">;
  linked?: boolean;
  className?: string;
}) {
  if (!supplier.logo) return null;

  const img = (
    <div className={className}>
      <Image
        src={supplier.logo}
        alt={`${supplier.name} logo`}
        fill
        sizes="112px"
        className="object-contain object-left"
      />
    </div>
  );

  if (linked) {
    return (
      <Link
        href={`/suppliers/${supplier.slug}`}
        className="inline-block hover:opacity-80 transition-opacity"
      >
        {img}
      </Link>
    );
  }

  return img;
}
