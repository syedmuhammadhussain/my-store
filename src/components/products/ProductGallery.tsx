"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import type { UploadedImage } from "@/types/image";

/**
 * Props
 *  - productName: string (for alt text fallback)
 *  - images: UploadedImage[] (should include .formats with large/original/medium/thumb if available)
 */
export default function ProductGalleryClient({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Components and plugins will be loaded dynamically on demand4
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const [LightboxComp, setLightboxComp] = useState<any>(null);
  const [plugins, setPlugins] = useState<any[] | null>(null);
  /* eslint-enable @typescript-eslint/no-explicit-any */
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  const base = process.env.NEXT_PUBLIC_STRAPI_BASE_URL ?? "";

  // Build slides using best available large / original formats for high-quality zoom
  const slides = useMemo(
    () =>
      images.map((img) => {
        const fmt = img.formats || {};
        const best =
          fmt.original ?? fmt.large ?? fmt.medium ?? fmt.small ?? img;
        return {
          src: best.url,
          width: best.width,
          height: best.height,
          alt: img.alternativeText || productName || img.name || "",
        };
      }),
    [images, base, productName]
  );

  // Choose a thumbnail format to render on page (prefer small/thumbnail/medium)
  const thumbFor = useCallback((img: UploadedImage) => {
    const fmt = img.formats || {};
    return fmt.small ?? fmt.thumbnail ?? fmt.medium ?? fmt.large ?? img;
  }, []);

  // Lazy-load the lightbox (JS + plugins + CSS). Called once when user opens gallery.
  const loadLightbox = useCallback(async () => {
    if (lightboxLoaded) return;
    try {
      // Dynamically import the modules. These stay out of the initial bundle.
      const [
        { default: Lightbox },
        ZoomModule, //ThumbsModule
      ] = await Promise.all([
        import("yet-another-react-lightbox"),
        import("yet-another-react-lightbox/plugins/zoom"),
        // import("yet-another-react-lightbox/plugins/thumbnails"),
        // Note: CSS imports are attempted below. Some bundlers require top-level CSS imports.
      ]);

      // Try to import CSS dynamically. If your build blocks CSS dynamic imports, you can
      // instead import the files globally (e.g. in app/globals.css or layout) to avoid errors.
      try {
        await Promise.all([
          import("yet-another-react-lightbox/styles.css"),
          // import("yet-another-react-lightbox/plugins/thumbnails.css"),
        ]);
      } catch (cssErr) {
        // Not critical — if CSS can't be loaded dynamically, ensure you add the styles
        // to your global stylesheet or import them at the top of your app.
        // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
      console.error("Failed to load lightbox modules:", err);
    }
  }, [lightboxLoaded]);

  // Handler when thumbnail clicked
  const openAt = useCallback(
    async (index: number) => {
      setCurrentIndex(index);
      // kick off dynamic load; we await it so Lightbox appears only after modules ready
      await loadLightbox();
      setOpen(true);
    },
    [loadLightbox]
  );

  // Helper to render Next Image safely (avoids Next warning about width/height changes)
  function RenderThumb({ img, idx }: { img: UploadedImage; idx: number }) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const thumb = thumbFor(img);
    /* eslint-enable @typescript-eslint/no-explicit-any */
    const thumbUrl = thumb?.url ? thumb.url : img.url;
    const w = thumb?.width;
    const h = thumb?.height;

    // If width/height exist use an intrinsic image (preserves ratio) and set style height:auto
    if (w && h) {
      return (
        <Image
          src={thumbUrl}
          alt={img.alternativeText || productName || ""}
          width={w}
          height={h}
          style={{ width: "100%", height: "auto" }}
          className="w-48 h-48 bg-gray-200 cursor-zoom-in object-contain"
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 33vw"
          loading={idx === 0 ? "eager" : "lazy"}
          priority={idx === 0}
        />
      );
    }

    // fallback to fill if no dimensions are available
    return (
      <Image
        src={thumbUrl}
        alt={img.alternativeText || productName || ""}
        fill
        className="object-contain"
        loading={idx === 0 ? "eager" : "lazy"}
        sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 33vw"
      />
    );
  }

  return (
    <div className="md:col-span-1 lg:col-span-2">
      <div className="grid md:grid-cols-2 gap-4">
        {images.map((img, i) => (
          <button
            key={img.id}
            type="button"
            onClick={() => openAt(i)}
            aria-label={`Open product image ${i + 1} of ${images.length}`}
            // className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-50 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
            className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
          >
            <div className="absolute inset-0 flex items-center justify-center p-4">
              <RenderThumb img={img} idx={i} />
            </div>
            {/* <span className="absolute bottom-2 right-2 text-xs bg-white/75 text-gray-700 px-2 py-1 rounded">
              {i + 1}/{images.length}
            </span> */}
          </button>
        ))}
      </div>

      {/* Render the Lightbox only when loaded and open. The Lightbox component and plugins
          are dynamically imported to keep the initial bundle small. */}
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
          // UI tweaks for e-commerce feel
          render={
            {
              // you can override captions or slide content here if needed
            }
          }
          // performance/carousel tuning
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
    </div>
  );
}

/*
Usage notes:
1. Install: npm i yet-another-react-lightbox
2. If your bundler doesn't allow dynamic CSS imports, import these in a global CSS file or in app/layout:
   import "yet-another-react-lightbox/styles.css";
   import "yet-another-react-lightbox/plugins/thumbnails.css";
3. Provide images with proper `formats` and width/height metadata (Strapi does this by default).
4. This component is client-only and will only load the lightbox JS when the user opens an image.
5. You can further optimize by prefetching the large image only when the user hovers a thumbnail (prefetch pattern).
*/
