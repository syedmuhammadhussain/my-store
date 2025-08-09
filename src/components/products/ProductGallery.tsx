"use client";

import Image from "next/image";
import type { UploadedImage } from "@/types/image";

// npm i yet-another-react-lightbox yet-another-react-lightbox/plugins

export default function ProductGallery({
  productName,
  images,
}: {
  productName: string;
  images: UploadedImage[];
}) {
  //   const slides = useMemo(
  //     () =>
  //       images.map((img) => ({
  //         src: `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${img.url}`,
  //       })),
  //     [images]
  //   );

  return (
    <div className="md:col-span-1 lg:col-span-2">
      {/* Gallery */}
      <div className="grid md:grid-cols-2 gap-4">
        {images.map((img) => {
          const fmt = img.formats || {};
          const pref = ["large", "original", "medium", "small", "thumbnail"];
          const key = pref.find((k) => !!fmt[k]) || Object.keys(fmt)[0];
          const url = key ? fmt[key]?.url : undefined;
          if (!url) return null;
          return (
            <div
              key={img.id}
              className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-gray-50"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`}
                alt={productName}
                fill
                className="object-contain"
                loading="eager"
                priority={key === "large"}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
