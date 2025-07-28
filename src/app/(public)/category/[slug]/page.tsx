import CategoryButton from "@/components/products/CategoryButton";
import FilterSidebar from "@/components/products/FilterSidebar";
import { SortingDropdown } from "@/components/products/SortingDropdown";
import { ProductAttributes } from "@/types/product";
import ProductGridSSR from "@/components/products/ProductGridSSR";
import StrapiService from "@/lib/strapi.service";
import { notFound } from "next/navigation";
import { CategoryAttributes } from "@/types/category";

type cParams = Promise<{ slug: string }>;

export const dynamic = "force-static";
export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/categories`, {
    cache: "force-cache",
  });
  const json = await res.json();
  return json.data.map((cat: CategoryAttributes) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: { params: cParams }) {
  const { slug } = await params;
  const json = await StrapiService.getProductsByCategory(slug);
  if (!json.data.length) return notFound();
  const products = json.data as unknown as ProductAttributes[];

  return (
    <div className="py-1 px-1 md:py-3 md:px-15">
      <CategoryButton
        subCategories={["T-Shirts", "Hoodies", "Denim", "Accessories"]}
        name={slug.replace("-", " ").toUpperCase()}
      />

      <div className="flex flex-col md:flex-row min-h-screen">
        <FilterSidebar initialCount={products.length} category={slug} />

        <main className="flex-1 p-0 md:p-4">
          <div className="mb-3 md:mb-6 flex items-center justify-between">
            <SortingDropdown />
            <p className="text-sm text-gray-600 mr-2">
              {products.length} products
            </p>
          </div>
          <ProductGridSSR products={products} />
        </main>
      </div>
    </div>
  );
}
