// app/components/ProductGallery.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductThumbnailImage from "./ProductThumbnailImage";
import ProductImage from "../ProductImage";
import { UploadedImage } from "@/types/image";
import "@/styles/embla.css";

export default function MobileGallery({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  // Embla refs only run client-side
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
    slidesToScroll: 1,
  });

  const [LightboxComp, setLightboxComp] = useState<any>(null);
  const [plugins, setPlugins] = useState<any[] | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Slides for lightbox
  const slides = useMemo(
    () =>
      images.map((img) => {
        const fmt = img.formats ?? {};
        const best =
          img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small;
        return {
          src: best?.url || "",
          alt: img.alternativeText || productName || img.name || "",
          width: best?.width,
          height: best?.height,
        };
      }),
    [images, productName]
  );

  const thumbFor = useCallback((img: UploadedImage) => {
    const fmt = img.formats ?? {};
    return fmt.small ?? fmt.thumbnail;
  }, []);

  // Keep main and thumbs in sync
  useEffect(() => {
    if (!mainApi || !thumbApi) return;
    const onSelect = () => {
      const idx = mainApi.selectedScrollSnap();
      setCurrentIndex(idx);
      thumbApi.scrollTo(idx);
    };
    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi]);

  const onThumbClick = (index: number) => {
    mainApi?.scrollTo(index);
    setCurrentIndex(index);
  };

  // const scrollThumbPrev = useCallback(() => thumbApi?.scrollPrev(), [thumbApi]);
  // const scrollThumbNext = useCallback(() => thumbApi?.scrollNext(), [thumbApi]);

  const scrollMainPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
  const scrollMainNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

  const loadLightbox = useCallback(async () => {
    if (lightboxLoaded) return;
    const [{ default: Lightbox }, ZoomModule] = await Promise.all([
      import("yet-another-react-lightbox"),
      import("yet-another-react-lightbox/plugins/zoom"),
      import("yet-another-react-lightbox/styles.css"),
    ]);
    setLightboxComp(() => Lightbox);
    setPlugins([ZoomModule.default || ZoomModule]);
    setLightboxLoaded(true);
  }, [lightboxLoaded]);

  const openAt = useCallback(
    async (index: number) => {
      setCurrentIndex(index);
      await loadLightbox();
      setOpen(true);
    },
    [loadLightbox]
  );

  return (
    <div className="block lg:hidden">
      {/* Main Carousel – rendered for both mobile & desktop */}
      <div className="relative embla w-full md:mb-4">
        <div className="embla__viewport" ref={mainRef}>
          <div className="embla__container gap-3">
            {images.map((img, i) => {
              const fmt = img.formats ?? {};
              const best =
                img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small;
              return (
                <div
                  key={img.id ?? i}
                  className="embla__slide flex-shrink-0 w-full rounded overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openAt(i)}
                    aria-label={`Open image ${i + 1}`}
                    className="relative w-full aspect-[2/3] rounded overflow-hidden bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                  >
                    <ProductImage
                      src={best?.url || ""}
                      alt={productName || img.alternativeText || img.name || ""}
                      className="object-contain w-full h-full cursor-zoom-in"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <div className="absolute inset-y-0 left-2 flex items-center z-30 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollMainPrev}
            // disabled={!canPrev}
            className="rounded-full bg-white"
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={0.8} />
          </Button>
        </div>

        <div className="absolute inset-y-0 right-2 flex items-center z-30 lg:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollMainNext}
            // disabled={!canNext}
            className="rounded-full bg-white"
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={0.8} />
          </Button>
        </div>
      </div>

      {/* Mobile Thumbnails with arrows */}
      <div className="mb-5 mt-1 md:hidden relative">
        <div className="embla embla-thumb">
          <div className="embla__viewport" ref={thumbRef}>
            <div className="embla__container gap-3">
              {images.map((img, i) => {
                const t = thumbFor(img);
                return (
                  <div
                    key={img.id ?? i}
                    className={`embla__slide-thumb flex-none rounded overflow-hidden border ${
                      i === currentIndex
                        ? "border-2 border-primary"
                        : "border-transparent"
                    }`}
                    style={{ flex: "0 0 calc(100%/4 - 0.5rem)" }}
                  >
                    <button
                      type="button"
                      onClick={() => onThumbClick(i)}
                      className="w-full h-full"
                    >
                      <ProductThumbnailImage
                        src={t?.url || ""}
                        alt={productName || ""}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {lightboxLoaded && LightboxComp && (
        <LightboxComp
          open={open}
          index={currentIndex}
          close={() => setOpen(false)}
          slides={slides}
          plugins={plugins || []}
        />
      )}
    </div>
  );
}
