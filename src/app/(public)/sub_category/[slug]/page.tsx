// app/categories/[slug]/page.tsx
import ProductCard from "@/components/ProductCard";
import FilterSidebar from "@/components/product-listing/FilterSidebar";
import { products } from "@/store/data"; // stub data

export const dynamic = "force-dynamic"; // SSR

// interface Product {
//   id: number;
//   slug: string;
//   name: string;
//   rating?: number;
//   images: { formats?: { small?: { url: string } } }[];
//   variants: {
//     price: string;
//     compareAtPrice?: string;
//     discount?: string;
//   }[];
// }

export default async function SubCategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  // TODO: replace this with your Strapi fetch logic
  const subCategories = ["T-Shirts", "Hoodies", "Denim", "Accessories"];

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <FilterSidebar subCategories={subCategories} />

      <main className="flex-1 p-4">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold">
            {params.slug.replace("-", " ").toUpperCase()}
          </h1>
          <p className="text-sm text-gray-600">
            Showing {products.length} products
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              src={p.images[0]?.formats?.small?.url || ""}
              secSrc={p.images[1]?.formats?.small?.url || ""}
              title={p.name}
              price={p.variants[0]?.price || ""}
              href={p.slug}
              rating={3}
              // oldPrice={p.variants[0]?.compareAtPrice}
              // discount={p.variants[0]?.discount}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
