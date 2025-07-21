// src/app/page.tsx
import Header from "@/components/Header";
import { HeroCarousel } from "@/components/HeroCarousel";
import ProductCard from "@/components/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import { slides } from "@/store/data";
// import HeroSection from "@/components/home/HeroSection";

export default function Home() {

  return (
    <>
      <Header />
      <main>
        <HeroCarousel />
        <div className="h-5"></div>
        <ProductSlider>
          {slides.map((prod) => (
            <ProductCard key={prod.id} {...prod} />
          ))}
        </ProductSlider>
        {/* <HeroSection /> */}
        {/* …other sections */}
      </main>
    </>
  );
}
