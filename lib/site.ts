/** Canonical production URL for OG tags, emails, and share links. */
export const SITE_URL = "https://plukgroceries.vercel.app";

export const SITE_NAME = "Pluk";

/** Browser tab, Open Graph, and share link title (after site name). */
export const SITE_TITLE = "Good food at near-wholesale prices";

export const DEFAULT_DESCRIPTION =
  "Weekly grocery drops in Oakville at near-wholesale prices — organic produce and pantry with transparent price comparisons. Sunday community pickup.";

/** Static share image — also mirrored as app/opengraph-image.png for Next metadata. */
export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE_ALT =
  "Fresh vegetables and honey — Pluk weekly market drop, Oakville";

/** Meta App ID for fb:app_id (optional — clears Facebook debugger warning). */
export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID?.trim() || undefined;
