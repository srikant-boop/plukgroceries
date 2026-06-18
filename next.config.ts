import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: "/about", destination: "/faq", permanent: true }];
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
