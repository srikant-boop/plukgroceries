export type AudienceLabel =
  | "Baby/Toddler"
  | "Toddlers"
  | "Kids"
  | "Family"
  | "Parents";

const ICON_PROPS = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

function BabyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M6 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <path d="M9 5.5c.5-1 2.5-1 3 0" />
    </svg>
  );
}

function ToddlerIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="7.5" r="3" />
      <path d="M7 20c0-2.8 2.2-5 5-5s5 2.2 5 5" />
      <path d="M10 18l-1.5 2M14 18l1.5 2" />
    </svg>
  );
}

function KidsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="12" cy="7" r="3" />
      <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5S18.5 16.4 18.5 20" />
      <path d="M9 12.5h6" />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="8" cy="8" r="2.5" />
      <circle cx="16" cy="8" r="2.5" />
      <circle cx="12" cy="6" r="2" />
      <path d="M3 20c0-2.8 2.2-5 5-5M16 15c2.8 0 5 2.2 5 5M9 20c0-2.2 1.8-4 4-4s4 1.8 4 4" />
    </svg>
  );
}

function ParentsIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="16.5" cy="9" r="2.5" />
      <path d="M4 20c0-3.3 2.7-6 6-6M13 20c0-2.5 1.8-4.5 4.2-4.9" />
    </svg>
  );
}

const AUDIENCE_CONFIG: Record<
  AudienceLabel,
  { title: string; Icon: () => React.ReactElement }
> = {
  "Baby/Toddler": { title: "Baby & toddler", Icon: BabyIcon },
  Toddlers: { title: "Toddlers", Icon: ToddlerIcon },
  Kids: { title: "Kids", Icon: KidsIcon },
  Family: { title: "Family", Icon: FamilyIcon },
  Parents: { title: "Parents", Icon: ParentsIcon },
};

export function AudienceIcons({ audience }: { audience: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {audience.map((item) => {
        const config = AUDIENCE_CONFIG[item as AudienceLabel];
        if (!config) {
          return (
            <span key={item} className="text-sm">
              {item}
            </span>
          );
        }
        const { Icon, title } = config;
        return (
          <span
            key={item}
            title={title}
            aria-label={title}
            className="inline-flex h-9 w-9 items-center justify-center border border-line bg-surface text-foreground/80"
          >
            <Icon />
          </span>
        );
      })}
    </div>
  );
}
