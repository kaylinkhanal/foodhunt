import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "pngimg.com",
      "w7.pngwing.com",
      "placehold.co",
      "e7.pngegg.com",
      "khukurinepalirestaurant.com.au",
      "restaurant.heshela.com.au",
      "www.vhv.rs",
      "assets.stickpng.com",
      "www.kindpng.com",
      "raw.githubusercontent.com",
      "rosepng.com",
      "purepng.com",
      // Extract just the hostname from the API URL
      ...(process.env.NEXT_PUBLIC_API_URL
        ? [new URL(process.env.NEXT_PUBLIC_API_URL).hostname]
        : []),
      // Add any other domains you're using
    ],
  },
};

export default nextConfig;
