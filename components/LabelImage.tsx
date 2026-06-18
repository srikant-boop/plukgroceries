import Image from "next/image";

export function LabelImage({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="relative w-full overflow-hidden border border-line bg-surface">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={1200}
        className="h-auto w-full object-contain"
        sizes="(min-width: 1024px) 50vw, 100vw"
      />
    </div>
  );
}
