"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useEmblaBreakpoints } from "@/hooks/useEmblaBreakpoints";
import SliderArrowButtons from "@/components/SliderArrowButtons";

interface CarouselProps {
  children: ReactNode[] | ReactNode;
}

export default function ProductSlider({ children }: CarouselProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);

  const emblaOptions = useEmblaBreakpoints({});

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions);

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
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi?.off("select", onSelect);
      emblaApi?.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, x: -16 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.95, ease: [0.2, 0.8, 0.2, 1] },
    },
  };

  return (
    <section
      className="group relative"
      role="region"
      aria-label="Product carousel"
    >
      {/* Viewport */}
      <div className="lg:px-10 px-5 overflow-hidden" ref={emblaRef}>
        {/* Track with permanent side padding */}
        <motion.div
          className="flex gap-5 mx-5 lg:px-5 ml-[calc(0.05rem*-1)] lg:ml-[calc(1rem*-1)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {slides.map((child, idx) => (
            <motion.div
              key={(child as any)?.key ?? idx}
              className="flex-none w-1/2 lg:w-1/3"
              variants={itemVariants}
            >
              <div className="flex flex-col">{child}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Arrows */}
      <SliderArrowButtons canPrev={canPrev} canNext={canNext} emblaApi={emblaApi} view="onHover" />
    </section>
  );
}
