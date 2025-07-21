// src/components/HeroCarousel.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { heroData } from "@/store/data";
// import Image from "next/image";

export function HeroCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    setSnaps(api.scrollSnapList());
    onSelect();
    api.on("select", onSelect);
  }, [api, onSelect]);

  return (
    <div className="relative">
      <Carousel
        className="w-full overflow-hidden"
        plugins={[Autoplay({ delay: 5000 })]}
        opts={{ loop: true, align: "start" }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-4">
          {heroData.map((slide, idx) => (
            <CarouselItem
              key={idx}
              className="
                relative basis-full pl-4
                h-[calc(100vh-20rem)]     /* 100vh on mobile */
                md:h-[80vh]     /* 80vh on md+ screens */
                bg-gray-100
                flex items-center justify-center
                overflow-hidden
              "
            >
              {/* SSR-Friendly Responsive Image */}
              <picture className="absolute inset-0 w-full h-full">
                <source media="(min-width: 768px)" srcSet={slide.desktopSrc} />
                <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                {/* Fallback img for very old browsers */}
                <img
                  src={slide.desktopSrc}
                  alt={slide.alt}
                  className="object-cover w-full h-full"
                />
              </picture>

              {/* Overlayed Text */}
              <div className="relative z-10 text-white text-center space-y-2 px-4">
                <h2 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                  {slide.title}
                </h2>
                {slide.subtitle && (
                  <p className="text-lg md:text-xl drop-shadow">
                    {slide.subtitle}
                  </p>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center -mt-8 space-x-2 relative z-10">
        {snaps.map((_, idx) => (
          <button
            key={idx}
            onClick={() => api?.scrollTo(idx)}
            className={`
              w-3 h-3 rounded-full
              ${current === idx ? "bg-blue-600" : "bg-gray-300"}
            `}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
