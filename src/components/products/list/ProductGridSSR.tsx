import { ProductAttributes } from "@/types/product";
import CategoryProductCard from "@/components/products/CategoryProductCard";

export default function ProductGridSSR({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
    badge?: string | null;
  })[];
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 grid-animate">
      {products.map((p) => (
        <CategoryProductCard
          key={p.id}
          id={p.id}
          src={p.gallery && p.gallery[0]?.formats?.small?.url}
          secSrc={p.images && p.images[0]?.formats?.small?.url}
          title={p.name}
          discount_price={p.discount_price}
          price={p.price || 0}
          href={p.slug}
          rating={p.averageRating ?? 0}
          badge={p.badge ?? ""}
        />
      ))}
    </div>
  );
}
