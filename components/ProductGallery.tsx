"use client";

import Image from "next/image";
import { useState } from "react";

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0]!;

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] bg-surface">
        <Image
          key={current}
          src={current}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square bg-surface border transition-colors ${
                index === active ? "border-foreground" : "border-line"
              }`}
              aria-label={`View image ${index + 1} of ${images.length}`}
              aria-current={index === active}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-0.5"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
