"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import qs from "qs";
import ProductCard from "../ProductCard";
import type { ProductAttributes } from "@/types/product";
import PageLoader from "@/components/products/PageLoader";
import EmptyProductState from "./EmptyProductState";

type Filters = {
  price: [number, number];
  sizes: string[];
  inStock: boolean;
  outOfStock: boolean;
};

const DEFAULT_FILTERS: Filters = {
  price: [0, 30000],
  sizes: [],
  inStock: false,
  outOfStock: false,
};

export default function ProductGridClient({
  category,
  page,
}: {
  category: string; // slug (either category slug or subcategory slug depending on `page`)
  page: "category" | "subcategory" | string;
}) {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<ProductAttributes[]>([]);
  const [loading, setLoading] = useState(false);
  const gridRef = useRef<HTMLDivElement | null>(null);

  // refs for debounce / abort / one-time scroll
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<number | null>(null);
  const filteredOnceRef = useRef<boolean>(false);

  // 1) Parse filters + sort + isDefault from URL (stable due to useMemo)
  const { filters, sort, isDefault } = useMemo(() => {
    const has = (k: string) => searchParams.has(k);
    const sizesRaw = searchParams.get("sizes") || "";
    const sizes = sizesRaw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const min = Number(searchParams.get("min") ?? DEFAULT_FILTERS.price[0]);
    const max = Number(searchParams.get("max") ?? DEFAULT_FILTERS.price[1]);
    const priceMin = Number.isFinite(min) ? min : DEFAULT_FILTERS.price[0];
    const priceMax = Number.isFinite(max) ? max : DEFAULT_FILTERS.price[1];
    const normalized: [number, number] =
      priceMin <= priceMax ? [priceMin, priceMax] : [priceMax, priceMin];
    const inStock = has("inStock");
    const outOfStock = has("outOfStock");
    const sort = searchParams.get("sort") || "";

    const filters: Filters = {
      price: normalized,
      sizes,
      inStock,
      outOfStock,
    };

    const isDefault =
      !inStock &&
      !outOfStock &&
      sizes.length === 0 &&
      normalized[0] === DEFAULT_FILTERS.price[0] &&
      normalized[1] === DEFAULT_FILTERS.price[1] &&
      !sort;

    return { filters, sort, isDefault };
  }, [searchParams]);

  // if no filters are active, do not render client grid (SSR remains visible)
  if (isDefault) return null;

  // 2) Build variantFilters & queryObj (memoized so effect won't re-run unnecessarily)
  const variantFilters = useMemo(() => {
    const vf: Record<string, unknown> = {
      price: { $gte: filters.price[0], $lte: filters.price[1] },
    };

    if (filters.sizes.length > 0) {
      // Strapi expects comma separated values for $in when using qs with arrayFormat: 'comma'
      vf.size = { $in: filters.sizes };
    }

    if (filters.inStock && !filters.outOfStock) {
      vf.inventory = { inventory_status: { $eq: "In Stock" } };
    } else if (filters.outOfStock && !filters.inStock) {
      vf.inventory = { inventory_status: { $eq: "Out of Stock" } };
    }

    return vf;
  }, [filters]);

  const queryObj = useMemo(() => {
    const baseFilters =
      page === "subcategory"
        ? {
            sub_category: { slug: { $eq: category } },
            product_colors: { variants: variantFilters },
          }
        : {
            sub_category: { category: { slug: { $eq: category } } },
            product_colors: { variants: variantFilters },
          };

    const obj: any = {
      filters: baseFilters,
      populate: [
        "images",
        "gallery",
        "product_colors.variants",
        "product_colors.variants.inventory",
      ],
      pagination: { pageSize: 100 },
    };

    if (sort) obj.sort = [sort];
    return obj;
  }, [category, page, variantFilters, sort]);

  // 3) Core effect: debounce, fetch, abort, scroll once
  useEffect(() => {
  // If no filters active, do nothing (SSR is visible)
  if (isDefault) return;

  // Immediately show loader so user knows something is happening
  setLoading(true);

  // Scroll to grid once (while loader visible) to avoid large layout jumps after data replaces content
  if (!filteredOnceRef.current && gridRef.current) {
    try {
      gridRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {
      /* ignore */
    }
    filteredOnceRef.current = true;
  }

  // debounce + fetch
  if (debounceRef.current) {
    window.clearTimeout(debounceRef.current);
  }

  debounceRef.current = window.setTimeout(() => {
    // abort previous
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      const minLoadingMs = 250; // keep loader visible at least this long to avoid flicker
      const startedAt = performance.now();

      const q = qs.stringify(queryObj, {
        encodeValuesOnly: true,
        arrayFormat: "indices", // or "comma" depending on your Strapi expectations
      });

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?${q}`, {
          signal: controller.signal,
          cache: "no-store",
        });
        if (!res.ok) {
          // non-OK -> show empty results (or you can set an error state)
          // eslint-disable-next-line no-console
          console.warn("Product fetch failed:", res.status, res.statusText);
          setItems([]);
          return;
        }
        const json = await res.json();
        setItems(json.data ?? []);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          // eslint-disable-next-line no-console
          console.error("Product fetch error:", err);
          setItems([]);
        }
      } finally {
        // ensure minimum loader duration
        const elapsed = performance.now() - startedAt;
        const remaining = Math.max(0, minLoadingMs - elapsed);
        setTimeout(() => {
          // only hide loader if this is still the active fetch (not aborted)
          // abortRef may be non-null for new requests; but we still can hide
          setLoading(false);
        }, remaining);
      }
    })();
  }, 150); // debounce time

  return () => {
    // cleanup debounce
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    // abort inflight fetch
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  };
  // depend on queryObj only; queryObj already reflects filters/sort/page/category
}, [queryObj]);

  return (
    <div id="csr-product-grid">
      <PageLoader active={loading} />
      <div ref={gridRef} />
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 min-h-[200px]">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            src={(p.images && p.images[0]?.formats?.small?.url) || ""}
            secSrc={
              (p.gallery && p.gallery[0]?.formats?.small?.url) ||
              (p.images && p.images[0]?.formats?.small?.url) ||
              ""
            }
            title={p.name}
            price={(p.variants && p.variants[0]?.price) || 0}
            href={p.slug}
            rating={3}
          />
        ))}

        {!loading && items.length === 0 && (
          <div className="col-span-full text-sm text-gray-500">
            <EmptyProductState />
          </div>
        )}
      </div>
    </div>
  );
}
