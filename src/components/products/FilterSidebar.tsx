"use client";

import React, {
  useEffect,
  useState,
  useTransition,
  useCallback,
  useMemo,
} from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { SlidersHorizontal, X, Minus, Plus } from "lucide-react";

type FilterState = {
  inStock: boolean;
  outOfStock: boolean;
  price: [number, number];
  sizes: string[];
};

interface FilterSidebarProps {
  initialCount: number;
  category: string;
  sizeType: "alpha" | "age" | "none";
}

function parseFiltersFromSearch(params: URLSearchParams): FilterState {
  const inStock = params.has("inStock");
  const outOfStock = params.has("outOfStock");
  const sizes = params.get("sizes")
    ? params.get("sizes")!.split(",").filter(Boolean)
    : [];
  const min = params.get("min") ? Number(params.get("min")) : 0;
  const max = params.get("max") ? Number(params.get("max")) : 30000;
  return { inStock, outOfStock, sizes, price: [min, max] };
}

function serializeFiltersToParams(filters: FilterState) {
  const params = new URLSearchParams();
  if (filters.inStock) params.set("inStock", "1");
  if (filters.outOfStock) params.set("outOfStock", "1");
  if (filters.sizes.length) params.set("sizes", filters.sizes.join(","));
  if (filters.price[0] !== 0) params.set("min", String(filters.price[0]));
  if (filters.price[1] !== 30000) params.set("max", String(filters.price[1]));
  return params.toString();
}

// Canonical lists
const ALPHA_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "Standard"];
const AGE_SIZES = ["3-4 Year", "5-6 Year", "7-8 Year", "9-10 Year", "11-12 Year", "13-14 Year"];

export default function FilterSidebar({ sizeType }: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  // When size type changes (navigating between kids/men/women), reset sizes that don't belong
  useEffect(() => {
    const allowed = new Set(
      sizeType === "alpha"
        ? ALPHA_SIZES.map((s) => s.toUpperCase())
        : sizeType === "age"
        ? AGE_SIZES.map((s) => s.toUpperCase())
        : []
    );
    setFilters((prev) => {
      if (sizeType === "none") return { ...prev, sizes: [] };
      const nextSizes = prev.sizes.filter((s) => allowed.has(s.toUpperCase()));
      return nextSizes.length === prev.sizes.length
        ? prev
        : { ...prev, sizes: nextSizes };
    });
  }, [sizeType]);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    setFilters((prev) => {
      const next: FilterState = { ...prev, ...updates };
      if (updates.sizes) next.sizes = Array.from(new Set(next.sizes));
      return next;
    });
  }, []);

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
    setFilters({
      inStock: false,
      outOfStock: false,
      price: [0, 30000],
      sizes: [],
    });
    startTransition(() => {
      router.replace(pathname);
    });
  }, [router, pathname, startTransition]);

  useEffect(() => {
    const qs = serializeFiltersToParams(filters);
    const url = qs ? `${pathname}?${qs}` : pathname;
    const id = window.setTimeout(() => {
      startTransition(() => {
        router.replace(url);
      });
    }, 200);
    return () => clearTimeout(id);
  }, [filters, pathname, router, startTransition]);

  // Pick which size options to render
  const sizeOptions = useMemo(() => {
    if (sizeType === "alpha") return ALPHA_SIZES;
    if (sizeType === "age") return AGE_SIZES;
    return []; // none
  }, [sizeType]);

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
        className={`fixed z-49 top-0 left-0 h-full bg-white md:bg-transparent w-full md:w-50 lg:w-72 p-4 overflow-auto transform transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:block motion-preset-fade motion-delay-300`}
      >
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
                <span className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  <span>In Stock</span>
                  <button
                    aria-label="Remove in stock filter"
                    type="button"
                    onClick={clearInStock}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.outOfStock && (
                <span className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800">
                  <span>Out of Stock</span>
                  <button
                    aria-label="Remove out of stock filter"
                    type="button"
                    onClick={clearOutOfStock}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.sizes.map((sz) => (
                <span
                  key={sz}
                  className="relative inline-flex items-center gap-x-1.5 py-1.5 px-3 rounded text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <span>{sz}</span>
                  <button
                    aria-label={`Remove size ${sz}`}
                    type="button"
                    onClick={() => removeSize(sz)}
                    className="cursor-pointer absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-black border-2 border-white rounded-full -top-2 -end-2"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Availability */}
        <Accordion
          type="multiple"
          defaultValue={["availability", "price", "size"]}
          className="w-full"
        >
          <AccordionItem value="availability">
            <AccordionTrigger
              className="flex justify-between items-center cursor-pointer pt-0"
              style={{ textDecoration: "none" }}
            >
              <h3 className="font-medium text-[16px]">Availability</h3>
            </AccordionTrigger>
            <AccordionContent className="overflow-hidden transition-all duration-300 ease-in-out">
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
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="price">
            <AccordionTrigger
              className="flex justify-between items-center cursor-pointer"
              style={{ textDecoration: "none" }}
            >
              <h3 className="font-medium text-[16px]">Price Range</h3>
            </AccordionTrigger>
            <AccordionContent>
              <Slider
                value={filters?.price ?? [0, 30000]}
                onValueChange={(val) =>
                  updateFilters({ price: [val[0], val[1]] })
                }
                min={0}
                max={30000}
                step={1}
                className="min-h-[20px]"
              />
              <div className="flex gap-2 mt-6">
                <div className="flex-1 flex items-center border rounded overflow-hidden">
                  <span className="text-sm px-2.5 h-9 flex items-center justify-center">
                    Rs:
                  </span>
                  <input
                    type="number"
                    min={0}
                    value={filters.price[0]}
                    onChange={(e) =>
                      updateFilters({
                        price: [+e.target.value, filters.price[1]],
                      })
                    }
                    className="w-full px-2.5 py-1 h-9 text-sm focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div className="flex-1 flex items-center border rounded overflow-hidden">
                  <span className="text-sm px-2.5 h-9 flex items-center justify-center">
                    Rs:
                  </span>
                  <input
                    type="number"
                    value={filters.price[1]}
                    max={30000}
                    onChange={(e) =>
                      updateFilters({
                        price: [filters.price[0], +e.target.value],
                      })
                    }
                    className="w-full px-2.5 py-1 text-sm focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Max"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          {sizeType !== "none" && (
            <AccordionItem value="size">
              <AccordionTrigger
                className="flex justify-between items-center cursor-pointer"
                style={{ textDecoration: "none" }}
              >
                <h3 className="font-medium text-[16px]">Size</h3>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-wrap gap-2 mt-1">
                  {sizeOptions.map((sz) => {
                    const active = filters.sizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        onClick={() => {
                          const has = filters.sizes.includes(sz);
                          const next = has
                            ? filters.sizes.filter((s) => s !== sz)
                            : [...filters.sizes, sz];
                          updateFilters({ sizes: next });
                        }}
                        className={`cursor-pointer px-2 py-1 text-sm border rounded ${
                          active
                            ? "bg-black text-white border-black"
                            : "text-black border-gray-400"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </aside>
    </>
  );
}
