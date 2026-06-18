/** Canonical production URL for OG tags, emails, and share links. */
export const SITE_URL = "https://plukgroceries.vercel.app";

export const SITE_NAME = "Pluk";

export const SITE_TITLE =
  "Clean Indian foods — from starting solids to family meals";

export const DEFAULT_DESCRIPTION =
  "A short à la carte shelf of trusted Indian breakfast, snack, and quick-meal brands — baby & toddler meals from 6 months, plus food for kids and family. Home delivered in Oakville.";

export const OG_IMAGE_PATH = "/og-image.png";

export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export const OG_IMAGE_ALT =
  "Pluk — curated Indian family pantry for Canada";

export const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID?.trim() || undefined;
