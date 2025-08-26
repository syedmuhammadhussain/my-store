import CategoryButton from "@/components/products/CategoryButton";
import FilterSidebar from "@/components/products/list/FilterSidebar";
import SortingDropdown from "@/components/products/list/SortingDropdown";
import { ProductAttributes } from "@/types/product";
import ProductGridSSR from "@/components/products/list/ProductGridSSR";
import StrapiService from "@/lib/strapi.service";
import { notFound } from "next/navigation";
import ClientGridBridge from "@/components/products/ClientGridBridge";
import { SubCategoryAttributes } from "@/types/sub_category";
import { calculateAverageRating } from "@/lib/utils";

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
  const firstSubCategory = (
    jsonSubCategoriesSlug.data as unknown as SubCategoryAttributes[]
  )[0];
  const categorySlug = firstSubCategory?.category?.slug || "";
  const jsonSubCategories = await StrapiService.getSubCategoriesByCategorySlug(
    categorySlug
  );

  const subcategories =
    jsonSubCategories.data as unknown as SubCategoryAttributes[];

  if (!json.data.length) return notFound();
  const allProducts = json.data as unknown as ProductAttributes[];
  const products =
    allProducts &&
    allProducts.map((p: ProductAttributes) => {
      const { average, total } = calculateAverageRating(p.reviews || []);
      return { ...p, averageRating: average, reviewsCount: total };
    });

  const slugList = [
    "shorts-sets",
    "sleep-shirts",
    "button-down-pj-sets",
    "co-ord-sets",
    "dresses",
    "nightwear",
    "pajama-sets",
    "boxers",
    "men-t-shirts",
  ];

  const sizeType = slugList.includes(slug)
    ? "alpha"
    : slug === "boys" || slug === "girls"
    ? "age"
    : "none";

  return (
    <div className="py-1 px-1 md:py-1.5 md:px-4 lg:py-3 lg:px-6">
      <CategoryButton
        subCategories={subcategories}
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
            <ClientGridBridge category={slug} page="category" />
          </div>
        </main>
      </div>
    </div>
  );
}
