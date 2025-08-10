// app/(public)/category/[slug]/page.tsx
export const dynamic = "force-static";
export const revalidate = 300;

import { notFound } from "next/navigation";
import CategoryButton from "@/components/products/CategoryButton";
import FilterSidebar from "@/components/products/FilterSidebar";
import SortingDropdown from "@/components/products/SortingDropdown";
import ProductGridSSR from "@/components/products/ProductGridSSR";
import ClientGridBridge from "@/components/products/ClientGridBridge";
import StrapiService from "@/lib/strapi.service";
import { ProductAttributes } from "@/types/product";
import { CategoryAttributes } from "@/types/category";

type cParams = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/categories`, {
    cache: "force-cache",
  });
  const json = await res.json();
  return json.data.map((cat: CategoryAttributes) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: { params: cParams }) {
  const { slug } = await params;

  const jsonProducts = await StrapiService.getProductsByCategory(slug);
  const jsonCategories = await StrapiService.getCategories();
  if (!jsonProducts.data.length) return notFound();

  const products = jsonProducts.data as unknown as ProductAttributes[];
  const cateories = jsonCategories.data as unknown as CategoryAttributes[];

  return (
    <div className="py-1 px-1 md:py-3 md:px-15">
      <CategoryButton
        subCategories={cateories}
        name={slug.replace("-", " ").toUpperCase()}
        slug={slug}
      />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left sidebar (client) */}
        <FilterSidebar initialCount={products.length} category={slug} />

        {/* Main content */}
        <main className="flex-1 p-0 md:p-4">
          <div className="mb-3 md:mb-6 flex items-center justify-between">
            <SortingDropdown />
            <p className="text-sm text-gray-600 mr-2">{products.length} products</p>
          </div>

          {/* Grid wrapper: SSR default + CSR overlay */}
          <div id="grid-wrapper">
            <div id="initial-grid">
              <ProductGridSSR products={products} />
            </div>
            {/* Client bridge decides when to render client grid and hides SSR via CSS */}
            <ClientGridBridge category={slug} page="category" />
          </div>
        </main>
      </div>
    </div>
  );
}
