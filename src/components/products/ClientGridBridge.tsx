// components/products/ClientGridBridge.tsx
"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ProductGridClient from "./list/ProductGridClient";
import LoadMoreClient from "./list/LoadMoreClient";
import { defaultPageSizeForProductList } from "@/lib/utils";

export default function ClientGridBridge({
  category,
  page,
  pageSize = defaultPageSizeForProductList,
}: {
  category: string;
  page: string;
  pageSize?: number;
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

  // If filtered -> render CSR filtered grid (replaces SSR via CSS)
  if (isFiltered) {
    return <ProductGridClient category={category} page={page} />;
  }

  // If not filtered -> keep SSR first fold and progressively load more below
  return <LoadMoreClient category={category} page={page} pageSize={pageSize} />;
}
