import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { UploadedImage } from "@/types/image";
import { Reviews } from "@/types/review";
import { ProductAttributes } from "@/types/product";
import { Inventory } from "@/types/inventory";

const MinDays = 14;
const MinViews = 300;
const MinSales = 50;
const MaxSales = 100;

export const freeShippingThreshold = 12000
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

export const SPINNER_SVG =
  "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22100px%22%20height%3D%22100px%22%20viewBox%3D%220%200%20100%20100%22%20preserveAspectRatio%3D%22xMidYMid%22%3E%3Cpath%20fill%3D%22none%22%20d%3D%22M24.3%2C30C11.4%2C30%2C5%2C43.3%2C5%2C50s6.4%2C20%2C19.3%2C20c19.3%2C0%2C32.1-40%2C51.4-40%20C88.6%2C30%2C95%2C43.3%2C95%2C50s-6.4%2C20-19.3%2C20C56.4%2C70%2C43.6%2C30%2C24.3%2C30z%22%20stroke%3D%22%2317184e%22%20stroke-width%3D%222%22%20stroke-dasharray%3D%22205.271142578125%2051.317785644531256%22%3E%3Canimate%20attributeName%3D%22stroke-dashoffset%22%20calcMode%3D%22linear%22%20values%3D%220%3B256.58892822265625%22%20keyTimes%3D%220%3B1%22%20dur%3D%221%22%20begin%3D%220s%22%20repeatCount%3D%22indefinite%22%2F%3E%3C%2Fpath%3E%3C%2Fsvg%3E";

export const USER_ICON_SVG =
  "data:image/svg+xml,%3C%3Fxml%20version%3D%221.0%22%20encoding%3D%22UTF-8%22%3F%3E%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20width%3D%2225px%22%20height%3D%2225px%22%20viewBox%3D%220%200%2025%2025%22%20version%3D%221.1%22%3E%3Cg%20id%3D%22surface1%22%3E%3Cpath%20style%3D%22%20stroke%3Anone%3Bfill-rule%3Anonzero%3Bfill%3Argb(0%25%2C0%25%2C0%25)%3Bfill-opacity%3A1%3B%22%20d%3D%22M%2021.296875%2021.316406%20C%2021.101562%2017.566406%2020.097656%2015.066406%2018.839844%2013.453125%20L%2018.839844%2018.058594%20L%2017.082031%2018.058594%20L%2017.871094%2019.894531%20L%2014.453125%2024.863281%20C%2016.074219%2024.648438%2017.34375%2024.128906%2018.078125%2023.324219%20C%2018.078125%2023.324219%2019.765625%2023.234375%2019.796875%2023.234375%20C%2020.679688%2023.175781%2021.347656%2022.316406%2021.296875%2021.316406%20Z%20M%2021.296875%2021.316406%20%22%2F%3E%3Cpath%20style%3D%22%20stroke%3Anone%3Bfill-rule%3Anonzero%3Bfill%3Argb(0%25%2C0%25%2C0%25)%3Bfill-opacity%3A1%3B%22%20d%3D%22M%207.917969%2018.058594%20L%206.160156%2018.058594%20L%206.160156%2013.453125%20C%204.90625%2015.066406%203.898438%2017.566406%203.703125%2021.316406%20C%203.652344%2022.316406%204.320312%2023.175781%205.203125%2023.234375%20C%205.234375%2023.234375%206.925781%2023.320312%206.925781%2023.320312%20C%207.675781%2024.171875%208.988281%2024.652344%2010.550781%2024.859375%20L%207.132812%2019.894531%20Z%20M%207.917969%2018.058594%20%22%2F%3E%3Cpath%20style%3D%22%20stroke%3Anone%3Bfill-rule%3Anonzero%3Bfill%3Argb(0%25%2C0%25%2C0%25)%3Bfill-opacity%3A1%3B%22%20d%3D%22M%2015.847656%2017.277344%20L%2018.039062%2017.277344%20L%2018.039062%2012.589844%20C%2017.621094%2012.214844%2017.238281%2011.910156%2016.839844%2011.667969%20C%2016.835938%2011.667969%2012.46875%2022.4375%2012.46875%2022.4375%20L%208.132812%2011.648438%20C%207.71875%2011.890625%207.308594%2012.203125%206.890625%2012.589844%20L%206.890625%2017.277344%20L%209.085938%2017.277344%20L%207.996094%2019.820312%20L%2011.542969%2024.972656%20C%2011.855469%2024.992188%2012.175781%2025%2012.503906%2025%20C%2012.808594%2025%2013.101562%2024.992188%2013.390625%2024.976562%20L%2016.933594%2019.820312%20Z%20M%2015.847656%2017.277344%20%22%2F%3E%3Cpath%20style%3D%22%20stroke%3Anone%3Bfill-rule%3Anonzero%3Bfill%3Argb(0%25%2C0%25%2C0%25)%3Bfill-opacity%3A1%3B%22%20d%3D%22M%207.765625%209.328125%20C%208.660156%2011.636719%2010.339844%2013.15625%2012.5%2013.15625%20C%2014.566406%2013.15625%2016.355469%2011.695312%2017.238281%209.328125%20C%2018.164062%209.242188%2018.648438%208.34375%2018.832031%207.289062%20C%2019.046875%206.027344%2018.59375%205.414062%2017.796875%205.273438%20C%2017.523438%202.3125%2016.671875%200%2012.5%200%20C%208.304688%200%207.476562%202.3125%207.207031%205.273438%20C%206.40625%205.414062%205.953125%206.027344%206.171875%207.289062%20C%206.351562%208.359375%206.855469%209.246094%207.765625%209.328125%20Z%20M%2013.476562%204.449219%20C%2013.738281%204.976562%2014.488281%206.003906%2016.445312%206.464844%20C%2016.257812%209.503906%2014.65625%2011.65625%2012.5%2011.65625%20C%2010.46875%2011.65625%209.046875%209.785156%208.644531%207.207031%20C%2011.421875%207.015625%2013.203125%204.8125%2013.476562%204.449219%20Z%20M%2013.476562%204.449219%20%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E";

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

