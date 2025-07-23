import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost", // Allow images from all domains
      },
      
    ],
  },
};

export default nextConfig;
