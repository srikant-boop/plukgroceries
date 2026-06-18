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

/** Infant — large head, small body, bonnet curve */
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

/** Walking toddler — slightly taller, legs apart */
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

/** Child — school-age proportion, arms out */
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

/** Whole family — adult, child, adult */
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

/** Two adults — taller figures, no child */
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
  { label: string; Icon: () => React.ReactElement }
> = {
  "Baby/Toddler": { label: "Baby & toddler", Icon: BabyToddlerIcon },
  Toddlers: { label: "Toddlers", Icon: ToddlerIcon },
  Kids: { label: "Kids", Icon: KidsIcon },
  Family: { label: "Family", Icon: FamilyIcon },
  Parents: { label: "Parents", Icon: ParentsIcon },
};

export function AudienceIcons({ audience }: { audience: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {audience.map((item) => {
        const config = AUDIENCE_CONFIG[item as AudienceLabel];
        if (!config) {
          return (
            <span
              key={item}
              className="inline-flex items-center border border-line bg-surface px-2.5 py-1.5 text-xs"
            >
              {item}
            </span>
          );
        }
        const { Icon, label } = config;
        return (
          <span
            key={item}
            className="inline-flex items-center gap-2 border border-line bg-surface px-2.5 py-1.5 text-xs text-foreground/90"
            title={label}
          >
            <Icon />
            <span>{label}</span>
          </span>
        );
      })}
    </div>
  );
}
