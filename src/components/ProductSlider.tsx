"use client";

import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

interface CarouselProps {
  children: ReactNode[] | ReactNode;
  active?: boolean; // parent should pass whether this tab is visible
}

export default function ProductSlider({ children, active = true }: CarouselProps) {
  const childrenArr = useMemo(() => React.Children.toArray(children), [children]);

  // embla hook gives a callback ref and the api
  const [emblaRefCallback, emblaApi] = useEmblaCarousel({
    slidesToScroll: 1,
    align: "start",
    containScroll: "trimSnaps",
  });

  // Keep a DOM ref to the same viewport element so we can observe it
  const viewportRef = useRef<HTMLElement | null>(null);
  const combinedRef = useCallback(
    (el: HTMLElement | null) => {
      viewportRef.current = el;
      // call embla's ref callback as well
      emblaRefCallback(el);
    },
    [emblaRefCallback]
  );

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const prefersReduced = useReducedMotion();

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
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // re-init embla when tab becomes active and whenever the viewport size changes
  useEffect(() => {
    if (!emblaApi) return;
    if (active) {
      // reInit on next tick and shortly after to ensure CSS/layout settled
      emblaApi.reInit();
      const t = window.setTimeout(() => emblaApi.reInit(), 80);
      const t2 = window.setTimeout(() => emblaApi.reInit(), 220);
      // setup resize observer on viewport to keep embla correct on dynamic layout
      let ro: ResizeObserver | null = null;
      try {
        ro = new ResizeObserver(() => {
          emblaApi.reInit();
        });
        if (viewportRef.current) ro.observe(viewportRef.current);
      } catch (err) {
        // ResizeObserver not supported? ignore
      }
      return () => {
        window.clearTimeout(t);
        window.clearTimeout(t2);
        if (ro) ro.disconnect();
      };
    }
    // if becoming inactive we do nothing
    return;
  }, [emblaApi, active]);

  // also re-init on window resize (extra safety)
  useEffect(() => {
    if (!emblaApi) return;
    const onResize = () => emblaApi.reInit();
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [emblaApi]);

  // motion variants per item; alternate left / right by index
  const itemInitial = (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? 28 : -28,
  });
  const itemAnimate = { opacity: 1, x: 0 };
  const itemTransition = {
    duration: 0.6,
    ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  };

  return (
    <div className="py-5 xl:py-12 relative">
      {/* left white fade */}
      <div
        aria-hidden
        className="pointer-events-none hidden md:block absolute left-0 top-0 bottom-0 w-20 z-20"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
        }}
      />
      {/* right white fade */}
      <div
        aria-hidden
        className="pointer-events-none hidden md:block absolute right-0 top-0 bottom-0 w-20 z-20"
        style={{
          background:
            "linear-gradient(to left, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)",
        }}
      />

      <div className="relative">
        {/* Embla viewport: use combinedRef so we can observe the element */}
        <div className="overflow-hidden pl-2 pr-12 md:pl-4 md:pr-12" ref={combinedRef as any}>
          {/* IMPORTANT: prevent wrapping */}
          <div className="flex flex-nowrap space-x-4">
            {childrenArr.map((child, idx) => (
              <motion.div
                key={(child as any)?.key ?? idx}
                className={`
                  flex-none
                  w-[50%]        /* 2 slides on mobile */
                  md:w-[33.333%] /* 3 slides on md */
                  lg:w-[25%]     /* 4 slides on lg */
                `}
                initial={prefersReduced ? undefined : itemInitial(idx)}
                animate={prefersReduced ? undefined : itemAnimate} /* use animate instead of whileInView */
                transition={prefersReduced ? undefined : itemTransition}
                whileHover={{ y: prefersReduced ? 0 : -6 }}
              >
                {child}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Prev / Next buttons (show below lg) */}
        <div className="absolute inset-y-0 left-10 flex items-center bottom-[37%] md:bottom-[28%] xl:bottom-[20%] z-30 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canPrev}
            className="rounded-full disabled:hidden bg-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={0.8} />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-10 flex items-center bottom-[37%] md:bottom-[28%] xl:bottom-[20%] z-30 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canNext}
            className="rounded-full disabled:hidden bg-white"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={0.8} />
          </Button>
        </div>
      </div>
    </div>
  );
}
