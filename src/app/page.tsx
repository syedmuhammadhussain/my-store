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

import { FeatureAndNewsletter } from "@/components/home/FeatureAndNewsletter";
import { TextImageSwap } from "@/components/home/TextImageSwap";
import { PromoGridSection } from "@/components/home/PromoGridSection";
import Header from "@/components/main/Header";
import { Footer } from "@/components/main/Footer";
import { FloatingSocial } from "@/components/main/FloatingSocial";

// ** Meta
import type { Metadata } from "next";
import { buildProductMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const minimal = {
    name: "Digo Fashion: Upgrade Your Style with Timeless Elegance",
    slug: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "https://my-store-tau-nine.vercel.app"
    ).toString(),
    description:
      "Explore Digo Fashion, where fashion meets sophistication. Explore our collection of exquiste clothing, designed to upgrade your wardrobe with grace and charm.",
    gallery: [{ url: `${process.env.NEXT_PUBLIC_SITE_URL}/logo.png` }],
  };

  return buildProductMetadata(minimal);
}

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
    <>
      <Header />
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

        {/* <TabsWithBadgeDemo /> */}
      </main>
      <Footer />
      <FloatingSocial />
    </>
  );
}
