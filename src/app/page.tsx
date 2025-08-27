// ** Components
import FeatureProduct from "@/components/home/FeatureProduct";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import ShopByCategory from "@/components/home/ShopByCategory";
import TrendingSeason from "@/components/home/TrendingSeason";

// ** Utils
import { calculateAverageRating } from "@/lib/utils";

// ** Services
import StrapiService from "@/lib/strapi.service";

// ** Types
import { ProductAttributes } from "@/types/product";
// import TabsWithBadgeDemo from "@/components/home/ExampleTabs";
import BestSeller from "@/components/home/BestSeller";
import WhatsNew from "@/components/home/WhatsNew";

export default async function Home() {
  const featuredRes = await StrapiService.getFeaturedProducts();
  const featured = featuredRes.data as unknown as ProductAttributes[];
  const products =
    featured &&
    featured.map((p: ProductAttributes) => {
      const { average, total } = calculateAverageRating(p.reviews || []);
      return { ...p, averageRating: average, reviewsCount: total };
    });

  return (
    <main>
      <HeroCarousel />
      <WhatsNew products={products} />
      <FeatureProduct products={products} />
      <ShopByCategory products={products} />
      <TrendingSeason products={products} />
      <BestSeller products={products} />
      {/* <TabsWithBadgeDemo /> */}
    </main>
  );
}
