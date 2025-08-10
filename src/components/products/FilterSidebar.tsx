"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { SlidersHorizontal, X } from "lucide-react";

type FilterState = {
  inStock: boolean;
  outOfStock: boolean;
  price: [number, number];
  sizes: string[];
};

interface FilterSidebarProps {
  initialCount: number;
  category: string;
}

/** Parse from URLSearchParams -> FilterState */
function parseFiltersFromSearch(params: URLSearchParams): FilterState {
  const inStock = params.has("inStock");
  const outOfStock = params.has("outOfStock");
  const sizes = params.get("sizes")
    ? params.get("sizes")!.split(",").filter(Boolean)
    : [];
  const min = params.get("min") ? Number(params.get("min")) : 0;
  const max = params.get("max") ? Number(params.get("max")) : 30000;
  return {
    inStock,
    outOfStock,
    sizes,
    price: [min, max],
  };
}

/** Serialize FilterState -> querystring (only non-defaults) */
function serializeFiltersToParams(filters: FilterState) {
  const params = new URLSearchParams();
  if (filters.inStock) params.set("inStock", "1");
  if (filters.outOfStock) params.set("outOfStock", "1");
  if (filters.sizes.length) params.set("sizes", filters.sizes.join(","));
  if (filters.price[0] !== 0) params.set("min", String(filters.price[0]));
  if (filters.price[1] !== 30000) params.set("max", String(filters.price[1]));
  return params.toString();
}

export default function FilterSidebar({}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize from URL on mount (so deep-link/back works)
  const initialFiltersFromUrl =
    typeof searchParams?.toString === "function"
      ? parseFiltersFromSearch(new URLSearchParams(searchParams.toString()))
      : undefined;

  const [filters, setFilters] = useState<FilterState>(
    initialFiltersFromUrl ?? {
      inStock: false,
      outOfStock: false,
      price: [0, 30000],
      sizes: [],
    }
  );

  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  // updateFilters no longer triggers navigation. It only updates local state.
  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => {
      const next: FilterState = { ...prev, ...updates };
      if (updates.sizes) {
        next.sizes = Array.from(new Set(next.sizes));
      }
      return next;
    });
  }, []);

  // Remove single filters helpers
  const removeSize = useCallback((sz: string) => {
    setFilters((f) => ({ ...f, sizes: f.sizes.filter((s) => s !== sz) }));
  }, []);

  const clearInStock = useCallback(
    () => setFilters((f) => ({ ...f, inStock: false })),
    []
  );
  const clearOutOfStock = useCallback(
    () => setFilters((f) => ({ ...f, outOfStock: false })),
    []
  );

  const clearAll = useCallback(() => {
    // reset local state
    setFilters({
      inStock: false,
      outOfStock: false,
      price: [0, 30000],
      sizes: [],
    });

    // remove querystring (navigate to pathname without params)
    startTransition(() => {
      router.replace(pathname);
    });
  }, [router, pathname, startTransition]);

  // Sync filters => URL in an effect (avoid doing router.replace while rendering)
  useEffect(() => {
    // build qs
    const qs = serializeFiltersToParams(filters);
    const url = qs ? `${pathname}?${qs}` : pathname;

    // debounce to prevent too many router.replace calls while user is typing/dragging
    const id = window.setTimeout(() => {
      // startTransition is safe inside effects
      startTransition(() => {
        router.replace(url);
      });
    }, 300);

    return () => {
      clearTimeout(id);
    };
  }, [filters, pathname, router, startTransition]);

  return (
    <>
      {/* Mobile toggle */}
      <div className="md:hidden flex justify-end mb-4">
        <Button
          variant="outline"
          onClick={() => setOpen(true)}
          className="bg-white border-0 px-4"
        >
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
          transform transition-transform duration-300 ${
            open ? "translate-x-0" : "-translate-x-full"
          }
          md:translate-x-0 md:static md:block`}
      >
        {/* <pre>{JSON.stringify({ isPending })}</pre> */}
        {/* Applied Filters */}
        {(filters.inStock ||
          filters.outOfStock ||
          filters.sizes.length > 0) && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Applied Filters</h3>
              <button
                type="button"
                onClick={clearAll}
                className="cursor-pointer text-sm text-gray-800 hover:text-gray-700 px-2 py-1"
                aria-label="Clear all filters"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              {filters.inStock && (
                <span className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                  <span>In Stock</span>
                  <button
                    aria-label="Remove in stock filter"
                    type="button"
                    onClick={clearInStock}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.outOfStock && (
                <span className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500">
                  <span>Out of Stock</span>
                  <button
                    aria-label="Remove out of stock filter"
                    type="button"
                    onClick={clearOutOfStock}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filters.sizes.map((sz) => (
                <span
                  key={sz}
                  className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800/30 dark:text-blue-500"
                >
                  <span>{sz}</span>
                  <button
                    aria-label={`Remove size ${sz}`}
                    type="button"
                    onClick={() => removeSize(sz)}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2 dark:border-gray-900"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

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
          <Slider
            value={filters?.price ?? [0, 30000]}
            onValueChange={(val) => updateFilters({ price: [val[0], val[1]] })}
            min={0}
            max={30000}
            step={1}
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
      </aside>
    </>
  );
}
