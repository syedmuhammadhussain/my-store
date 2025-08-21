"use client";

import { normalizeSize } from "@/lib/utils";
import type { ProductVariant } from "@/types/variant";

/**
  Expect variants already filtered to the selected color
  Each variant has:
    - documentId
    - size?: { label?: string; sort_order?: number | null } | string
    - inventory?: { quantity?: number }
*/
export default function SizeSelector({
  selectedId,
  variants,
  onSelect,
}: {
  selectedId: string;
  variants: ProductVariant[];
  onSelect: (id: string) => void;
}) {
  // Safely read the label (object or string)
  const getLabel = (v: ProductVariant): string => {
    const raw =
      (typeof (v as any).size === "object" && (v as any).size?.label) ||
      (typeof (v as any).size === "string" && (v as any).size) ||
      "";
    return typeof raw === "string" ? raw : "";
  };

  // Use a stable normalized key for comparisons/deduping (case-insensitive)
  const getKey = (v: ProductVariant): string =>
    // prefer normalizeSize if it provides canonicalization (falls back to label)
    String(normalizeSize(v.size) || getLabel(v))
      .trim()
      .toLowerCase();

  // De-duplicate by normalized key and prefer in-stock variant for each label
  const uniqueByLabel = (() => {
    const map = new Map<string, ProductVariant>();
    for (const v of variants) {
      const key = getKey(v);
      if (!key) continue;
      const qty = Number((v as any).inventory?.quantity ?? 0);
      const current = map.get(key);
      if (!current) {
        map.set(key, v);
      } else {
        const curQty = Number((current as any).inventory?.quantity ?? 0);
        if (curQty <= 0 && qty > 0) map.set(key, v);
      }
    }
    return Array.from(map.values());
  })();

  if (uniqueByLabel.length <= 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <small className="text-xs font-medium">SIZE</small>
      <div className="flex flex-wrap gap-2 mt-1 mb-6">
        {uniqueByLabel.map((v) => {
          const qty = Number((v as any).inventory?.quantity ?? 0);
          const outOfStock = qty <= 0;
          const isActive = (v as any).documentId === selectedId;

          const labelRaw = getLabel(v);
          const labelKey = getKey(v);

          const base =
            "px-3 py-1 min-w-[60px] h-10 text-center flex items-center justify-center border rounded transition";
          const cls = isActive
            ? "bg-black text-white border-black"
            : outOfStock
            ? "line-through cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100";
          const pointer = labelKey === "standard" ? "" : "cursor-pointer ";

          return (
            <button
              key={(v as any).documentId ?? labelKey}
              type="button"
              onClick={() =>
                !outOfStock && onSelect((v as any).documentId as string)
              }
              className={`${base} ${pointer} ${cls}`}
              aria-disabled={outOfStock}
              aria-pressed={isActive}
              title={outOfStock ? `${labelRaw} (Out of stock)` : labelRaw}
            >
              {labelRaw || "—"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
