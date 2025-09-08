import Link from "next/link";

import { Discount } from "@/types/discount";
import ProductImage from "@/components/ProductImage";
import ProductContent from "@/components/ProductContent";

import "@/styles/Card.css";
import { getBadgeColor } from "@/lib/utils";
import QuickViewDrawer from "@/components/cart/QuickViewDrawer";

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
  className?: string;
  badge?: string | null;
}

export default function CategoryProductCard({
  id,
  src,
  secSrc,
  title,
  price,
  rating,
  href,
  discount_price,
  className = "",
  badge = "",
}: Props) {
  const displayPrice = discount_price ?? price;
  const showOldPrice =
    discount_price != null && price != null && discount_price < price;

  return (
    <article
      className={`group/product relative bg-white rounded-md overflow-hidden h-full mb-8 ${className}`}
      aria-labelledby={`product-${id}-title`}
    >
      <div className="relative">
        <Link
          href={`/products/${href}`}
          aria-label={title}
          className="block h-full"
        >
          <div className="relative w-full aspect-[4/6] bg-neutral-100 rounded-lg overflow-hidden">
            {badge && (
              <div className="absolute top-1 right-2 z-10">
                <span className={getBadgeColor(badge as any)}>{badge}</span>
              </div>
            )}
            <ProductImage
              animation="fade"
              src={src}
              secSrc={secSrc}
              title={title}
            />
          </div>
        </Link>

        <QuickViewDrawer slug={href} />
      </div>
      <ProductContent
        id={id}
        title={title}
        price={price}
        discount_price={discount_price}
        showOldPrice={showOldPrice}
        rating={rating}
        displayPrice={displayPrice}
      />
    </article>
  );
}
