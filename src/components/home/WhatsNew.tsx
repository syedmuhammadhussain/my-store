"use client";

import Link from "next/link";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { ProductAttributes } from "@/types/product";

export default function WhatsNew({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
  })[];
}) {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 2000, stopOnInteraction: false })]
  );

  return (
    <section
      className="w-full py-10 sm:py-20"
      aria-labelledby="whats-new-heading"
    >
      <div className="px-4 sm:px-6 lg:px-8 flex items-center">
        <h2
          id="whats-new-heading"
          className="text-2xl md:text-3xl lg:text-5xl leading-[1.2] text-gray-400 font-thin lg:w-[15rem]"
        >
          WHAT&apos;S NEW
        </h2>
        <div className="overflow-hidden w-full md:ml-10 lg:mx-20" ref={emblaRef}>
          <div className="flex">
            {[
              ...(products ?? []).map((p) => (
                <article
                  key={p.id}
                  className="mx-2 md:mx-4 flex-none flex flex-col items-center text-center w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/6"
                >
                  <Link
                    href={`/products/${p.slug}`}
                    aria-label={p.sub_category?.name || "Sub Category"}
                    className="block w-full"
                  >
                    <div className="w-full aspect-[1/1] border border-gray-200 w-full rounded-full relative overflow-hidden">
                      <Image
                        src={
                          (p.gallery && p.gallery[0]?.formats.small?.url) ?? ""
                        }
                        alt={p.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="mt-3 text-sm font-medium text-gray-800">
                      {p.sub_category?.name || "Sub Category"}
                    </h3>
                  </Link>
                </article>
              )),
            ]}
          </div>
        </div>
        <div className="visibility-hidden hidden lg:block text-5xl leading-[1.2] text-gray-500 font-thin sm:w-[15rem]"></div>
      </div>
    </section>
  );
}
