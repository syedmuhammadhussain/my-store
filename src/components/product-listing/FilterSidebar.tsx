// components/FilterSidebar.tsx
"use client";

import { useState } from "react";

interface FilterSidebarProps {
  subCategories: string[];
}

export default function FilterSidebar({ subCategories }: FilterSidebarProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [inStock, setInStock] = useState(false);
  const [outOfStock, setOutOfStock] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 900]);
  const [sizes, setSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  return (
    <>
      {/* Mobile “Filters” Button */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden mb-4 px-4 py-2 bg-black text-white rounded"
      >
        Filters
      </button>

      {/* Overlay when open */}
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`
          fixed z-50 top-0 left-0 h-full w-64 bg-white p-4 overflow-auto
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:block
        `}
      >
        {/* Header & Close (mobile only) */}
        <div className="flex items-center justify-between mb-6 md:hidden">
          <h2 className="text-lg font-semibold">Filters</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 1. Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        {/* 2. Sub-Categories */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Sub-Categories</h3>
          <div className="flex flex-wrap gap-2">
            {subCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedSub(cat)}
                className={`
                  px-3 py-1 text-sm rounded border
                  ${
                    selectedSub === cat
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-400"
                  }
                `}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Availability */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Availability</h3>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={inStock}
              onChange={() => setInStock((v) => !v)}
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <span>In Stock</span>
          </label>
          <label className="flex items-center space-x-2 mt-2">
            <input
              type="checkbox"
              checked={outOfStock}
              onChange={() => setOutOfStock((v) => !v)}
              className="h-4 w-4 text-black border-gray-300 rounded"
            />
            <span>Out of Stock</span>
          </label>
        </div>

        {/* 4. Price Range */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Price Range</h3>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="number"
              value={priceRange[0]}
              min={0}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
            <span>—</span>
            <input
              type="number"
              value={priceRange[1]}
              max={900}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-16 px-2 py-1 border rounded text-sm"
            />
          </div>
          <input
            type="range"
            min={0}
            max={900}
            value={priceRange[0]}
            onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
            className="w-full accent-black"
          />
        </div>

        {/* 5. Size */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Size</h3>
          <div className="flex flex-wrap gap-2">
            {["S", "M", "L", "XL", "XXL", "XXXL"].map((sz) => (
              <button
                key={sz}
                onClick={() => toggleSize(sz)}
                className={`
                  px-2 py-1 text-sm border rounded
                  ${
                    sizes.includes(sz)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-gray-400"
                  }
                `}
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
