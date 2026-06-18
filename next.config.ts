import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/about", destination: "/faq", permanent: true },
      {
        source: "/products/brb-popped-chips-salt-pepper",
        destination: "/products/superyou-multigrain-protein-chips",
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
