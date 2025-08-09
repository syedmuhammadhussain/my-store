import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function sizeToValue(size: string) {
//   return sizes.indexOf(size.toUpperCase());
// }

export const normalizeSize = (s: string) => s?.trim().toUpperCase();

export const sizeToValue = (s: string) => {
  const S = normalizeSize(s);
  const i = sizes.indexOf(S);
  if (i >= 0) return i;
  // numeric fallback (e.g., "28", "30")
  const n = Number(S);
  return Number.isFinite(n) ? 100 + n : 999;
};
