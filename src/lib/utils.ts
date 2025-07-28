import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const sizes = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sizeToValue(size: string) {
  return sizes.indexOf(size.toUpperCase());
}
