/** Canonical production URL for OG tags, emails, and share links. */
export const SITE_URL = "https://plukgroceries.vercel.app";

export const SITE_NAME = "Pluk";

export const SITE_TITLE = "Clean Indian foods for the whole family";

export const DEFAULT_DESCRIPTION =
  "A short à la carte shelf of trusted Indian breakfast, snack, and quick-meal brands — preorder one product or build your basket.";

export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE_ALT = "Pluk — curated Indian family pantry";

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID?.trim() || undefined;

export const FACEBOOK_GROUP_URL =
  "https://www.facebook.com/share/g/1cRmroAoyr/";

export const WHATSAPP_GROUP_URL =
  "https://chat.whatsapp.com/KCRa5rASPpZDF5qWKq5baN";
