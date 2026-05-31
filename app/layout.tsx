import type { Metadata } from "next";
import Link from "next/link";
import { CartBadge } from "@/components/CartBadge";
import { Leaf } from "@/components/Leaf";
import { SocialIcon } from "@/components/SocialIcon";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pluk — A weekly market drop",
  description:
    "A small weekly market — top-grade produce, pantry, and small-batch finds from people we know. Picked up at a community spot in Oakville, paid by card at checkout.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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
      </body>
    </html>
  );
}
