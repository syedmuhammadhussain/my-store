import CategoryButton from "@/components/products/CategoryButton";
import FilterSidebar from "@/components/products/FilterSidebar";
import SortingDropdown from "@/components/products/SortingDropdown";
import { ProductAttributes } from "@/types/product";
import ProductGridSSR from "@/components/products/ProductGridSSR";
import StrapiService from "@/lib/strapi.service";
import { notFound } from "next/navigation";
import ClientGridBridge from "@/components/products/ClientGridBridge";
import { SubCategoryAttributes } from "@/types/category";

type sCParams = Promise<{ slug: string }>;

export const dynamic = "force-static";
export const revalidate = 300; // 5 minutes

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/sub-categories`,
    {
      cache: "force-cache",
    }
  );
  const json = await res.json();
  return json.data.map((cat: SubCategoryAttributes) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: { params: sCParams }) {
  const { slug } = await params;
  const json = await StrapiService.getProductsBySubCategory(slug);
  const jsonSubCategoriesSlug = await StrapiService.getSubCategoryBySlug(slug);
  const jsonSubCategories = await StrapiService.getSubCategoriesByCategorySlug(
    jsonSubCategoriesSlug.data[0]?.category?.slug || ""
  );

  const subcategories =
    jsonSubCategories.data as unknown as SubCategoryAttributes[];

  if (!json.data.length) return notFound();
  const products = json.data as unknown as ProductAttributes[];

  return (
    <div className="py-1 px-1 md:py-3 md:px-15">
      <CategoryButton
        subCategories={subcategories}
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
            <p className="text-sm text-gray-600 mr-2">
              {products.length} products
            </p>
          </div>

          {/* Grid wrapper: SSR default + CSR overlay */}
          <div id="grid-wrapper">
            <div id="initial-grid">
              <ProductGridSSR products={products} />
            </div>
            {/* Client bridge decides when to render client grid and hides SSR via CSS */}
            <ClientGridBridge category={slug} page="subcategory" />
          </div>
        </main>
      </div>
    </div>
  );
}
