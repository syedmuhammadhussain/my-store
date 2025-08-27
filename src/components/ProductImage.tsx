"use client";

import { useState, useRef, useEffect } from "react";
import StrapiImage from "@/components/StrapiImage";
import { cn, SPINNER_SVG } from "@/lib/utils";

type Props = {
  title: string;
  src: string | undefined;
  secSrc?: string | undefined;
  animation: "zoom" | "fade" | "none";
  imageClass?: string;
};

export default function ProductImage({ title, src, secSrc, animation, imageClass }: Props) {
  if (!src) return null;

  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to trigger image load when visible
  useEffect(() => {
    if (!imgRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" }
    );
    observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={imgRef}
      className="relative w-full h-full overflow-hidden rounded-md group/product"
    >
      {/* Overlay skeleton + spinner */}
      {!loaded && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10"
          aria-hidden="true"
        >
          <img
            src={SPINNER_SVG}
            alt=""
            aria-hidden="true"
            className="w-12 h-12"
          />
        </div>
      )}

      {/* CASE A: Secondary image swap */}
      {secSrc && animation !== "none" ? (
        <>
          {/* Primary image */}
          {inView && (
            <StrapiImage
              alt={title}
              src={src}
              blurDataURL={SPINNER_SVG} // small blur base; could be LQIP from backend
              className={cn(
                `object-cover w-full h-full transform transition-transform duration-300 ease-out",
                "scale-100 ${imageClass}`,
                loaded ? "opacity-100" : "opacity-0"
              )}
              onLoadingComplete={() => setLoaded(true)}
              priority={false} // keep false for lists, true for LCP
            />
          )}

          {/* Secondary hover image */}
          {inView && (
            <StrapiImage
              alt={`${title} - alternate`}
              src={secSrc}
              blurDataURL={SPINNER_SVG}
              className={cn(
                `object-cover absolute inset-0 w-full h-full transform transition-[transform,opacity,scale] ease-out duration-500 ${imageClass}`,
                animation === "fade" &&
                  "translate-x-full opacity-0 group-hover/product:translate-x-0 group-hover/product:opacity-100",
                animation === "zoom" &&
                  "translate-x-full opacity-0 scale-100 group-hover/product:translate-x-0 group-hover/product:opacity-100 group-hover/product:scale-[1.12] [transition-duration:1000ms,200ms]"
              )}
            />
          )}
        </>
      ) : (
        /* CASE B: Single image hover zoom */
        inView && (
          <StrapiImage
            alt={title}
            src={src}
            blurDataURL={SPINNER_SVG}
            className={cn(
              `object-cover w-full h-full transform transition-transform duration-500 ease-out ${imageClass}`,
              "group-hover/product:scale-[1.09]",
              loaded ? "opacity-100" : "opacity-0"
            )}
            onLoadingComplete={() => setLoaded(true)}
          />
        )
      )}
    </div>
  );
}
