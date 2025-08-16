"use client";

import { normalizeSize } from "@/lib/utils";
import type { ProductVariant } from "@/types/variant";

/**
  Expect variants already filtered to the selected color
  and (ideally) already sorted in parent (but it works either way).
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
  // Normalize size label safely for any shape
  const getLabel = (v: ProductVariant): string => {
    const raw =
      (typeof (v as any).size === "object" && (v as any).size?.label) ||
      (typeof (v as any).size === "string" && (v as any).size) ||
      "";
    return typeof raw === "string" ? raw : "";
  };

  // For the key and title we need stable uppercase string
  const getUpper = (v: ProductVariant): string => normalizeSize(v.size);

  // Optional: de-duplicate by label and prefer in-stock for each label
  const uniqueByLabel = (() => {
    const map = new Map<string, ProductVariant>();
    for (const v of variants) {
      const key = getUpper(v);
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

  // Only render when we actually have more than one option
  if (uniqueByLabel.length <= 0) {
    console.log(variants)
    return null;
  }

  return (
    <>
      <small className="uppercase text-xs font-semibold">Size</small>
      {/* <code>{JSON.stringify(variants)}</code> */}
      <div className="flex flex-wrap gap-2 mt-1 mb-6">
        {uniqueByLabel.map((v) => {
          const qty = Number((v as any).inventory?.quantity ?? 0);
          const outOfStock = qty <= 0;
          const isActive = (v as any).documentId === selectedId;

          const labelUpper = getUpper(v);
          const labelRaw = getLabel(v);

          const base =
            "px-3 py-1 min-w-[60px] h-10 text-center flex items-center justify-center border rounded transition";
          const cls = isActive
            ? "bg-black text-white border-black"
            : outOfStock
            ? "line-through cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100";
          const pointer = labelUpper === "STANDARD" ? "" : "cursor-pointer ";

          return (
            <button
              key={labelUpper}
              type="button"
              onClick={() =>
                !outOfStock && onSelect((v as any).documentId as string)
              }
              // disabled={outOfStock}
              className={`${base} ${pointer} ${cls}`}
              aria-disabled={outOfStock}
              aria-pressed={isActive}
              title={outOfStock ? `${labelRaw} (Out of stock)` : labelRaw}
            >
              {labelUpper || "—"}
            </button>
          );
        })}
      </div>
    </>
  );
}
