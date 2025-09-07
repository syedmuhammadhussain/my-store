"use client";

import { useEffect } from "react";
import { useCartStore } from "@/stores/useCartStore";

export function CartHydration() {
  const hydrate = useCartStore.persist?.rehydrate;

  useEffect(() => {
    hydrate?.();
  }, [hydrate]);

  return null;
}
