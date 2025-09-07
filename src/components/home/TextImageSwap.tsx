// components/TextImageSwap.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

const items = [
  {
    title: "Co-ord Sets Vs T-Shirts",
    desc: "Which One should you pick?",
    img: "/images/hero/fashion-collection-hanging-in-modern-clothing-store-free-photo.jpg",
    href: "/blog/coord-vs-tshirt",
  },
  {
    title: "Unwind in your favorite PJs by Snoozoff",
    desc: "Need to relax?",
    img: "/images/hero/TPWW.webp",
    href: "/blog/pjs-relax",
  },
  {
    title: "Ways you Can Slay in Loungewear",
    desc: "From Desk to Brunch",
    img: "/images/hero/inner-banner.webp",
    href: "/blog/loungewear-slay",
  },
];

export function TextImageSwap() {
  const [active, setActive] = useState(0);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black text-white">
      {/* Background images */}
      <div className="absolute inset-0">
        {items.map((item, idx) => (
          <div
            key={item.title}
            className={clsx(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            )}
          >
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={item.img}
                alt={item.title}
                fill
                priority={active === idx}
                className={clsx(
                  "object-cover object-center transition-transform duration-700 ease-out",
                  active === idx ? "scale-105" : "scale-100"
                )}
              />
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </div>
        ))}
      </div>

      {/* Text row */}
      <div className="relative z-20 flex h-full items-center justify-center px-4">
        <div className="grid w-full max-w-6xl gap-8 text-center md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div
              key={item.title}
              onMouseEnter={() => setActive(idx)}
              onFocus={() => setActive(idx)}
              className={clsx(
                "cursor-pointer space-y-3 transition-colors duration-300",
                active === idx ? "text-white" : "text-neutral-300"
              )}
            >
              <p className="text-base md:text-base">
                {item.desc}
              </p>
              <h3 className="text-2xl font-semibold md:text-xl lg:text-2xl">
                {item.title}
              </h3>
              <Link
                href={item.href}
                className="inline-block border-b border-current pb-0.5 text-sm font-medium hover:text-white"
              >
                READ MORE
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
