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
  turbopack: {
    resolveAlias: {
      html2canvas: "html2canvas-pro",
    },
  },
};


export default nextConfig;
