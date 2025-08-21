// ProductGalleryClient.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import ProductSliderImage from "./ProductSliderImage"; // your existing component
import { UploadedImage } from "@/types/image";
import "../../styles/embla.css";

export default function ProductGalleryClient({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  // Embla (main and thumbs)
  const [mainRef, mainApi] = useEmblaCarousel({
    loop: false,
    skipSnaps: false,
  });
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

  const slides = useMemo(
    () =>
      images.map((img: any) => {
        const fmt = img.formats ?? {};
        const best =
          img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small;
        return {
          src: (best && best.url) || "",
          alt: img.alternativeText || productName || img.name || "",
          width: best?.width,
          height: best?.height,
        };
      }),
    [images, productName]
  );

  // helper to extract thumbnail (like your thumbFor)
  const thumbFor = useCallback((img: any) => {
    const fmt = img.formats ?? {};
    return fmt.thumbnail;
  }, []);

  useEffect(() => {
    if (!mainApi || !thumbApi) return;

    const onSelect = () => {
      const index = mainApi.selectedScrollSnap();
      setCurrentIndex(index);
      // when main changes, scroll thumbs to the same index (center it)
      if (thumbApi) thumbApi.scrollTo(index);
    };

    mainApi.on("select", onSelect);
    return () => {
      mainApi.off("select", onSelect);
    };
  }, [mainApi, thumbApi]);

  // When clicking thumbnails move main
  const onThumbClick = (index: number) => {
    if (mainApi) mainApi.scrollTo(index);
    setCurrentIndex(index);
  };

  const loadLightbox = useCallback(async () => {
    if (lightboxLoaded) return;
    try {
      const [{ default: Lightbox }, ZoomModule] = await Promise.all([
        import("yet-another-react-lightbox"),
        import("yet-another-react-lightbox/plugins/zoom"),
      ]);
      // Delay loading CSS or instruct to import in _app if you prefer
      try {
        await import("yet-another-react-lightbox/styles.css");
      } catch (e) {
        // If dynamic css import fails, ask to import globally
        console.warn("Lightbox css failed to load dynamically", e);
      }
      setLightboxComp(() => Lightbox);
      setPlugins([ZoomModule.default || ZoomModule]);
      setLightboxLoaded(true);
    } catch (err) {
      console.error("Failed to load lightbox modules:", err);
    }
  }, [lightboxLoaded]);

  const openAt = useCallback(
    async (index: number) => {
      setCurrentIndex(index);
      await loadLightbox();
      setOpen(true);
    },
    [loadLightbox]
  );

  // If images array changes we might want to reset embla
  useEffect(() => {
    mainApi?.reInit();
    thumbApi?.reInit();
  }, [images, mainApi, thumbApi]);

  return (
    <>
      <div className="embla w-full">
        <div className="embla__viewport" ref={mainRef}>
          <div className="embla__container flex gap-3">
            {images.map((img: UploadedImage, i: number) => {
              const fmt = img.formats ?? {};
              const best =
                img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small;
              const src = best?.url ?? "";
              const alt = productName || img.alternativeText || img.name || "";

              return (
                <div
                  key={img.id ?? i}
                  className="embla__slide flex-shrink-0 w-full rounded-lg overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => openAt(i)}
                    aria-label={`Open image ${i + 1}`}
                    className="relative w-full h-auto"
                  >
                    <ProductSliderImage
                      src={src}
                      alt={alt}
                      className="object-contain relative cursor-zoom-in"
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* THUMBNAILS: show on mobile, hide on md and up */}
      <div className="mt-3 md:hidden mb-12">
        <div className="embla embla-thumb">
          <div className="embla__viewport" ref={thumbRef}>
            <div className="embla__container flex items-center justify-center gap-2">
              {images.map((img: UploadedImage, i: number) => {
                const t = thumbFor(img);
                const url = t?.url ?? "";
                return (
                  <div
                    key={img.id ?? i}
                    className={`embla__slide-thumb flex-none w-30 h-30 rounded overflow-hidden border ${
                      i === currentIndex ? "border-4 border-gray-200 transition-border duration-200" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => onThumbClick(i)}
                      className="w-full h-full"
                      aria-label={`Show image ${i + 1}`}
                    >
                      <ProductSliderImage
                        src={url}
                        alt={productName || ""}
                        className="w-30 h-30 object-cover text-center"
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX */}
      {lightboxLoaded && LightboxComp && (
        <LightboxComp
          open={open}
          index={currentIndex}
          close={() => setOpen(false)}
          slides={slides}
          plugins={plugins || []}
          styles={{ container: { backgroundColor: "white" } }}
        />
      )}
    </>
  );
}
