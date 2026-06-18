/** Canonical production URL for OG tags, emails, and share links. */
export const SITE_URL = "https://plukgroceries.vercel.app";

export const SITE_NAME = "Pluk";

export const SITE_TITLE =
  "Clean Indian foods for babies, kids, and families in Canada";

export const DEFAULT_DESCRIPTION =
  "A small à la carte curated Indian baby, kids, and family pantry in Canada — breakfast, snacks, and quick meals from trusted brands. Shop individual products; home delivery in Oakville.";

export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE_ALT =
  "Pluk — curated Indian family pantry for Canada";

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID?.trim() || undefined;
