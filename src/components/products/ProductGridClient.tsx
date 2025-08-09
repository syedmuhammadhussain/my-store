import React, { useEffect, useState } from "react";
import qs from "qs";

import ProductCard from "../ProductCard";
import { ProductAttributes } from "@/types/product";

export default function ProductGridClient({
  filters,
  category,
}: {
  category: string;
  filters: {
    price: number[];
    sizes: string[];
    inStock: boolean;
    outOfStock: boolean;
  };
}) {
  const [items, setItems] = useState<ProductAttributes[]>([]);

  useEffect(() => {
    debugger;
    if (
      !filters.inStock &&
      !filters.outOfStock &&
      !filters.sizes.length &&
      filters.price[0] === 0 &&
      filters.price[1] === 30000
    ) {
      return;
    }

    // Build your variant‐level filters
    const variantFilters: Record<string, unknown> = {
      price: { $gte: filters.price[0], $lte: filters.price[1] },
    };

    // Only one size at a time
    if (filters.sizes.length) {
      variantFilters.size = { $eq: filters.sizes[0] };
    }

    // In Stock / Out of Stock
    if (filters.inStock) {
      variantFilters.inventory = { inventory_status: { $eq: "In Stock" } };
    } else if (filters.outOfStock) {
      variantFilters.inventory = { inventory_status: { $eq: "Out of Stock" } };
    }

    const q = qs.stringify(
      {
        filters: {
          sub_category: {
            category: { slug: { $eq: category } },
          },
          product_colors: {
            variants: variantFilters
          },
        },
        populate: ["images", "product_colors.variants", "product_colors.variants.inventory"],
        pagination: { pageSize: 100 },
      },
      { encodeValuesOnly: true }
    );

    fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/products?${q}`)
      .then((r) => r.json())
      .then((j) => setItems(j.data));
  }, [filters, category]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          src={(p.images && p.images[0]?.formats?.small?.url) || ""}
          secSrc={(p.images && p.images[0]?.formats?.small?.url) || ""}
          title={p.name}
          price={(p.variants && p.variants[0]?.price) || 0}
          href={p.slug}
          rating={3}
        />
      ))}
    </div>
  );
}
