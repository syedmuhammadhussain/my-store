"use client";

import { normalizeSize } from "@/lib/utils";

export default function SizeSelector({
  selectedId,
  variants,
  onSelect,
}: {
  selectedId: string;
  variants: {
    documentId: string;
    size: string;
    colorId: number;
    inventory?: { quantity?: number } | null;
  }[];
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <small className="uppercase text-sm">Size</small>
      <div className="flex flex-wrap gap-2 mt-1 mb-6">
        {variants.map((v) => {
          const qty = Number(v.inventory?.quantity ?? 0);
          const outOfStock = qty <= 0;
          const isActive = v.documentId === selectedId;
          // const isActive = v.size === selectedSize;

          const base =
            "cursor-pointer px-3 py-1 w-15 h-10 text-center flex items-center justify-center border rounded transition";
          const cls = isActive
            ? "bg-black text-white border-black"
            : outOfStock
            ? "line-through border-gray-200 cursor-not-allowed"
            : "border-gray-300 hover:bg-gray-100";

          return (
            <button
              key={`${v.colorId}-${normalizeSize(v.size)}`}
              type="button"
              // onClick={() => setSelectedSize(v.size)}
              onClick={() => !outOfStock && onSelect(v.documentId)}
              disabled={outOfStock}
              className={`${base} ${cls}`}
              aria-disabled={outOfStock}
              aria-pressed={isActive}
              title={outOfStock ? `${v.size} (Out of stock)` : v.size}
            >
              {normalizeSize(v.size)}
            </button>
          );
        })}
      </div>
    </>
  );
}
