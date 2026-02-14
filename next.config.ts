import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   serverActions: {
  //     bodySizeLimit: "5mb",
  //   },
  // },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "flagcdn.com",
      },
      {
        protocol: "https",
        hostname: "places.googleapis.com",
      },
    ],
  },
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;
