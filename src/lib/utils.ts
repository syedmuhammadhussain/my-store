import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const defaultPageSizeForProductList = 20

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
  if (typeof s === "object" && s && "label" in s && typeof (s as any).label === "string") {
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

export function getBestImageFormat(img: UploadedImage) {
  const fmt = img.formats || {};
  return img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small ?? fmt.thumbnail;
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