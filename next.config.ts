import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: "/col-social-preview.jpg",
      headers: [{ key: "Cache-Control", value: "public, max-age=300, s-maxage=300" }],
    }];
  },
};

export default nextConfig;
