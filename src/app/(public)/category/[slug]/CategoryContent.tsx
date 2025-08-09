// "use client";

// import { useState, useMemo } from "react";
// import FilterSidebar from "@/components/products/FilterSidebar";
// import ProductGridSSR from "@/components/products/ProductGridSSR";
// import dynamic from "next/dynamic";
// import { ProductAttributes } from "@/types/product";
// import { Filters } from "@/types/filters";

// const ProductGridClient = dynamic(
//   () => import("@/components/products/ProductGridClient"),
//   { ssr: false, loading: () => <p>Loading products…</p> }
// );

// interface CategoryContentProps {
//   initialProducts: ProductAttributes[];
//   category: string;
// }

// export default function CategoryContent({
//   initialProducts,
//   category,
// }: CategoryContentProps) {
//   const [filters, setFilters] = useState({
//     inStock: false,
//     outOfStock: false,
//     price: [0, 900] as [number, number],
//     sizes: [] as string[],
//   });

//   // Are we deviating from defaults?
//   const isFiltering = useMemo(
//     () =>
//       filters.inStock ||
//       filters.outOfStock ||
//       filters.sizes.length > 0 ||
//       filters.price[0] !== 0 ||
//       filters.price[1] !== 900,
//     [filters]
//   );

//   function onFiltersChange(next: Filters) {
//     setFilters(next);
//     // apply filtering logic & update `products`
//   }

//   return (
//     <div className="flex flex-col md:flex-row min-h-screen">
//       <FilterSidebar
//         initialCount={initialProducts.length}
//         category={category}
//         filters={filters}
//         onFiltersChange={() => onFiltersChange}
//       />

//       <main className="flex-1 p-0 md:p-4">
//         {isFiltering ? (
//           <ProductGridClient filters={filters} category={category} />
//         ) : (
//           <ProductGridSSR products={initialProducts} />
//         )}
//         {/* <ProductGridSSR products={initialProducts} /> */}
//       </main>
//     </div>
//   );
// }
