// components/PromoGridSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { AnnouncementBar } from "./AnnouncementBar";

type PromoItem = {
  title: string;
  subtitle?: string;
  cta?: string;
  href: string;
  img: string;
};

const leftItems: PromoItem[] = [
  {
    title: "Hues Of Spring",
    subtitle: "Live Now",
    cta: "Enhance your wardrobe",
    href: "/collections/hues-of-spring",
    img: "/images/hero/fashion-collection-hanging-in-modern-clothing-store-free-photo.jpg",
  },
  {
    title: "Mediterranean Dreams",
    subtitle: "Shop Now",
    cta: "Mediterranean Dreams",
    href: "/collections/mediterranean-dreams",
    img: "/images/hero/TPWW.webp",
  },
];

const rightItem: PromoItem = {
  title: "Summer Luxe",
  subtitle: "Explore Now",
  cta: "Elevate your summer style",
  href: "/collections/summer-luxe",
  img: "/images/hero/TPWW.webp",
};

const promos = [
  "🎉 50% off all plans – today only!",
  "🚚 Free shipping on orders over $50",
  "⭐️ New feature: 1-on-1 coaching now available",
  "🎉 50% off all plans – today only!",
  "🚚 Free shipping on orders over $50",
  "⭐️ New feature: 1-on-1 coaching now available",
];

export function PromoGridSection() {
  return (
    <section className="mb-10">
      <AnnouncementBar messages={promos} height="py-4" direction="right" speed={100} />
      <div className="px-5 sm:px-12 py-5">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* Left column: two stacked */}
          <div className="grid gap-4">
            {leftItems.map((item) => (
              <PromoCard key={item.title} {...item} />
            ))}
          </div>

          {/* Right column: single tall */}
          <div className="lg:col-span-2">
            <PromoCard {...rightItem} tall />
          </div>
        </div>
      </div>
      <AnnouncementBar messages={promos} height="py-4" speed={100} />
    </section>
  );
}

function PromoCard({
  title,
  subtitle,
  cta,
  href,
  img,
  tall,
}: PromoItem & { tall?: boolean }) {
  return (
    <Link
      href={href}
      className={clsx(
        "group relative block overflow-hidden rounded-lg",
        tall ? "h-full min-h-[400px] lg:min-h-[100%]" : "h-[300px]"
      )}
    >
      {/* Image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={img}
          alt={title}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        {/* Subtle dark overlay */}
        <div className="absolute inset-0 bg-black/20 transition-colors duration-300 group-hover:bg-black/30" />
      </div>

      {/* Text content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white px-4">
        {subtitle && (
          <span className="mb-1 text-sm font-medium tracking-wide uppercase">
            {subtitle}
          </span>
        )}
        <h3 className="text-2xl font-semibold md:text-3xl">{title}</h3>
        {cta && (
          <span className="mt-2 text-sm font-light opacity-90">{cta}</span>
        )}
      </div>
    </Link>
  );
}
