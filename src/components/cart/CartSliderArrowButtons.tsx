// SliderArrowButtonsSwiper.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Swiper as SwiperType } from "swiper";

type Props = {
  swiperApi?: SwiperType;
  canPrev: boolean;
  canNext: boolean;
  view: "onHover" | "always" | "never";
};

export default function CartSliderArrowButtons({
  swiperApi,
  canPrev,
  canNext,
  view,
}: Props) {
  if (view === "never") return null;

  const base =
    "absolute lg:top-[50%] -translate-y-1/2 rounded-full bg-white/90 shadow-sm z-10 transition-all duration-200";
  const onHoverMode =
    "lg:scale-0 lg:opacity-0 lg:hover:scale-[1.3] lg:hover:opacity-100 lg:group-hover:scale-[1.1] lg:group-hover:opacity-100";
  const alwaysMode = "scale-100 opacity-100 lg:scale-100 lg:opacity-100";
  const modeClass = view === "always" ? alwaysMode : onHoverMode;

  return (
    <>
      {canPrev && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperApi?.slidePrev()}
          aria-label="Previous"
          className={cn(base, "left-2 z-1000", modeClass)}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1} />
        </Button>
      )}
      {canNext && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => swiperApi?.slideNext()}
          aria-label="Next"
          className={cn(base, "right-2", modeClass)}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1} />
        </Button>
      )}
    </>
  );
}
