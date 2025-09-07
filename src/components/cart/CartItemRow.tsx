"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";

/**
 * Presentational CartItemRow (motion-free)
 * - Memoized with a comparator so it re-renders only when important props change
 */

type CartItem = {
  variantId: number;
  slug: string;
  image: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
};

type Props = {
  item: CartItem;
  onOpenChange: (open: boolean) => void;
  onDec: (variantId: number, quantity: number) => void;
  onInc: (variantId: number, quantity: number) => void;
  onInput: (variantId: number, value: string) => void;
  onRemove: (variantId: number) => void;
};

function CartItemRow({ item, onOpenChange, onDec, onInc, onInput, onRemove }: Props) {
  return (
    <div className="flex gap-3 pb-4">
      <Link href={`/products/${item.slug}`} onClick={() => onOpenChange(false)}>
        <div className="relative w-22 h-24 flex-shrink-0 rounded overflow-hidden">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.slug}`} title={item.name} onClick={() => onOpenChange(false)}>
            <p className="font-semibold leading-tight line-clamp-1 mb-1">{item.name}</p>
          </Link>
          <p className="text-sm text-gray-800">Size: {item.size}</p>
        </div>

        <div className="flex items-center gap-3 mt-2">
          <div className="flex items-center border rounded">
            <button onClick={() => onDec(item.variantId, item.quantity)} className="p-1 cursor-pointer hover:text-gray-800 text-gray-500">
              <Minus className="w-3 h-3" strokeWidth={3} />
            </button>
            <input
              type="text"
              min={1}
              value={item.quantity}
              onChange={(e) => onInput(item.variantId, e.target.value)}
              className="w-10 border-l border-r px-2 py-1 text-sm text-center"
            />
            <button onClick={() => onInc(item.variantId, item.quantity)} className="p-1 cursor-pointer hover:text-gray-800 text-gray-500">
              <Plus className="w-3 h-3" strokeWidth={3} />
            </button>
          </div>

          <button onClick={() => onRemove(item.variantId)} className="flex items-center gap-1 text-xs text-gray-500 underline cursor-pointer">
            Remove
          </button>
        </div>
      </div>

      <div className="text-sm font-medium whitespace-nowrap text-gray-800">Rs.{item.price.toLocaleString()}</div>
    </div>
  );
}

/**
 * propsAreEqual comparator:
 * - Avoid re-render when `item` reference changes but relevant fields didn't
 * - Re-render when quantity, price, or identity changes
 * - Also ensure callbacks are the same (they are stable via useCallback in parent)
 */
function propsAreEqual(prev: Props, next: Props) {
  return (
    prev.item.variantId === next.item.variantId &&
    prev.item.quantity === next.item.quantity &&
    prev.item.price === next.item.price &&
    prev.item.size === next.item.size &&
    prev.item.name === next.item.name &&
    prev.item.image === next.item.image &&
    prev.onDec === next.onDec &&
    prev.onInc === next.onInc &&
    prev.onInput === next.onInput &&
    prev.onRemove === next.onRemove &&
    prev.onOpenChange === next.onOpenChange
  );
}

export default React.memo(CartItemRow, propsAreEqual);
