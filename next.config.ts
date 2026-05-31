import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
