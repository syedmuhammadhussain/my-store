"use client";

import React, { ReactNode, useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps {
  children: ReactNode[];
}

export default function ProductSlider({ children }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "start",
    containScroll: "trimSnaps",
  });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className="py-8">
      <h2 className="text-2xl font-bold text-center mb-6">Featured Products</h2>

      {/* Embla viewport with peek on right */}
      <div className="relative">
        <div className="overflow-hidden pl-4 pr-12" ref={emblaRef}>
          <div className="flex space-x-4">
            {children.map((child, idx) => (
              <div
                key={idx}
                className="
                flex-shrink-0
                w-[50%]      /* 2 slides on mobile */
                sm:w-[33.333%]  /* 3 slides on sm+ */
                grid-animate
              "
              >
                {child}
              </div>
            ))}
          </div>
        </div>

        {/* Prev / Next buttons */}
        <div className="absolute inset-y-0 left-10 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="rounded-full disabled:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute inset-y-0 right-10 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