const BADGE_PRIORITY = [
  "Out of Stock",
  "Low Stock",
  "Hot Selling",
  "Best Seller",
  "New Arrival",
  "Discount",
  "Back in Stock",
  "Featured",
] as const;

export type BadgeLabel = (typeof BADGE_PRIORITY)[number];

export function getBadgeColor(label: BadgeLabel): string {
  const base = "px-2 py-0.5 text-xs font-semibold rounded";
  const map: Record<BadgeLabel, string> = {
    "Out of Stock": `${base} bg-gray-200 text-gray-700`,
    "Low Stock": `${base} bg-amber-100 text-amber-700`,
    "Hot Selling": `${base} bg-orange-100 text-orange-700`,
    "Best Seller": `${base} bg-yellow-100 text-yellow-800`,
    "New Arrival": `${base} bg-emerald-100 text-emerald-700`,
    Discount: `${base} bg-rose-100 text-rose-700`,
    "Back in Stock": `${base} bg-green-100 text-green-700`,
    Featured: `${base} bg-indigo-100 text-indigo-700`,
  };
  return map[label];
}

function aggregateInventory(product: ProductAttributes) {
  const colors = product.product_colors ?? [];
  const variants = colors.flatMap((c) => c.variants ?? []);
  const inventories = variants
    .map((v) => v.inventory)
    .filter(Boolean) as Inventory[];

  let totalQty = 0;
  let totalAvailable = 0;
  let anyLowStock = false;
  let allOutOfStock = inventories.length > 0; // will be falsified if any is not OOS
  let minThreshold = Infinity;
  let restockedRecently = false;

  const now = Date.now();
  const RECENT_RESTOCK_DAYS = 7;

  for (const inv of inventories) {
    const q = Math.max(Number(inv.quantity ?? 0), 0);
    const reserved = Math.max(Number(inv.reserved_quantity ?? 0), 0);
    const available = Math.max(q - reserved, 0);
    const threshold = Number.isFinite(inv.low_stock_threshold)
      ? Number(inv.low_stock_threshold)
      : 5;

    totalQty += q;
    totalAvailable += available;
    minThreshold = Math.min(minThreshold, threshold);

    const status = inv.inventory_status ?? "In Stock";
    if (status !== "Out of Stock") allOutOfStock = false;

    if (status === "Low Stock" || available <= threshold) {
      anyLowStock = true;
    }

    if (inv.restock_date && available > 0) {
      const since =
        (now - new Date(inv.restock_date).getTime()) / (1000 * 60 * 60 * 24);
      if (since >= 0 && since <= RECENT_RESTOCK_DAYS) restockedRecently = true;
    }
  }

  if (minThreshold === Infinity) minThreshold = 5;

  return {
    inventoriesCount: inventories.length,
    totalQty,
    totalAvailable,
    anyLowStock,
    allOutOfStock: inventories.length > 0 ? allOutOfStock : true, // if no inventory records, treat as OOS
    minThreshold,
    restockedRecently,
  };
}

