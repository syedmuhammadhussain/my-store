import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Rating } from "./Rating";

import "../styles/Card.css";

interface Props {
  id: number | string;
  src?: string;
  secSrc?: string;
  title: string;
  price: string | number;
  href: string;
  rating?: number;
  oldPrice?: string;
  discount?: string;
  [key: string]: string | number | boolean | undefined;
}

export default function ProductCard({
  src,
  secSrc,
  title,
  price,
  oldPrice,
  discount,
  rating,
  href,
  hardCoded,
}: Props) {
  return (
    <div className="group flex-shrink-0 w-full px-1">
      <Link href={`/products/${href}`}>
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xs">
          {hardCoded ? (
            <>
              <Image
                src={`${src}`}
                alt={title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 100vw"
              />
              <Image
                src={`${secSrc}`}
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
            </>
          ) : (
            <>
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${src}`}
                alt={title}
                fill
                className="object-cover"
                sizes="(min-width: 768px) 100vw"
              />
              <Image
                src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${secSrc}`}
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
            </>
          )}
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
            <div className="product-grid-item__info-separator hidden md:inline-block"></div>
            &nbsp;
            <div className="flex items-baseline justify-between space-x-2">
              <span>Rs.{price}</span>
              {discount && (
                <span className="hidden md:block text-gray-400 line-through">
                  Rs.{oldPrice}
                </span>
              )}
            </div>
          </div>
          {discount && (
            <div className="hidden md:block">
              <span className="text-sm text-red-600">{discount}</span>
            </div>
          )}
          {rating && (
            <div className="mt-2">
              <Rating rating={rating} size="w-3 h-3" />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
