import { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  },
  images: {
    deviceSizes: [640, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/dsybndjcb/**",
      },
    ],
  },
};

export default nextConfig;
