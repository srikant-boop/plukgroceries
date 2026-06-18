/** Canonical production URL for OG tags, emails, and share links. */
export const SITE_URL = "https://plukgroceries.vercel.app";

export const SITE_NAME = "Pluk";

export const SITE_TITLE =
  "Clean Indian foods for babies, kids, and family";

export const DEFAULT_DESCRIPTION =
  "A short à la carte shelf of trusted Indian breakfast, snack, and quick-meal brands — home delivered in Oakville. Buy one product or build your basket.";

export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE_ALT =
  "Pluk — curated Indian family pantry for Canada";

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID?.trim() || undefined;
