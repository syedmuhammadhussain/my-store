"use client";
import React, { useState, useTransition } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const ProductGridClient = dynamic(
  () => import("@/components/products/ProductGridClient"),
  { ssr: false, loading: () => <p>Loading products…</p> }
);

interface FilterSidebarProps {
  initialCount: number;
  category: string;
}

export default function FilterSidebar({
  initialCount,
  category,
}: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    inStock: false,
    outOfStock: false,
    price: [0, 30000],
    sizes: [] as string[],
  });
  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Partial<typeof filters>) {
    startTransition(() => setFilters((f) => ({ ...f, ...updates })));
  }

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-end mb-4">
        <Button variant="outline" onClick={() => setOpen(true)}>
          <SlidersHorizontal />
        </Button>
      </div>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed z-50 top-0 left-0 h-full bg-white md:bg-transparent w-full md:w-68 lg:w-80 p-4 overflow-auto
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block`}
      >
        {filters.inStock || filters.outOfStock || filters.sizes.length ? (
          <div className="mb-4">
            <h3 className="font-medium mb-2">Applied Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.inStock && (
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded">
                  In Stock
                </span>
              )}
              {filters.outOfStock && (
                <span className="px-2 py-1 bg-red-100 text-red-800 rounded">
                  Out of Stock
                </span>
              )}
              {filters.sizes.map((sz) => (
                <span
                  key={sz}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded"
                >
                  {sz}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {/* Header mobile */}
        <div className="flex items-center justify-between md:hidden mb-6">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button className="text-2xl" onClick={() => setOpen(false)}>
            &times;
          </button>
        </div>

        {/* Availability */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Availability</h3>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="stock"
              checked={filters.inStock}
              onChange={() =>
                updateFilters({ inStock: true, outOfStock: false })
              }
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <span>In Stock</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="radio"
              name="stock"
              checked={filters.outOfStock}
              onChange={() =>
                updateFilters({ inStock: false, outOfStock: true })
              }
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <span>Out of Stock</span>
          </label>
        </div>

        {/* Price Range */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex gap-3 mb-2">
            {/* Min */}
            <div className="flex-1 flex items-center border rounded overflow-hidden">
              <span className="text-sm px-4 h-9 flex items-center justify-center text-black-500">
                Rs:
              </span>
              <input
                type="number"
                min={0}
                value={filters.price[0]}
                onChange={(e) =>
                  updateFilters({ price: [+e.target.value, filters.price[1]] })
                }
                className="w-full px-4 py-1 h-9 text-sm focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            {/* Max */}
            <div className="flex-1 flex items-center border rounded overflow-hidden">
              <span className="text-sm px-4 h-9 flex items-center justify-center text-black-500">
                Rs:
              </span>
              <input
                type="number"
                value={filters.price[1]}
                max={30000}
                onChange={(e) =>
                  updateFilters({ price: [filters.price[0], +e.target.value] })
                }
                className="w-full px-4 py-1 text-sm focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="Max"
              />
            </div>
          </div>
          <input
            type="range"
            min={0}
            max={30000}
            value={filters.price[0]}
            onChange={(e) =>
              updateFilters({ price: [+e.target.value, filters.price[1]] })
            }
            className="w-full accent-black"
          />
        </div>

        {/* Sizes */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((sz) => (
              <button
                key={sz}
                onClick={() => {
                  const has = filters.sizes.includes(sz);
                  updateFilters({
                    sizes: has
                      ? filters.sizes.filter((s) => s !== sz)
                      : [...filters.sizes, sz],
                  });
                }}
                className={`cursor-pointer px-2 py-1 text-sm border rounded ${
                  filters.sizes.includes(sz)
                    ? "bg-black text-white border-black"
                    : "text-black border-gray-400"
                }`}
              >
                {sz}
              </button>
            ))}
          </div>
        </div>

        {/* Client‑side grid */}
        <div className="mt-8">
          <p className="mb-2">
            Showing {isPending ? "…" : initialCount} products
          </p>
          <ProductGridClient filters={filters} category={category} />
        </div>
      </aside>
    </>
  );
}
