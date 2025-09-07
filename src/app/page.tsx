// ** Components
import FeatureProduct from "@/components/home/FeatureProduct";
import { HeroCarouselFade } from "@/components/home/HeroCarousel";
import ShopByCategory from "@/components/home/ShopByCategory";
import TrendingSeason from "@/components/home/TrendingSeason";

// ** Utils
import { calculateAverageRating, getProductBadge } from "@/lib/utils";

// ** Services
import StrapiService from "@/lib/strapi.service";

// ** Types
import { ProductAttributes } from "@/types/product";
// import TabsWithBadgeDemo from "@/components/home/ExampleTabs";
import BestSeller from "@/components/home/BestSeller";
import WhatsNew from "@/components/home/WhatsNew";
// import { FeatureHighlights } from "@/components/home/FeatureHighlights";
// import { NewsletterSignup } from "@/components/home/NewsletterSignup";
// import { ScrollRevealFooter } from "@/components/ScrollRevealFooter";
import { FloatingSocial } from "@/components/main/FloatingSocial";
import { FeatureAndNewsletter } from "@/components/home/FeatureAndNewsletter";
import { TextImageSwap } from "@/components/home/TextImageSwap";
import { PromoGridSection } from "@/components/home/PromoGridSection";
import { Footer } from "@/components/main/Footer";

export default async function Home() {
  const featuredRes = await StrapiService.getFeaturedProducts();
  const featured = featuredRes.data as unknown as ProductAttributes[];
  const products =
    featured &&
    featured.map((p: ProductAttributes) => {
      const { average, total } = calculateAverageRating(p.reviews || []);
      return {
        ...p,
        averageRating: average,
        reviewsCount: total,
        badge: getProductBadge(p),
      };
    });

  return (
    <main>
      <HeroCarouselFade />
      <WhatsNew products={products} />
      <FeatureProduct products={products} />
      <ShopByCategory products={products} />
      <TrendingSeason products={products} />
      <BestSeller products={products} />
      {/* <FeatureHighlights /> */}
      {/* <NewsletterSignup /> */}
      <PromoGridSection />
      <TextImageSwap />
      <FeatureAndNewsletter />
      {/* <ScrollRevealFooter
        logoSrc="/logo.png"
        logoAlt="Snoozzfit"
        whatsappHref="https://wa.me/923001234567"
        rewardsHref="/rewards"
      /> */}
      <Footer />
      <FloatingSocial />
      {/* <TabsWithBadgeDemo /> */}
    </main>
  );
}
