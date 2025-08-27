import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const defaultPageSizeForProductList = 20;

export const sizes = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "3XL",
  "4XL",
  "5XL",
  "3-4",
  "5-6",
  "7-8",
  "9-10",
  "11-12",
  "13-14",
  "Standard",
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizeSize = (s?: unknown): string => {
  if (typeof s === "string") return s.trim().toUpperCase();
  if (
    typeof s === "object" &&
    s &&
    "label" in s &&
    typeof (s as any).label === "string"
  ) {
    return (s as any).label.trim().toUpperCase();
  }
  return "";
};

export const parseAgeLower = (label: string) => {
  const m = label.match(/^(\d+)(?:\s*-\s*\d+)?\s*[Yy]$/);
  return m ? Number(m[1]) : Number.POSITIVE_INFINITY;
};

export const sizeToValue = (variant: {
  size?: string;
  size_rel?: { sort_order?: number; label: string };
}) => {
  const sizeRel = (variant as any).size_rel || (variant as any).sizeObj;
  if (sizeRel?.sort_order != null) return sizeRel.sort_order;

  const label = sizeRel?.label ?? variant.size ?? "";
  const L = normalizeSize(label);

  const idx = sizes.indexOf(L);
  if (idx >= 0) return idx;

  const age = parseAgeLower(L);
  if (Number.isFinite(age)) return 100 + age;

  const n = Number(L);
  if (Number.isFinite(n)) return 200 + n;

  return 9999;
};

import type { UploadedImage } from "@/types/image";
import { Reviews } from "@/types/review";

export const SPINNER_SVG =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100px%22%20height%3D%22100px%22%20viewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22xMidYMid%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M24.3%2C30C11.4%2C30%2C5%2C43.3%2C5%2C50s6.4%2C20%2C19.3%2C20c19.3%2C0%2C32.1-40%2C51.4-40%20C88.6%2C30%2C95%2C43.3%2C95%2C50s-6.4%2C20-19.3%2C20C56.4%2C70%2C43.6%2C30%2C24.3%2C30z%22%20stroke%3D%22%2317184e%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%22205.271142578125%2051.317785644531256%22%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20calcMode%3D%22linear%22%20values%3D%220%3B256.58892822265625%22%20keyTimes%3D%220%3B1%22%20dur%3D%221%22%20begin%3D%220s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fpath%3E%3C%2Fsvg%3E";

export function getBestImageFormat(img: UploadedImage) {
  const fmt = img.formats || {};
  return (
    img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small ?? fmt.thumbnail
  );
}

export function calculateAverageRating(reviews: Pick<Reviews, "rating">[]) {
  const total = reviews.length;
  if (!total) return { average: 0, total };

  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  const average = sum / total;

  return { average: Number(average.toFixed(2)), total };
}

// export function extractRatings(product: any): number[] {
//   // Supports either reviews: Review[] or reviews: { data: [{ attributes: { rating } }] }
//   if (!product?.reviews) return [];
//   const rel = (product.reviews as any).data;
//   if (Array.isArray(rel)) {
//     return rel
//       .map((r: any) => r?.attributes?.rating)
//       .filter((n: any) => Number.isFinite(n));
//   }
//   if (Array.isArray(product.reviews)) {
//     return product.reviews
//       .map((r: any) => r?.rating)
//       .filter((n: any) => Number.isFinite(n));
//   }
//   return [];
// }
