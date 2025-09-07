// components/HeroCarouselFade.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

type Slide = {
  type: "image" | "video";
  desktopSrc: string;
  mobileSrc?: string;
  alt?: string;
  heading?: string;
  subheading?: string;
  cta?: { label: string; href: string };
};

const slides: Slide[] = [
  {
    type: "image",
    desktopSrc: "/images/hero/TPWW.webp",
    mobileSrc: "/images/hero/TPWW-mobile.webp",
    alt: "Relax in PJs",
    heading: "Unwind in Style",
    subheading: "Discover our premium loungewear",
    cta: { label: "Shop Now", href: "/collections/pjs" },
  },
  {
    type: "video",
    desktopSrc: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    alt: "Mediterranean Dreams",
    heading: "Mediterranean Dreams",
    subheading: "Soft hues, breezy cuts",
    cta: { label: "Explore Collection", href: "/collections/mediterranean" },
  },
  {
    type: "image",
    desktopSrc: "/images/hero/inner-banner.webp",
    alt: "Desk to Brunch",
    heading: "From Desk to Brunch",
    subheading: "Slay in effortless loungewear",
    cta: { label: "Read More", href: "/blog/loungewear-slay" },
  },
];

const AUTO_DELAY = 8000;

export function HeroCarouselFade() {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, AUTO_DELAY);
    return () => clearInterval(interval);
  }, [total]);

  const goTo = (index: number) => setCurrent(index);
  const prev = () => setCurrent((prev) => (prev - 1 + total) % total);
  const next = () => setCurrent((prev) => (prev + 1) % total);

  return (
    <div className="relative h-[calc(100vh-20rem)] md:h-[85vh] overflow-hidden group">
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          {slides.map((slide, idx) =>
            current === idx ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1.05 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                {/* Image or video */}
                {slide.type === "image" ? (
                  <picture className="absolute inset-0 w-full h-full">
                    {slide.mobileSrc && (
                      <source media="(max-width: 767px)" srcSet={slide.mobileSrc} />
                    )}
                    <img
                      src={slide.desktopSrc}
                      alt={slide.alt}
                      className="object-cover w-full h-full"
                      loading={idx === 0 ? "eager" : "lazy"}
                    />
                  </picture>
                ) : (
                  <video
                    src={slide.desktopSrc}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40" />

                {/* Text + CTA */}
                <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
                  {slide.subheading && (
                    <p className="text-sm font-medium uppercase tracking-wide mb-2">
                      {slide.subheading}
                    </p>
                  )}
                  {slide.heading && (
                    <h2 className="text-3xl md:text-5xl font-bold">{slide.heading}</h2>
                  )}
                  {slide.cta && (
                    <Link
                      href={slide.cta.href}
                      className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-neutral-200 transition"
                    >
                      {slide.cta.label}
                    </Link>
                  )}
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            className={`w-3 h-3 rounded-full transition-colors ${
              current === idx ? "bg-white" : "bg-white/30"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
