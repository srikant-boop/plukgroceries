"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

function ChevronLeft() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ProductGallery({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [active, setActive] = useState(0);
  const count = images.length;
  const current = images[active] ?? images[0]!;

  const goPrev = useCallback(() => {
    setActive((i) => (i <= 0 ? count - 1 : i - 1));
  }, [count]);

  const goNext = useCallback(() => {
    setActive((i) => (i >= count - 1 ? 0 : i + 1));
  }, [count]);

  useEffect(() => {
    if (count <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [count, goPrev, goNext]);

  return (
    <div className="space-y-3">
      <div className="relative aspect-[4/5] bg-surface group">
        <Image
          key={current}
          src={current}
          alt={`${alt} — image ${active + 1} of ${count}`}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-contain"
          priority={active === 0}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-line bg-surface/95 text-foreground shadow-sm transition-opacity hover:bg-surface"
              aria-label="Previous image"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              onClick={goNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-line bg-surface/95 text-foreground shadow-sm transition-opacity hover:bg-surface"
              aria-label="Next image"
            >
              <ChevronRight />
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs tabular-nums bg-surface/90 border border-line px-2 py-0.5">
              {active + 1} / {count}
            </p>
          </>
        )}
      </div>
      {count > 1 && (
        <div className="grid grid-cols-5 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
          {images.map((src, index) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(index)}
              className={`relative aspect-square bg-surface border transition-colors ${
                index === active ? "border-foreground" : "border-line"
              }`}
              aria-label={`View image ${index + 1} of ${count}`}
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
