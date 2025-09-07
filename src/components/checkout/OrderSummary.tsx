"use client";

import { memo, useMemo } from "react";
import { motion } from "framer-motion";
import { fadeItem } from "@/types/checkout";
import { useCartStore } from "@/stores/useCartStore";
import { useWatch } from "react-hook-form";
// import type { CheckoutFormValues } from "@/types/checkout";
import AvatarWithBadge from "./AvatarWithBadge";

type Props = {
  control: any; // RHF control to watch shippingMethod
};

function OrderSummaryBase({ control }: Props) {
  const items = useCartStore((s) => s.items);
  const shippingMethod = useWatch({ control, name: "shippingMethod" });

  const { subtotal, shippingCost, total } = useMemo(() => {
    const sub = items.reduce((s, it) => s + it.quantity * it.price, 0);
    const ship = shippingMethod === "express" ? 499 : 0;
    return { subtotal: sub, shippingCost: ship, total: sub + ship };
  }, [items, shippingMethod]);

  return (
    <motion.aside
      variants={fadeItem}
      className="bg-white border rounded-lg p-6 h-max"
    >
      <h2 className="text-lg font-medium mb-4">Order summary</h2>

      <div className="space-y-4">
        {items.map((it) => (
          <div key={it.variantId} className="flex items-center justify-between">
            <AvatarWithBadge src={it.image} alt={it.name} count={it.quantity} className="border rounded" />
            <div className="w-full flex text-sm ml-1">
              <div className="flex-1 mr-2">
                <span className="block text-base font-medium mb-1">
                  {it.name}
                </span>
                <span className="block text-sm text-gray-800">{it.size}</span>
              </div>
              <span className="mt-1">
                Rs. {(it.price * it.quantity).toFixed(2).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="my-4 h-px bg-gray-200" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>Rs. {subtotal.toFixed(2).toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>
            {shippingCost ? `Rs. ${shippingCost.toLocaleString()}` : "Free"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Taxes</span>
          <span>Calculated at checkout</span>
        </div>
      </div>

      <div className="my-4 h-px bg-gray-200" />

      <div className="flex justify-between text-base font-medium">
        <span>Total</span>
        <span>Rs. {total.toFixed(2).toLocaleString()} PKR</span>
      </div>
    </motion.aside>
  );
}

export default memo(OrderSummaryBase);
