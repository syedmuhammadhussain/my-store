import { notFound } from "next/navigation";
import CategoryButton from "@/components/products/CategoryButton";
import FilterSidebar from "@/components/products/list/FilterSidebar";
import SortingDropdown from "@/components/products/list/SortingDropdown";
import ProductGridSSR from "@/components/products/list/ProductGridSSR";
import ClientGridBridge from "@/components/products/ClientGridBridge";
import StrapiService from "@/lib/strapi.service";
import { ProductAttributes } from "@/types/product";
import { CategoryAttributes } from "@/types/category";
import {
  calculateAverageRating,
  defaultPageSizeForProductList,
  getProductBadge,
} from "@/lib/utils";

type cParams = Promise<{ slug: string }>;

export const dynamic = "force-static";
export const revalidate = 300;

export async function generateStaticParams() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/categories`,
    {
      cache: "force-cache",
      next: { revalidate: 300 },
    }
  );
  const json = await res.json();
  return json.data.map((cat: CategoryAttributes) => ({ slug: cat.slug }));
}

export default async function CategoryPage({ params }: { params: cParams }) {
  const { slug } = await params;

  const jsonProducts = await StrapiService.getProductsByCategory(slug, {
    pageSize: defaultPageSizeForProductList,
    page: 1,
  });
  const jsonCategories = await StrapiService.getCategories();
  if (!jsonProducts.data.length) return notFound();

  const allProducts = jsonProducts.data as unknown as ProductAttributes[];
  const products =
    allProducts &&
    allProducts.map((p: ProductAttributes) => {
      const { average, total } = calculateAverageRating(p.reviews || []);
      return {
        ...p,
        averageRating: average,
        reviewsCount: total,
        badge: getProductBadge(p),
      };
    });

  const cateories = jsonCategories.data as unknown as CategoryAttributes[];

  const slugList = ["men", "button-down-pj-sets", "women"];

  const sizeType =
    slug === "kids" ? "age" : slugList.includes(slug) ? "alpha" : "none";

  return (
    <div className="py-1 px-1 md:py-1.5 md:px-4 lg:py-3 lg:px-8">
      <CategoryButton
        subCategories={cateories}
        name={slug.replace("-", " ").toUpperCase()}
        slug={slug}
      />

      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left sidebar (client) */}
        <div className="hidden md:block">
          <FilterSidebar
            initialCount={products.length}
            category={slug}
            sizeType={sizeType}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 p-2 md:p-4">
          <div className="mb-3 md:mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <div className="md:hidden">
                <FilterSidebar
                  initialCount={products.length}
                  category={slug}
                  sizeType={sizeType}
                />
              </div>
              <SortingDropdown />
            </div>
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
            <ClientGridBridge
              category={slug}
              page="category"
              pageSize={defaultPageSizeForProductList}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
