import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmblaCarouselType } from "embla-carousel";

type Props = {
  canPrev: boolean;
  canNext: boolean;
  emblaApi?: EmblaCarouselType | undefined;
  view: "onHover" | "always" | "never";
};

export default function SliderArrowButtons({
  canPrev,
  canNext,
  emblaApi,
  view,
}: Props) {
  // never => don't render arrows at all
  if (view === "never") return null;

  // common base for both arrows
  const base =
    "absolute top-[40%] lg:top-[45%] -translate-y-1/2 rounded-full bg-white/90 shadow-sm z-10 transition-all duration-200";

  // "onHover" mode: hidden on lg until hover / group-hover (keeps visible on small screens)
  const onHoverMode =
    "lg:scale-0 lg:opacity-0 lg:hover:scale-[1.3] lg:hover:opacity-100 lg:group-hover:scale-[1.1] lg:group-hover:opacity-100";

  // "always" mode: always visible
  const alwaysMode = "scale-100 opacity-100 lg:scale-100 lg:opacity-100";

  // choose mode classes
  const modeClass = view === "always" ? alwaysMode : onHoverMode;

  return (
    <>
      {/* Prev */}
      {canPrev && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollPrev()}
          aria-label="Previous"
          className={cn(
            base,
            // left position
            "left-5 md:left-10",
            // mode-specific visibility/hover behaviour
            modeClass
          )}
        >
          <ChevronLeft className="h-5 w-5" strokeWidth={1} />
        </Button>
      )}

      {/* Next */}
      {canNext && (
        <Button
          variant="outline"
          size="icon"
          onClick={() => emblaApi?.scrollNext()}
          aria-label="Next"
          className={cn(
            base,
            // right position (kept your original spacing)
            "right-5 lg:right-15",
            // mode-specific visibility/hover behaviour
            modeClass
          )}
        >
          <ChevronRight className="h-5 w-5" strokeWidth={1} />
        </Button>
      )}
    </>
  );
}
