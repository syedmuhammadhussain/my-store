// lib/metadata.ts
import type { Metadata } from "next";

const SITE_URL =
  process.env.SITE_URL ||
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://example.com";

export function absoluteUrl(path?: string | null) {
  if (!path) return "";
  try {
    // if already absolute
    const u = new URL(path);
    return u.toString();
  } catch {
    // assume path like /uploads/img.jpg or uploads/img.jpg
    const cleaned = path.startsWith("/") ? path : `/${path}`;
    return `${SITE_URL.replace(/\/$/, "")}${cleaned}`;
  }
}

export function buildProductMetadata(product: {
  id?: string | number;
  name: string;
  slug: string;
  description?: string | null;
  gallery: { url: string | null }[];
  price?: string | number | null;
  currency?: string | null;
  availability?: string | null;
}): Metadata {
  debugger;
  const title = product.name;
  const description = (product.description || "").slice(0, 160);
  const canonical = `${SITE_URL.replace(/\/$/, "")}/product/${
    product.slug ?? product.id ?? ""
  }`;

  const ogImage = absoluteUrl(product.gallery?.[0]?.url ?? "");

  return {
    title: `${title} • Digo Fashion`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Digo Fashion",
      images: ogImage
        ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
        : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
    // Extra generic fields that are respected by some crawlers
    other: {
      "og:locale": "en_US",
      // optional: place your FB app id if available
      // "fb:app_id": process.env.FB_APP_ID ?? ""
    },
  } as unknown as Metadata;
}
