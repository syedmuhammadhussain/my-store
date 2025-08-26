import React from "react";
import { cn } from "@/lib/utils";
import ProductDiscount from "@/components/products/details/Discount";
import Rating from "@/components/Rating";
import type { CardProps } from "./home/ProductCard";

type View = "default" | "bottom" | "center";

export default function ProductContent({
  id,
  title,
  subtitle,
  price,
  badge,
  className,
  children,
  showOldPrice,
  discount_price,
  displayPrice,
  rating,
  view = "default",
}: CardProps & {
  view?: View;
  subtitle?: string;
  badge?: React.ReactNode;
  children?: React.ReactNode;
  showOldPrice?: boolean;
  displayPrice?: number | null;
}) {
  // shared text styles
  const titleBase = "font-semibold leading-tight";
  const subtitleBase = "text-sm opacity-80";
  const priceBase = "text-base font-medium";

  if (view === "bottom") {
    // centered overlay, stronger gradient to ensure contrast
    return (
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 p-4",
          "flex items-end justify-start z-10",
          className
        )}
      >
        {/* bottom gradient to ensure readable white text on varied images */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"
          aria-hidden
        />

        <div className="relative z-20 max-w-[85%]">
          <h3 className={cn(titleBase, "text-lg md:text-2xl text-white")}>
            {title}
          </h3>
          {subtitle && (
            <p className={cn(subtitleBase, "mt-1 text-white/90")}>{subtitle}</p>
          )}

          {/* price shown only when provided */}
          {price != null && (
            <div className="mt-3">
              <span className={cn(priceBase, "text-white")}>{price}</span>
            </div>
          )}

          {badge && <div className="mt-3">{badge}</div>}
        </div>

        {children ?? null}
      </div>
    );
  }

  if (view === "center") {
    // center text-only layout (for hero-like cards)
    return (
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center p-6 text-center",
          className
        )}
      >
        {/* overlay behind text for contrast */}
        <div
          className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors duration-300 pointer-events-none"
          aria-hidden
        />
        <div className="relative z-10 max-w-[92%]">
          <h3 className={cn(titleBase, "text-2xl md:text-3xl text-white")}>
            {title}
          </h3>

          {/* If price is provided, show it — otherwise skip */}
          {price != null ? (
            <p className={cn(priceBase, "mt-2 text-white/90")}>{price}</p>
          ) : (
            subtitle && (
              <p className={cn(subtitleBase, "mt-2 text-white/90")}>
                {subtitle}
              </p>
            )
          )}

          {badge && <div className="mt-4">{badge}</div>}
        </div>

        {children ?? null}
      </div>
    );
  }

  // default view -> bottom-left content (title, subtitle, price)
  return (
    <div className="mt-3 text-[14px] overflow-hidden text-ellipsis">
      <h3
        className="inline font-bold after:content-['—'] after:mx-2 truncate lg:text-wrap"
        id={`product-${id}-title`}
      >
        {title}
      </h3>

      <span className="font-normal">Rs.{displayPrice?.toFixed(2)}</span>
      {showOldPrice && (
        <>
          &nbsp;&nbsp;
          <span className="text-gray-500 line-through ml-2">
            Rs.{price?.toFixed(2)}
          </span>
        </>
      )}

      {discount_price && (
        <ProductDiscount discount_price={discount_price} price={price} />
      )}

      {rating !== 0 && rating != null && (
        <div className="mt-2">
          <Rating rating={rating} />
        </div>
      )}
    </div>
  );
}
