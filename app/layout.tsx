import type { Metadata } from "next";
import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";
import { Leaf } from "@/components/Leaf";
import { SocialIcon } from "@/components/SocialIcon";
import { AnalyticsProvider } from "@/components/AnalyticsProvider";
import {
  DEFAULT_DESCRIPTION,
  FACEBOOK_APP_ID,
  OG_IMAGE_ALT,
  OG_IMAGE_URL,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";
import "./globals.css";

const OG_IMAGE = {
  url: OG_IMAGE_URL,
  secureUrl: OG_IMAGE_URL,
  type: "image/png",
  width: 1200,
  height: 630,
  alt: OG_IMAGE_ALT,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${SITE_NAME} — A weekly market drop`,
  description: DEFAULT_DESCRIPTION,
  ...(FACEBOOK_APP_ID ? { facebook: { appId: FACEBOOK_APP_ID } } : {}),
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — A weekly market drop`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — A weekly market drop`,
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Explicit og:image for Facebook (must match a real, deployed static URL). */}
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:secure_url" content={OG_IMAGE_URL} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={OG_IMAGE_ALT} />
        <link rel="image_src" href={OG_IMAGE_URL} />
        {FACEBOOK_APP_ID ? (
          <meta property="fb:app_id" content={FACEBOOK_APP_ID} />
        ) : null}
      </head>
      <body className="min-h-screen flex flex-col">
        <AnalyticsProvider>
        <header className="border-b border-line bg-background">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link
              href="/"
              className="flex items-center gap-2.5 text-foreground hover:opacity-80"
              aria-label="Pluk · Oakville"
            >
              <Leaf size={26} className="text-accent" />
              <span className="text-xl tracking-[0.2em] font-medium">
                PLUK
              </span>
            </Link>
            <nav className="flex items-center gap-6 text-sm">
              <Link href="/" className="hover:underline underline-offset-4">
                Shop
              </Link>
              <Link href="/faq" className="hover:underline underline-offset-4">
                FAQ
              </Link>
              <Link
                href="/cart"
                className="flex items-center gap-1.5 hover:underline underline-offset-4"
              >
                Cart <CartBadge />
              </Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto w-full max-w-6xl px-6 py-10 flex-1">
          {children}
        </main>
        <footer className="border-t border-line mt-20">
          <div className="mx-auto max-w-6xl px-6 py-8 text-xs text-muted flex flex-wrap justify-between gap-3">
            <span>© Pluk</span>
            <a
              href="https://www.facebook.com/share/g/1cRmroAoyr/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
              aria-label="Facebook group"
            >
              <SocialIcon
                href="https://www.facebook.com/share/g/1cRmroAoyr/"
                size={20}
              />
            </a>
          </div>
        </footer>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
