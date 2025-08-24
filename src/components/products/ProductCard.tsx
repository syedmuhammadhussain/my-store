import Link from "next/link";
import { ShoppingCart } from "lucide-react";

import { Discount } from "@/types/discount";

import { Rating } from "@/components/Rating";
import ProductDiscount from "@/components/products/details/Discount";
import ProductImageServer from "@/components/products/ProductImage";

import "@/styles/Card.css";

interface Props {
  id: number | string;
  src?: string;
  secSrc?: string;
  title: string;
  price: number | null;
  href: string;
  rating?: number;
  oldPrice?: string;
  discount?: Discount | null | undefined;
  hardCoded?: boolean;
  discount_price?: number | null;
}

export default function ProductCard({
  src,
  secSrc,
  title,
  price,
  rating,
  href,
  discount_price,
}: Props) {
  const displayPrice = discount_price ?? price;
  const showOldPrice =
    discount_price != null && price != null && discount_price < price;

  return (
    <div className="group flex-shrink-0 w-full px-1 mb-6 card-animate">
      <Link href={`/products/${href}`}>
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-lg shadow-xs sm:min-h-[200px] md:min-h-[210px] lg:min-h-[290px] xl:min-h-[360px]">
          <div
            className="absolute inset-0 bg-gray-200 animate-pulse"
            aria-hidden="true"
          ></div>
          {src && secSrc ? (
            <>
              <ProductImageServer
                alt={title}
                src={src}
                className="object-cover"
              />
              <ProductImageServer
                alt={title}
                src={secSrc}
                className="object-cover absolute inset-0 translate-x-full opacity-0 transition-[transform,opacity] duration-600 ease-in-out group-hover:translate-x-0 group-hover:opacity-100"
              />
            </>
          ) : null}
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

        <div className="mt-3 text-[14px] overflow-hidden text-ellipsis">
          <h3 className="inline font-bold after:content-['—'] after:mx-2 truncate md:text-wrap">
            {title}
          </h3>
          <span className="font-normal">Rs.{displayPrice?.toFixed(2)}</span>
          {showOldPrice && (
            <>
              &nbsp;&nbsp;
              <span className="text-gray-500 line-through ml-2">
                Rs.{price.toFixed(2)}
              </span>
            </>
          )}
          {discount_price && (
            <ProductDiscount discount_price={discount_price} price={price} />
          )}
          {rating && (
            <div className="mt-2">
              <Rating rating={rating} />
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