export function getAllBadges(product: ProductAttributes): BadgeLabel[] {
  const { totalAvailable, anyLowStock, allOutOfStock, restockedRecently } =
    aggregateInventory(product);

  const badges: BadgeLabel[] = [];

  // Inventory-driven
  if (allOutOfStock || totalAvailable === 0) badges.push("Out of Stock");
  else if (anyLowStock) badges.push("Low Stock");

  // Performance-driven (tune thresholds to your baseline)
  const sales = Number(product.sales ?? 0);
  const views = Number(product.views ?? 0);
  if (sales >= 100) badges.push("Best Seller");
  if (sales >= 20 && views >= 300) badges.push("Hot Selling");

  // Lifecycle-driven
  const daysSinceCreated =
    (Date.now() - new Date(product.createdAt).getTime()) /
    (1000 * 60 * 60 * 24);
  if (daysSinceCreated <= 30) badges.push("New Arrival");

  // Commercial
  if (
    typeof product.discount_price === "number" &&
    typeof product.price === "number" &&
    product.discount_price < product.price
  ) {
    badges.push("Discount");
  }

  if (restockedRecently && totalAvailable > 0) badges.push("Back in Stock");

  if (product.is_feature) badges.push("Featured");

  // De-dup and keep order
  return badges.filter((b, i, arr) => arr.indexOf(b) === i);
}

export function getProductBadge(product: ProductAttributes): BadgeLabel | null {
  const badges = getAllBadges(product);
  if (badges.length === 0) return null;

  // Enforce priority
  for (const label of BADGE_PRIORITY) {
    if (badges.includes(label)) return label;
  }
  return null;
}

// export function getProductBadge(product: ProductAttributes): string | null {
//   const now = new Date();
//   const createdAt = new Date(product.createdAt);
//   const isNew = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= MinDays;

//   const allVariants = product.product_colors
//     ?.flatMap((color) => color.variants ?? [])
//     .filter(Boolean);

//   const allInventories = allVariants
//     ?.map((variant) => variant.inventory)
//     .filter(Boolean);

//   const allOutOfStock = allInventories.length > 0 &&
//     allInventories.every((inv) => inv.inventory_status === "Out of Stock");

//   const anyLowStock = allInventories.some(
//     (inv) =>
//       inv.inventory_status === "Low Stock" ||
//       inv.quantity <= inv.low_stock_threshold
//   );

//   const badgePriority = [
//     { label: "Out of Stock", condition: allOutOfStock },
//     { label: "Low Stock", condition: anyLowStock },
//     { label: "Hot Selling", condition: product.sales > MinSales && product.views > MinViews },
//     { label: "Best Seller", condition: product.sales > MaxSales },
//     { label: "New Arrival", condition: isNew },
//     {
//       label: "Discount",
//       condition:
//         typeof product.discount_price === "number" &&
//         product.discount_price < product.price,
//     },
//     { label: "Featured", condition: product.is_feature === true },
//   ];

//   const matched = badgePriority.find((b) => b.condition);
//   return matched?.label ?? null;
// }

// export function getListingBadge(product: ProductAttributes): string | null {
//   const now = new Date();
//   const createdAt = new Date(product.createdAt);
//   const isNew = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24) <= 14;

//   const inventories = product.product_colors
//     .map((color) => color.inventory)
//     .filter(Boolean); // skip nulls

//   const allOutOfStock = inventories.every(
//     (inv) => inv.inventory_status === "Out of Stock"
//   );

//   const anyLowStock = inventories.some(
//     (inv) =>
//       inv.inventory_status === "Low Stock" ||
//       inv.quantity <= inv.low_stock_threshold
//   );

//   const badgePriority = [
//     {
//       label: "Out of Stock",
//       condition: allOutOfStock,
//     },
//     {
//       label: "Low Stock",
//       condition: anyLowStock,
//     },
//     {
//       label: "Hot Selling",
//       condition: product.sales > 50 && product.views > 300,
//     },
//     {
//       label: "Best Seller",
//       condition: product.sales > 100,
//     },
//     {
//       label: "New Arrival",
//       condition: isNew,
//     },
//     {
//       label: "Discount",
//       condition:
//         typeof product.discount_price === "number" &&
//         product.discount_price < product.price,
//     },
//     {
//       label: "Featured",
//       condition: product.is_feature === true,
//     },
//   ];

//   const matched = badgePriority.find((b) => b.condition);
//   return matched?.label ?? null;
// }

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
