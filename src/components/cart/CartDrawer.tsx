"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  Variants,
} from "framer-motion";
import { X } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import CartItemRow from "./CartItemRow";
import { freeShippingThreshold } from "@/lib/utils";

/**
 * CartDrawer
 * - Controls drawer open/close
 * - Starts staggered list animation a short time after drawer opens
 * - Wraps each row in a motion.li so rows can animate in/out independently
 */

type CartDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const makeContainerVariants = (delayChildren = 0.25): Variants => ({
  hidden: {},
  visible: {
    transition: {
      delayChildren,
      staggerChildren: 0.12,
    },
  },
});

// Reusable fade/slide variant
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.09, duration: 0.35, ease: "easeOut" },
  }),
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 18, scale: 0.995 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 600, damping: 28 },
  },
  exit: { opacity: 0, y: -12, scale: 0.995, transition: { duration: 0.18 } },
};

export default function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();

  // Derived
  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items]
  );
  const progress = useMemo(
    () => Math.min((subtotal / freeShippingThreshold) * 100, 100),
    [subtotal]
  );
  const remaining = useMemo(
    () => Math.max(freeShippingThreshold - subtotal, 0),
    [subtotal]
  );

  // Respect prefers-reduced-motion
  const shouldReduceMotion = useReducedMotion();

  // Delay before starting list animation to let drawer finish slide-in
  const drawerSlideMs = 220; // tweak to match your drawer CSS/transitions
  const [itemsReady, setItemsReady] = useState(false);

  useEffect(() => {
    if (open) {
      setItemsReady(false); // reset
      const t = setTimeout(() => setItemsReady(true), drawerSlideMs);
      return () => clearTimeout(t);
    }
    // closing: hide list immediately (AnimatePresence still runs exit)
    setItemsReady(false);
  }, [open]);

  // Stable callbacks (useCallback) so memoized rows don't re-render from changing handlers
  const handleDec = useCallback(
    (variantId: number, quantity: number) =>
      updateQuantity(variantId, Math.max(1, quantity - 1)),
    [updateQuantity]
  );
  const handleInc = useCallback(
    (variantId: number, quantity: number) =>
      updateQuantity(variantId, quantity + 1),
    [updateQuantity]
  );
  const handleInput = useCallback(
    (variantId: number, value: string) => {
      const next = Math.max(1, Number(value.replace(/\D/g, "")) || 1);
      updateQuantity(variantId, next);
    },
    [updateQuantity]
  );
  const handleRemove = useCallback(
    (variantId: number) => removeItem(variantId),
    [removeItem]
  );

  const containerVariants = useMemo(
    () => makeContainerVariants(shouldReduceMotion ? 0 : drawerSlideMs / 1000),
    [drawerSlideMs, shouldReduceMotion]
  );

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="fixed right-0 top-0 h-full w-full md:max-w-lg bg-white shadow-lg flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {/* Header */}
          <DrawerHeader className="px-5 py-4 pb-2 flex justify-between flex-row">
            <DrawerTitle className="flex items-center gap-2">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                custom={0}
                className="w-full"
              >
                <motion.div variants={fadeUp} custom={0}>
                  <div className="text-lg font-bold">Cart</div>
                </motion.div>

                <motion.div variants={fadeUp} custom={1}>
                  <p className="text-xs align-middle">
                    ({items.length} {items.length === 1 ? "item" : "items"})
                  </p>
                </motion.div>
              </motion.div>
            </DrawerTitle>

            <DrawerClose asChild>
              <Button
                variant="default"
                className="size-6 rounded text-black shadow-none bg-transparent hover:bg-gray-100"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </Button>
            </DrawerClose>
          </DrawerHeader>

          {/* Free shipping bar */}
          {items.length ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              custom={2}
              className="px-5 py-3 text-sm "
            >
              <motion.div variants={fadeUp} custom={2}>
                {remaining > 0 ? (
                  <p>
                    Spend {remaining.toLocaleString()} more and enjoy free
                    shipping.
                  </p>
                ) : (
                  <p className="text-black font-medium">
                    You’ve unlocked free shipping!
                  </p>
                )}
              </motion.div>
              <motion.div variants={fadeUp} custom={3}>
                <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-black"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.45 }}
                  />
                </div>
              </motion.div>
            </motion.div>
          ) : null}

          {/* Items list */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            <AnimatePresence mode="wait">
              {items.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="text-center text-gray-800 mt-5 text-lg"
                >
                  <motion.div variants={fadeUp} custom={1}>
                    <p>Your cart is empty.</p>
                  </motion.div>
                  <motion.div variants={fadeUp} custom={2}>
                    <div className="mt-4 flex">
                      <Link
                        href="/"
                        className="w-full text-base bg-black text-white p-2 text-center rounded hover:scale-[1.02] transition-transform"
                        onClick={() => onOpenChange(false)}
                      >
                        HOME
                      </Link>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.ul
                  key={`cart-list`}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 4 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col gap-5"
                >
                  <AnimatePresence>
                    {items.map((item, index) => (
                      <motion.li
                        key={item.variantId}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                        custom={4 * 1 + index}
                      >
                        <CartItemRow
                          item={item}
                          onOpenChange={onOpenChange}
                          onDec={handleDec}
                          onInc={handleInc}
                          onInput={handleInput}
                          onRemove={handleRemove}
                        />
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Accordions */}
        <AnimatePresence mode="wait">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            {items.length > 0 && (
              <motion.div variants={fadeUp} custom={8}>
                <div className="px-5 py-2 bg-white relative">
                  <div className="pointer-events-none absolute -top-6 left-0 w-full h-8 bg-gradient-to-t from-white via-white/80 to-transparent"></div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="notes" className="border-0">
                      <AccordionTrigger className="text-sm font-medium p-0 cursor-pointer hover:no-underline">
                        Add Order Notes
                      </AccordionTrigger>
                      <AccordionContent className="mt-4">
                        <label className="font-xs text-gray-800">
                          Special instructions for seller
                        </label>
                        <textarea className="w-full border rounded p-4 mt-2 text-sm" />
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="gift" className="border-0">
                      <AccordionTrigger className="text-sm font-medium p-0 mt-4 cursor-pointer hover:no-underline">
                        Mark as a Gift
                      </AccordionTrigger>
                      <AccordionContent className="mt-4">
                        <label className="font-xs text-gray-800">
                          Add a note for recipient
                        </label>
                        <textarea className="w-full border rounded p-4 mt-2 text-sm" />
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </motion.div>
            )}

            {/* Checkout */}
            <motion.div variants={fadeUp} custom={9}>
              {items.length > 0 && (
                <motion.div
                  variants={fadeUp}
                  custom={5}
                  className="px-5 py-4 text-center"
                >
                  <Link href="/checkout" className="w-full" onClick={() => onOpenChange(false)}>
                    <Button className="w-full bg-black text-white h-10 rounded hover:scale-[1.02] transition-transform">
                      CHECKOUT • Rs.{subtotal.toLocaleString()} PKR
                    </Button>
                  </Link>
                  <p className="text-sm text-gray-800 mt-2">
                    Shipping & taxes calculated at checkout.
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
}
