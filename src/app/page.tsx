// ** Components
import { HeroCarousel } from "@/components/home/HeroCarousel";
import ProductCard from "@/components/products/ProductCard";
import ProductSlider from "@/components/ProductSlider";

// ** Services
import StrapiService from "@/lib/strapi.service";

// ** Types
import { ProductAttributes } from "@/types/product";

export default async function Home() {
  const featuredRes = await StrapiService.getFeaturedProducts();
  const featured = featuredRes.data as unknown as ProductAttributes[];

  return (
    <main>
      <HeroCarousel />
      <div className="h-5" />

      {/* Debug */}
      {/* <code>{JSON.stringify(featured, null, 2)}</code> */}
      <div className="px-4 xl:px-8">
        <h2 className="text-2xl font-bold text-center mb-6">
          Featured Products
        </h2>
        <ProductSlider>
          {[
            ...(featured ?? []).map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                src={p.gallery && p.gallery[0]?.formats?.small?.url}
                secSrc={p.images && p.images[0]?.formats?.small?.url}
                title={p.name}
                discount_price={p.discount_price}
                price={p.price || 0}
                href={p.slug}
                rating={p.views}
              />
            )),
          ]}
        </ProductSlider>
      </div>
    </main>
  );
}
