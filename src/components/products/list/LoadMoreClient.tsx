// components/products/list/LoadMoreClient.tsx
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import qs from "qs";
import CategoryProductCard from "@/components/products/CategoryProductCard";
import {
  calculateAverageRating,
  defaultPageSizeForProductList,
  getProductBadge,
} from "@/lib/utils";
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
    (ProductAttributes & {
      averageRating?: number;
      reviewsCount?: number;
      badge?: string | null;
    })[]
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
    debugger;
    if (!hasMore || loading) return;
    setLoading(true);
    const q = qs.stringify(
      {
        filters: {
          ...baseFilters,
        },
        populate: {
          fields: ["name", "slug", "price", "discount_price"],
          images: true,
          gallery: true,
          reviews: {
            fields: ["rating"],
            filters: {
              review_status: { $eq: "Published" },
            },
          },
          product_colors: {
            fields: ["id"],
            populate: {
              variants: {
                fields: ["id"],
                populate: {
                  inventory: { fields: ["quantity", "inventory_status"] },
                },
              },
            },
          },
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
        const { average, total } = calculateAverageRating(p.reviews || []);
        return {
          ...p,
          averageRating: average,
          reviewsCount: total,
          badge: getProductBadge(p),
        };
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
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {items.map((p) => (
          <CategoryProductCard
            key={p.id}
            id={p.id}
            src={p.gallery && p.gallery[0]?.formats?.small?.url}
            secSrc={p.images && p.images[0]?.formats?.small?.url}
            title={p.name}
            discount_price={p.discount_price}
            price={p.price || 0}
            href={p.slug}
            rating={p.averageRating ?? 0}
            badge={p.badge ?? ""}
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
