export const LEAF_PATH =
  "M14.2 3c2.3.5 4.6 3.5 5.3 7 0.7 2.8-.1 5.5-1.5 7.5-1.3 2-3.6 3.3-5.4 4-.3.8-.45 1.6-.35 2.35-.4-1.15-.5-2.55-.2-3.85-1.8-.7-3.3-2.2-4.1-4.1-1.3-3.2-.7-7 1.7-9.5 1.6-1.7 3.2-2.4 4.75-2.4z";

export function Leaf({
  size = 24,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fill="currentColor" d={LEAF_PATH} />
    </svg>
  );
}
