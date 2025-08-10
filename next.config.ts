// next.config.ts
import { NextConfig } from "next";

const base = process.env.NEXT_PUBLIC_STRAPI_BASE_URL ?? "";
let envHostname: string | null = null;
let envProtocol: "http" | "https" = "https";

try {
  if (base) {
    const u = new URL(base);
    envHostname = u.hostname;
    envProtocol = u.protocol === "http:" ? "http" : "https";
  }
} catch (err) {
  // invalid URL in env - ignore
  envHostname = null;
}

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  // local dev (http://localhost:1337/uploads/...)
  {
    protocol: "http",
    hostname: "localhost",
    port: "1337",
    pathname: "/uploads/**",
  },
  // some setups don't include port
  {
    protocol: "http",
    hostname: "localhost",
    pathname: "/uploads/**",
  },
  // Strapi Cloud media subdomains (wildcard for safety)
  {
    protocol: "https",
    hostname: "*.media.strapiapp.com",
    pathname: "/**",
  },
];

// Add the hostname from NEXT_PUBLIC_STRAPI_BASE_URL if present (keeps config specific)
if (envHostname) {
  remotePatterns.push({
    protocol: envProtocol,
    hostname: envHostname,
    // allow any path under that host; narrow to /uploads/** if you prefer
    pathname: "/**",
  });
}

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_STRAPI_BASE_URL: process.env.NEXT_PUBLIC_STRAPI_BASE_URL,
  },
  images: {
    remotePatterns,
    // If you want to allow all https hosts (not recommended):
    // remotePatterns: [{ protocol: "https", hostname: "*" }]
  },
};

export default nextConfig;
