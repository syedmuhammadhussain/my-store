"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { heroData } from "@/store/data";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", skipSnaps: false },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCurrent(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const scrollPrev = () => {
    emblaApi?.scrollPrev();
  };

  const scrollNext = () => {
    emblaApi?.scrollNext();
  };

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <div className="relative overflow-hidden group">
      <div
        className="relative h-[calc(100vh-20rem)] md:h-[80vh]"
        ref={emblaRef}
      >
        <div className="relative w-full h-full">
          <AnimatePresence mode="wait">
            {heroData.map((slide, idx) =>
              current === idx ? (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <picture className="absolute inset-0 w-full h-full">
                    <source
                      media="(min-width: 768px)"
                      srcSet={slide.desktopSrc}
                    />
                    <source
                      media="(max-width: 767px)"
                      srcSet={slide.mobileSrc}
                    />
                    <img
                      src={slide.desktopSrc}
                      alt={slide.alt}
                      className="object-cover w-full h-full"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </picture>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={scrollPrev}
        className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={scrollNext}
        className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      {/* <div className="flex justify-center space-x-2 mt-3 relative z-20">
        {heroData.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollTo(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === idx ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div> */}
    </div>
  );
}
