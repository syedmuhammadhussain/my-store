"use client";

import React, { ReactNode, useMemo } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion, useReducedMotion } from "framer-motion";

interface CarouselProps {
  children: ReactNode[] | ReactNode;
}

export default function FeaturedProductSlider({ children }: CarouselProps) {
  const childrenArr = useMemo(
    () => React.Children.toArray(children),
    [children]
  );
  const prefersReduced = useReducedMotion();

  // motion variants per item; alternate left / right by index
  const itemInitial = (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? 28 : -28,
  });
  const itemAnimate = { opacity: 1, x: 0 };
  const itemTransition = {
    duration: 0.6,
    // typed tuple to satisfy TS
    ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
  };

  return (
    <div className="w-full px-4 md:px-6 lg:px-8 relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        {/* Give small screens a side padding (peek), remove on lg so 4 items show fully */}
        <CarouselContent className="flex gap-4 flex-nowrap px-4 md:px-6 lg:px-0">
          {childrenArr.map((child, idx) => (
            <CarouselItem
              key={(child as any)?.key ?? idx}
              // fixed widths per breakpoint so layout is predictable
              className="flex-none w-1/2 md:w-1/3 lg:w-1/4 px-1"
            >
              <motion.div
                initial={prefersReduced ? undefined : itemInitial(idx)}
                whileInView={prefersReduced ? undefined : itemAnimate}
                viewport={{ once: true, amount: 0.35 }}
                transition={prefersReduced ? undefined : itemTransition}
                whileHover={{ y: prefersReduced ? 0 : -6 }}
              >
                {child}
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Buttons: show on mobile & tablet (below lg), hide on desktop (lg+) */}
        {/* Left */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30 lg:hidden">
          <CarouselPrevious className="!inline-flex" />
        </div>

        {/* Right */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 z-30 lg:hidden">
          <CarouselNext className="!inline-flex" />
        </div>
      </Carousel>
    </div>
  );
}
