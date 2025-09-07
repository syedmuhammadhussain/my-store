import Link from "next/link";
import { Discount } from "@/types/discount";
import QuickButton from "@/components/QuickButton";
import "@/styles/Card.css";
import ProductContent from "@/components/ProductContent";
import ProductImage from "@/components/ProductImage";
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
  heightClassName?: string;
}

export default function RelatedProductSliderCard({
  id,
  src,
  secSrc,
  title,
  price,
  rating,
  href,
  discount_price,
  className = "",
  heightClassName = "aspect-[3/5] md:aspect-[5/6]",
}: Props) {
  const displayPrice = discount_price ?? price;
  const showOldPrice =
    discount_price != null && price != null && discount_price < price;

  return (
    <article
      className={`bg-white rounded-md ${className}`}
      aria-labelledby={`product-${id}-title`}
    >
      <Link
        href={`/products/${href}`}
        aria-label={title}
        className="block h-full"
      >
        {/* Fixed aspect ratio image container */}
        <div
          className={`relative w-full rounded-lg overflow-hidden bg-neutral-100 ${heightClassName} group/product`}
        >
          <ProductImage
            animation="fade"
            src={src}
            secSrc={secSrc}
            title={title}
          />

          <QuickViewDrawer slug={href} />
        </div>

        {/* Product text content */}
        <ProductContent
          id={id}
          title={title}
          price={price}
          discount_price={discount_price}
          showOldPrice={showOldPrice}
          rating={rating}
          displayPrice={displayPrice}
        />
      </Link>
    </article>
  );
}
