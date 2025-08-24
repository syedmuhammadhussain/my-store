"use client";

import { useCallback, useMemo, useState } from "react";
import type { UploadedImage } from "@/types/image";
import { Thumb } from "./Thumb";
import { useLightbox } from "@/hooks/useLightbox";
import { LightboxViewer } from "./LightboxViewer";
import { getBestImageFormat } from "@/lib/utils";

export default function Gallery({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { LightboxComp, plugins, loadLightbox, loaded } = useLightbox();

  const slides = useMemo(
    () =>
      images.map((img) => {
        const best = getBestImageFormat(img);
        return {
          src: best?.url,
          width: best?.width,
          height: best?.height,
          alt: img.alternativeText || productName || img.name || "",
        };
      }),
    [images, productName]
  );

  const openAt = useCallback(
    async (idx: number) => {
      setCurrentIndex(idx);
      await loadLightbox();
      setOpen(true);
    },
    [loadLightbox]
  );

  return (
    <div className="hidden lg:block">
      <div className="grid md:grid-cols-1 xl:grid-cols-2 gap-6">
        {images.map((img, i) => (
          <Thumb
            key={img.id}
            img={img}
            alt={`${productName} - ${i + 1}`}
            onClick={() => openAt(i)}
          />
        ))}
      </div>

      {loaded && LightboxComp && (
        <LightboxViewer
          open={open}
          index={currentIndex}
          onClose={() => setOpen(false)}
          slides={slides}
          plugins={plugins}
          LightboxComp={LightboxComp}
        />
      )}
    </div>
  );
}
