// components/products/list/LoadMoreClient.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import qs from "qs";
import ProductCard from "@/components/products/ProductCard";
import { calculateAverageRating, defaultPageSizeForProductList } from "@/lib/utils";
import type { ProductAttributes } from "@/types/product";

export default function LoadMoreClient({
  category,
  page,
  pageSize = defaultPageSizeForProductList,
}: {
  category: string;
  page: "category" | "subcategory" | string;
  pageSize?: number;
}) {
  const [items, setItems] = useState<
    (ProductAttributes & { averageRating?: number })[]
  >([]);
  const [pageNum, setPageNum] = useState(2); // SSR already rendered page 1
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const baseFilters =
    page === "subcategory"
      ? { sub_category: { slug: { $eq: category } } }
      : { sub_category: { category: { slug: { $eq: category } } } };

  const fetchPage = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const q = qs.stringify(
      {
        filters: {
          ...baseFilters,
        },
        populate: {
          images: { populate: "*" },
          gallery: { populate: "*" },
          reviews: { fields: ["rating"] },
        },
        pagination: { page: pageNum, pageSize },
      },
      { encodeValuesOnly: true }
    );

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?${q}`,
        { cache: "no-store" }
      );
      if (!res.ok) {
        setHasMore(false);
        return;
      }
      const json = await res.json();
      const data: ProductAttributes[] = json?.data ?? [];
      const mapped = data.map((p) => {
        const { average } = calculateAverageRating(p.reviews || []);
        return { ...p, averageRating: average };
      });
      setItems((prev) => [...prev, ...mapped]);

      const meta = json?.meta?.pagination;
      if (meta && pageNum >= meta.pageCount) {
        setHasMore(false);
      } else {
        setPageNum((n) => n + 1);
      }
    } finally {
      setLoading(false);
    }
  }, [baseFilters, hasMore, loading, pageNum, pageSize]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        if (e.isIntersecting) fetchPage();
      },
      { rootMargin: "600px 0px" } // prefetch ahead of time
    );

    io.observe(el);
    return () => io.disconnect();
  }, [fetchPage]);

  if (!hasMore && items.length === 0) return null;

  return (
    <div id="load-more-grid" className="mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {items.map((p) => (
          <ProductCard
            key={p.id}
            id={p.id}
            src={p.gallery && p.gallery[0]?.formats?.small?.url}
            secSrc={p.images && p.images[0]?.formats?.small?.url}
            title={p.name}
            discount_price={(p as any).discount_price}
            price={p.price || 0}
            href={p.slug}
            rating={p.averageRating ?? 0}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={sentinelRef}
          className="h-12 flex items-center justify-center text-sm text-gray-500"
        >
          {loading ? "Loading more..." : "Scroll to load more"}
        </div>
      )}
    </div>
  );
}
