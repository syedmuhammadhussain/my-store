import Image from "next/image";
import { ShoppingCart } from "lucide-react";
import { Rating } from "./Rating";
import "../styles/Card.css"

interface Slide {
  id: number | string;
  src: string;
  secSrc: string;
  title: string;
  price: string;
  href: string;
  rating: number;
  oldPrice: string;
  discount: string;
}

export default function ProductCard({
  id,
  src,
  secSrc,
  title,
  price,
  rating,
  oldPrice,
  discount,
}: Slide) {
  return (
    <div key={id} className="group flex-shrink-0 w-full px-1">
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xs">
        {/* 1️⃣ Primary image stays static */}
        <Image
          src={src}
          alt={title}
          fill
          className="object-cover"
          sizes="(min-width: 768px) 100vw"
        />

        {/* 
          2️⃣ Secondary image overlaid off‑screen to the right.
             On hover, translate it left into view.
             We also fade it in from 0 → 100% opacity.
        */}
        <Image
          src={secSrc}
          alt={title}
          fill
          sizes="(min-width: 768px) 100vw"
          className="
            object-cover
            absolute inset-0
            translate-x-full
            opacity-0
            transition-[transform,opacity]
            duration-600
            ease-in-out
            group-hover:translate-x-0
            group-hover:opacity-100
          "
        />

        {/* 3️⃣ Quick‑Buy button slides up on hover */}
        <button
          aria-label="Quick Buy"
          className="hidden md:flex quickBuyBtn cursor-pointer absolute bottom-5 right-5 items-center justify-center bg-white text-gray-900 rounded-sm w-10 h-10 overflow-hidden opacity-0 translate-y-4 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 hover:w-32 hover:px-3"
        >
          <ShoppingCart className="h-5 w-5 flex-shrink-0" />
          <span className="ml-0 w-0 whitespace-nowrap opacity-0 transition-all duration-200 ease-in">
            Quick Buy
          </span>
        </button>
      </div>

      <div className="mt-2">
        <div className="md:flex flex-wrap space-x-2 items-center">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <div className="product-grid-item__info-separator hidden md:inline-block"></div>&nbsp;
          <div className="flex items-baseline justify-between space-x-2">
            <span>{price}</span>
            {discount && (
              <span className="hidden md:block text-gray-400 line-through">{oldPrice}</span>
            )}
          </div>
        </div>
        {discount && (
          <div className="hidden md:block mb-2">
            <span className="text-sm text-red-600">{discount}</span>
          </div>
        )}
        {rating && <Rating rating={rating} size="w-3 h-3" />}
      </div>
    </div>
  );
}
