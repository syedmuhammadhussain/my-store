import { ProductAttributes } from "@/types/product";
import ProductCard from "../ProductCard";

export default function ProductGridSSR({
  products,
}: {
  products: ProductAttributes[];
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          id={p.id}
          src={p.gallery && p.gallery[0]?.formats?.small?.url}
          secSrc={p.images && p.images[0]?.formats?.small?.url}
          title={p.name}
          price={(p.variants && p.variants[0]?.price) || "1000"}
          href={p.slug}
          rating={3}
        />
      ))}
    </div>
  );
}
