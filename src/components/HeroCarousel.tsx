"use client";

import { useState, useEffect, useCallback } from "react";
// import { CarouselApi } from "@/components/ui/carousel"; // Keep shadcn's types
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { heroData } from "@/store/data";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 8000 })]
  );
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden">
      <div className="relative h-[calc(100vh-20rem)] md:h-[80vh]" ref={emblaRef}>
        <div className="relative w-full h-full">
          {heroData.map((slide, idx) => (
            <div
              key={idx}
              className={`
                absolute inset-0 transition-opacity duration-700 ease-in-out
                ${current === idx ? "opacity-100 z-10" : "opacity-0 z-0"}
              `}
            >
              <picture className="absolute inset-0 w-full h-full">
                <source media="(min-width: 768px)" srcSet={slide.desktopSrc} />
                <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                <img
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  className="object-cover w-full h-full"
                />
              </picture>
            </div>
          ))}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center space-x-2 mt-2 relative z-20">
        {heroData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => emblaApi?.scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === idx ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
