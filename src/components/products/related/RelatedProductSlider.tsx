"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion, Variants } from "framer-motion";

import SliderArrowButtons from "@/components/SliderArrowButtons";
import { useEmblaBreakpoints } from "@/hooks/useEmblaBreakpoints";

interface CarouselProps {
  children: ReactNode[] | ReactNode;
}

export default function RelatedProductSlider({ children }: CarouselProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);

  const emblaOptions = useEmblaBreakpoints({ alwaysOne: true });

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
      className="group relative w-full"
      role="region"
      aria-label="Product carousel"
    >
      <div className="overflow-hidden [touch-action:pan-y]" ref={emblaRef}>
        {/* Track with equal side padding */}
        <motion.div
          className="flex space-x-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {slides.map((child, idx) => (
            <motion.div
              key={(child as any)?.key ?? idx}
              className={[
                "flex-shrink-0 h-auto",
                "w-[47.5%]",
                "md:w-[31.80%]",
                "lg:w-[24%]",
              ].join(" ")}
              variants={itemVariants}
            >
              {child}
            </motion.div>
          ))}
        </motion.div>
      </div>

      <SliderArrowButtons
        canPrev={canPrev}
        canNext={canNext}
        emblaApi={emblaApi}
        view="onHover"
      />
    </section>
  );
}
