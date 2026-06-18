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
        d="M12 3.5c-4.8 3.2-5.8 9.8-2.6 14.8 1 1.5 2.6 2.4 2.6 2.4s1.6-.9 2.6-2.4c3.2-5 2.2-11.6-2.6-14.8z"
        fill="currentColor"
      />
    </svg>
  );
}
