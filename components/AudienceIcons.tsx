export type AudienceLabel =
  | "Baby/Toddler"
  | "Toddlers"
  | "Kids"
  | "Family"
  | "Parents";

const SVG_BASE = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.75,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function BabyToddlerIcon() {
  return (
    <svg {...SVG_BASE}>
      <path d="M8.5 8.5c0-2.5 1.8-4.5 3.5-4.5s3.5 2 3.5 4.5" />
      <circle cx="12" cy="11" r="4.25" />
      <path d="M8.5 20c0-2.5 1.6-4.5 3.5-4.5s3.5 2 3.5 4.5" />
      <circle cx="10.25" cy="11" r="0.6" fill="currentColor" stroke="none" />
      <circle cx="13.75" cy="11" r="0.6" fill="currentColor" stroke="none" />
      <path d="M10.5 13.25c.75.5 2.25.5 3 0" />
    </svg>
  );
}

function ToddlerIcon() {
  return (
    <svg {...SVG_BASE}>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M9.5 20l1.5-6.5M14.5 20l-1.5-6.5" />
      <path d="M10 13.5h4" />
      <circle cx="10.75" cy="7.5" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="13.25" cy="7.5" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  );
}

function KidsIcon() {
  return (
    <svg {...SVG_BASE}>
      <circle cx="12" cy="7" r="2.75" />
      <path d="M6 13.5l3-2.5M18 13.5l-3-2.5" />
      <path d="M8.5 20c0-2.5 1.7-4.5 3.5-4.5s3.5 2 3.5 4.5" />
      <circle cx="10.75" cy="7" r="0.5" fill="currentColor" stroke="none" />
      <circle cx="13.25" cy="7" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg {...SVG_BASE}>
      <circle cx="6.5" cy="8" r="2.25" />
      <path d="M3 20c0-2 1.6-3.5 3.5-3.5" />
      <circle cx="12" cy="10" r="2" />
      <path d="M9.5 20c0-1.6 1.1-2.8 2.5-2.8s2.5 1.2 2.5 2.8" />
      <circle cx="17.5" cy="8" r="2.25" />
      <path d="M14 20c0-2 1.6-3.5 3.5-3.5" />
    </svg>
  );
}

function ParentsIcon() {
  return (
    <svg {...SVG_BASE}>
      <circle cx="8" cy="7" r="2.75" />
      <path d="M4 20c0-2.8 1.8-5 4-5s4 2.2 4 5" />
      <circle cx="16" cy="7" r="2.75" />
      <path d="M12 20c0-2.8 1.8-5 4-5s4 2.2 4 5" />
    </svg>
  );
}

const AUDIENCE_CONFIG: Record<
  AudienceLabel,
  { label: string; shortLabel: string; Icon: () => React.ReactElement }
> = {
  "Baby/Toddler": {
    label: "Baby & toddler",
    shortLabel: "Baby",
    Icon: BabyToddlerIcon,
  },
  Toddlers: { label: "Toddlers", shortLabel: "Toddlers", Icon: ToddlerIcon },
  Kids: { label: "Kids", shortLabel: "Kids", Icon: KidsIcon },
  Family: { label: "Family", shortLabel: "Family", Icon: FamilyIcon },
  Parents: { label: "Parents", shortLabel: "Parents", Icon: ParentsIcon },
};

export function AudienceIcons({
  audience,
  variant = "default",
}: {
  audience: string[];
  variant?: "default" | "chip";
}) {
  const chipClass =
    "inline-flex items-center gap-1 border border-line px-2 py-0.5 text-[9px] uppercase tracking-wide text-muted";
  const defaultClass =
    "inline-flex items-center gap-1.5 border border-line bg-surface px-2.5 py-1.5 text-xs text-foreground/90";

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {audience.map((item) => {
        const config = AUDIENCE_CONFIG[item as AudienceLabel];
        if (!config) {
          return (
            <span
              key={item}
              className={variant === "chip" ? chipClass : defaultClass}
            >
              {item}
            </span>
          );
        }
        const { Icon, label, shortLabel } = config;
        return (
          <span
            key={item}
            title={label}
            className={variant === "chip" ? chipClass : defaultClass}
          >
            <span className={variant === "chip" ? "scale-75" : undefined}>
              <Icon />
            </span>
            <span>{shortLabel}</span>
          </span>
        );
      })}
    </div>
  );
}
