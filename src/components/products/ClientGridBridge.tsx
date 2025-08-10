// components/products/ClientGridBridge.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGridClient from "./ProductGridClient";

export default function ClientGridBridge({
  category,
  page,
}: {
  category: string;
  page: string;
}) {
  const searchParams = useSearchParams();

  const sizes = searchParams.get("sizes")?.split(",").filter(Boolean) ?? [];
  const min = Number(searchParams.get("min") ?? 0);
  const max = Number(searchParams.get("max") ?? 30000);
  const sort = searchParams.get("sort") || "";
  const inStock = searchParams.has("inStock");
  const outOfStock = searchParams.has("outOfStock");

  const isFiltered =
    sizes.length > 0 ||
    inStock ||
    outOfStock ||
    !!sort ||
    min !== 0 ||
    max !== 30000;

  useEffect(() => {
    const wrapper = document.getElementById("grid-wrapper");
    if (!wrapper) return;
    if (isFiltered) wrapper.classList.add("has-csr");
    else wrapper.classList.remove("has-csr");
  }, [isFiltered]);

  if (!isFiltered) return null;

  return <ProductGridClient category={category} page={page} />;
}
