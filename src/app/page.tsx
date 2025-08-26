// ** Components
import FeatureProduct from "@/components/home/FeatureProduct";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import ShopByCategory from "@/components/home/ShopByCategory";
import { calculateAverageRating } from "@/lib/utils";

// ** Services
import StrapiService from "@/lib/strapi.service";

// ** Types
import { ProductAttributes } from "@/types/product";

export default async function Home() {
  const featuredRes = await StrapiService.getFeaturedProducts();
  const featured = featuredRes.data as unknown as ProductAttributes[];
  const products =
    featured &&
    featured.map((p: ProductAttributes) => {
      const { average, total } = calculateAverageRating(p.reviews || []);
      return { ...p, averageRating: average, reviewsCount: total };
    });
  console.log("Featured Products: ", products);

  return (
    <main>
      <HeroCarousel />
      <FeatureProduct products={products} />
      <ShopByCategory products={products} />
    </main>
  );
}
