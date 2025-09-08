// components/ProductSlider.tsx
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
import { useEmblaBreakpoints } from "@/hooks/useEmblaBreakpoints";
import SliderArrowButtons from "@/components/SliderArrowButtons";
import { cn } from "@/lib/utils";

type PerView = 1 | 2 | 3 | 4 | 5

interface ProductSliderProps {
  children: ReactNode[] | ReactNode;

  // How many items visible per page across breakpoints.
  // Defaults match your old behavior: 2 on mobile, 3 on lg, 4 on xl.
  perView?: {
    base?: PerView; // <= md
    sm?: PerView;
    md?: PerView;
    lg?: PerView;
    xl?: PerView;
  };

  // How many to move per scroll (per breakpoint) — overrides hook defaults.
  scroll?: {
    mobile?: number;
    tabletPortrait?: number;
    desktop?: number;
    wideDesktop?: number;
  };

  // Pass-through Embla options if needed
  options?: any;

  // If you want the old "always one" behavior
  alwaysOne?: boolean;
}

export default function ProductSlider({
  children,
  perView,
  scroll,
  options,
  alwaysOne,
}: ProductSliderProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);

  // Defaults that mirror your existing layout
  const pv = {
    base: perView?.base ?? 1,
    sm: perView?.sm ?? perView?.base ?? 2,
    md: perView?.md ?? perView?.base ?? 3,
    lg: perView?.lg ?? 4,
    xl: perView?.xl ?? 4,
  } as const;

  // Build width classes using only Tailwind's safe fractions
  const widthClassFor = (n: PerView, prefix?: string) => {
    const base =
      n === 1 ? "w-full" : n === 2 ? "w-1/2" : n === 3 ? "w-1/3" : "w-1/4";
    return prefix ? `${prefix}:${base}` : base;
  };

  // const slideWidthClasses = [
  //   widthClassFor(pv.xl, "xl"),
  //   widthClassFor(pv.lg, "lg"),
  //   widthClassFor(pv.md, "md"),
  //   widthClassFor(pv.sm, "sm"),
  //   widthClassFor(pv.base),
  // ].join(" ");

  // Embla options via your breakpoint hook with scroll overrides
  const emblaOptions = useEmblaBreakpoints({
    alwaysOne,
    slidesToScroll: scroll,
    ...options,
  });

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
      <div className="lg:px-10 px-5 overflow-hidden" ref={emblaRef}>
        <motion.div
          className="flex gap-4 mx-5 lg:px-5 ml-[calc(0.05rem*-1)] lg:ml-[calc(1rem*-1)]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {slides.map((child, idx) => (
            <motion.div
              key={(child as any)?.key ?? idx}
              className={cn("flex-none", {
                "w-full": pv.base === 1,
                "w-1/2": pv.base === 2,
                "sm:w-1/2": pv.sm === 2,
                "md:w-1/2": pv.md === 2,
                "md:w-1/3": pv.md === 3,
                "lg:w-1/3": pv.lg === 3,
                "lg:w-1/4": pv.lg === 4,
                "xl:w-1/3": pv.xl === 3,
                "xl:w-1/4": pv.xl === 4,
                "xl:w-1/5": pv.xl === 5,
              })}
              variants={itemVariants}
            >
              <div className="flex flex-col">{child}</div>
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
