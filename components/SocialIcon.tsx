// Maps a URL to the right social/web icon. Inline SVG — currentColor so the
// icon picks up its parent text colour. Falls back to a globe for any URL we
// don't recognise.

type Kind =
  | "instagram"
  | "facebook"
  | "twitter"
  | "linkedin"
  | "whatsapp"
  | "website";

const kindForHref = (href: string): Kind => {
  try {
    const h = new URL(href).hostname.replace(/^www\./, "").toLowerCase();
    if (h.includes("instagram.com")) return "instagram";
    if (h.includes("facebook.com")) return "facebook";
    if (h.includes("whatsapp.com") || h.includes("wa.me")) return "whatsapp";
    if (h === "x.com" || h.includes("twitter.com")) return "twitter";
    if (h.includes("linkedin.com")) return "linkedin";
    return "website";
  } catch {
    return "website";
  }
};

const TITLE: Record<Kind, string> = {
  instagram: "Instagram",
  facebook: "Facebook",
  whatsapp: "WhatsApp",
  twitter: "X (Twitter)",
  linkedin: "LinkedIn",
  website: "Website",
};

export function SocialIcon({
  href,
  label,
  size = 22,
  className = "",
}: {
  href: string;
  /** Overrides the default icon title (e.g. supplier link label). */
  label?: string;
  size?: number;
  className?: string;
}) {
  const kind = kindForHref(href);
  const title = label?.trim() || TITLE[kind];
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    role: "img" as const,
    "aria-label": title,
    className,
    xmlns: "http://www.w3.org/2000/svg",
  };

  if (kind === "instagram") {
    return (
      <svg
        {...common}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title>{title}</title>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  if (kind === "facebook") {
    return (
      <svg {...common} fill="currentColor">
        <title>{title}</title>
        <path d="M22 12a10 10 0 1 0-11.6 9.9V14.9H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.3.2 2.3.2v2.5h-1.3c-1.3 0-1.7.8-1.7 1.6V12h2.9l-.5 2.9h-2.4V22A10 10 0 0 0 22 12Z" />
      </svg>
    );
  }
  if (kind === "whatsapp") {
    return (
      <svg {...common} fill="currentColor">
        <title>{title}</title>
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.33 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2Zm0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.23 8.24Zm4.52-6.16c-.25-.12-1.47-.72-1.7-.81-.23-.08-.4-.12-.57.12-.17.25-.66.81-.81.97-.15.17-.3.19-.55.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.57-1.38-.78-1.89-.2-.5-.41-.43-.57-.44h-.49c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05 0 1.21.88 2.38 1 2.55.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.23-.16-.48-.28Z" />
      </svg>
    );
  }
  if (kind === "twitter") {
    return (
      <svg {...common} fill="currentColor">
        <title>{title}</title>
        <path d="M17.2 3h3.3l-7.2 8.2L22 21h-6.6l-5.2-6.8L4.2 21H.8l7.7-8.8L0 3h6.8l4.7 6.2L17.2 3Zm-1.2 16h1.8L7.2 5H5.3l10.7 14Z" />
      </svg>
    );
  }
  if (kind === "linkedin") {
    return (
      <svg {...common} fill="currentColor">
        <title>{title}</title>
        <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.8v1.7h.1c.5-1 1.9-2 3.9-2 4.1 0 4.9 2.7 4.9 6.1V21h-4v-5.5c0-1.3 0-3-1.8-3-1.8 0-2.1 1.4-2.1 2.9V21h-4V9Z" />
      </svg>
    );
  }
  return (
    <svg
      {...common}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <title>{title}</title>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.7 4 6.2 4 9s-1.5 6.3-4 9c-2.5-2.7-4-6.2-4-9s1.5-6.3 4-9Z" />
    </svg>
  );
}
