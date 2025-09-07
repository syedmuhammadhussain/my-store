// ** Third Components
import Link from "next/link";

// ** Custom Components
import ProductImage from "@/components/ProductImage";
import ProductContent from "@/components/ProductContent";
import QuickViewDrawer from "@/components/cart/QuickViewDrawer";

// ** Types
import { Discount } from "@/types/discount";

// ** Styles
import "@/styles/Card.css";

// ** Interfaces
export interface CardProps {
  id: number | string;
  src?: string;
  secSrc?: string;
  title: string;
  price: number | null;
  href?: string;
  rating?: number;
  oldPrice?: string;
  discount?: Discount | null | undefined;
  hardCoded?: boolean;
  discount_price?: number | null;
  className?: string;
  animation?: "fade" | "zoom" | "none";
  heightClassName?: string;
}

export default function ProductCard(props: CardProps) {
  const {
    id,
    src,
    secSrc,
    title,
    price,
    rating,
    href,
    discount_price,
    className = "",
    animation = "fade",
    heightClassName = "aspect-[2/3] md:aspect-[5/6]",
  } = props;
  const displayPrice = discount_price ?? price;
  const showOldPrice =
    discount_price != null && price != null && discount_price < price;

  return (
    <article
      className={`group/product bg-white rounded-md overflow-hidden h-full ${className}`}
      aria-labelledby={`product-${id}-title`}
    >
      <div className="relative">
        <Link
          href={`/products/${href}`}
          aria-label={title}
          className="block h-full"
        >
          <div
            className={`relative w-full ${heightClassName} bg-neutral-100 rounded-lg overflow-hidden`}
          >
            <ProductImage
              animation={animation}
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
