"use client";

import React, { useCallback, useMemo, useState } from "react";
import type { UploadedImage } from "@/types/image";
import ProductImage from "./ProductImage";

export default function ProductGalleryClient({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [LightboxComp, setLightboxComp] = useState<any>(null);
  const [plugins, setPlugins] = useState<any[] | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  const slides = useMemo(
    () =>
      images.map((img) => {
        const fmt = img.formats || {};
        const best =
          img ?? fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small;
        return {
          src: best.url,
          width: best.width,
          height: best.height,
          alt: img.alternativeText || productName || img.name || "",
        };
      }),
    [images, productName]
  );

  const thumbFor = useCallback((img: UploadedImage) => {
    const fmt = img.formats || {};
    return (
      img ??
      fmt.original ??
      fmt.large ??
      fmt.medium ??
      fmt.small ??
      fmt.thumbnail
    );
  }, []);

  const loadLightbox = useCallback(async () => {
    if (lightboxLoaded) return;
    try {
      const [
        { default: Lightbox },
        ZoomModule, //ThumbsModule
      ] = await Promise.all([
        import("yet-another-react-lightbox"),
        import("yet-another-react-lightbox/plugins/zoom"),
        // import("yet-another-react-lightbox/plugins/thumbnails"),
      ]);

      try {
        await Promise.all([
          import("yet-another-react-lightbox/styles.css"),
          // import("yet-another-react-lightbox/plugins/thumbnails.css"),
        ]);
      } catch (cssErr) {
        console.warn(
          "Could not dynamically load lightbox CSS. If UI looks broken, import styles globally.",
          cssErr
        );
      }

      setLightboxComp(() => Lightbox);
      setPlugins([
        ZoomModule.default || ZoomModule,
        // ThumbsModule.default || ThumbsModule,
      ]);
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

  function RenderThumb({ img, idx }: { img: UploadedImage; idx: number }) {
    const thumb = thumbFor(img);
    const thumbUrl = thumb?.url;
    const w = thumb?.width;
    const h = thumb?.height;

    if (w && h) {
      return (
        <ProductImage
          src={thumbUrl}
          alt={productName || img.alternativeText || ""}
          className="w-48 h-48 bg-gray-200 cursor-zoom-in w-full h-auto"
        />
      );
    }

    // fallback to fill if no dimensions are available
    return (
      <ProductImage
        src={thumbUrl}
        alt={productName || img.alternativeText || ""}
        className="object-contain"
      />
    );
  }

  return (
    <>
      <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Open product image ${i + 1} of ${images.length}`}
            className="relative w-full h-auto aspect-[2/3] md:aspect-[2/3] xl:aspect-[6/9] rounded-lg overflow-hidden bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <RenderThumb img={img} idx={i} />
          </button>
        ))}
      </div>

      {lightboxLoaded && LightboxComp && (
        <LightboxComp
          open={open}
          index={currentIndex}
          close={() => setOpen(false)}
          slides={slides}
          plugins={plugins || []}
          styles={{
            container: { backgroundColor: "white" },
            toolbar: { background: "transparent", boxShadow: "none" },
            slide: { boxShadow: "none" },
            inner: { boxShadow: "none" },
          }}
          render={{}}
          carousel={{ finite: false }}
          zoom={{
            enabled: true,
            maxZoomPixelRatio: 2,
            zoomInMultiplier: 2,
            doubleClickMaxStops: 1,
            scrollToZoom: true,
          }}
        />
      )}
    </>
  );
}
