import { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  },
  images: {
    deviceSizes: [
      180, 240, 300, 360, 400, 460, 540, 590, 630, 670, 720, 770, 814, 900,
      1024, 1080, 1200, 1400
    ],
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
