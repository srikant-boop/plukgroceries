import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/faq", permanent: true },
      {
        source: "/products/sona-masoori-rice-10lb",
        destination: "/products/sona-masoori-rice-20lb",
        permanent: true,
      },
      {
        source: "/products/salt-2kg",
        destination: "/products/salt-1kg",
        permanent: true,
      },
      {
        source: "/suppliers/brb",
        destination: "/suppliers/superyou",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "placehold.co" },
      { protocol: "https", hostname: "backedbybees.com" },
      { protocol: "https", hostname: "digital.loblaws.ca" },
    ],
  },
};

export default nextConfig;
