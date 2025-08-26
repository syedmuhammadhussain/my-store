import StrapiImage from "@/components/StrapiImage";
import { cn } from "@/lib/utils";

type Props = {
  title: string;
  src: string | undefined;
  secSrc: string | undefined;
  animation: "zoom" | "fade" | "none";
};

export default function ProductImage({ title, src, secSrc, animation }: Props) {
  if (!src) return null;

  // wrapper always has group/product so children can use group-hover/product
  return (
    <div className="relative w-full h-full overflow-hidden rounded-md group/product">
      {/* skeleton placeholder */}
      <div
        className="absolute inset-0 bg-gray-200 animate-pulse"
        aria-hidden="true"
      />

      {/* CASE A: If we have a secondary image AND animation !== 'none' -> do swap behavior */}
      {secSrc && animation !== "none" ? (
        <>
          {/* primary image (underneath) */}
          <StrapiImage
            alt={title}
            src={src}
            className={cn(
              "object-cover w-full h-full transform transition-transform duration-300 ease-out",
              // when swapping images we keep primary static (could also add slight scale if you want)
              "scale-100"
            )}
          />

          {/* secondary image (absolute, hidden until hover) */}
          <StrapiImage
            alt={`${title} - alternate`}
            src={secSrc}
            className={cn(
              // common
              "object-cover absolute inset-0 w-full h-full transform transition-[transform,opacity,scale] ease-out",
              // default durations; overwritten for zoom below
              "duration-500",

              // FADE behavior: translate from right + opacity change
              animation === "fade" &&
                "translate-x-full opacity-0 group-hover/product:translate-x-0 group-hover/product:opacity-100",

              // ZOOM behavior: translate + opacity + slow scale
              // animation === "zoom" &&
              //   // slower duration for the slow zoom feel
              //   "duration-[1000ms] translate-x-full opacity-0
              // scale-100 group-hover/product:translate-x-0 group-hover/product:opacity-100 group-hover/product:scale-[1.12]"
              animation === "zoom" &&
                // initial: moved off to right + invisible + scale 100%
                "translate-x-full opacity-0 scale-100 group-hover/product:translate-x-0 group-hover/product:opacity-100 group-hover/product:scale-[1.12]" +
                  // durations: opacity 500ms, transform (scale/translate) 1000ms
                  " [transition-duration:1000ms,200ms]"
            )}
          />
        </>
      ) : (
        /* CASE B: No secondary or animation === 'none' -> single-image with small scale on hover (both ways animate) */
        <StrapiImage
          alt={title}
          src={src}
          className={cn(
            // base
            "object-cover w-full h-full transform transition-transform duration-500 ease-out",
            // small lift on hover and smooth return on hover out
            "group-hover/product:scale-[1.09]"
          )}
        />
      )}
    </div>
  );
}
