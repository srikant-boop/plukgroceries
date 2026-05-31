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
      <path
        d="M12 2 C 5 7, 5 17, 12 22 C 19 17, 19 7, 12 2 Z"
        fill="currentColor"
      />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="21"
        stroke="var(--color-background)"
        strokeOpacity="0.9"
        strokeWidth="1"
      />
    </svg>
  );
}
