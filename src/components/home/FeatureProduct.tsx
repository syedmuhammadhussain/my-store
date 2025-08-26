import ProductCard from "@/components/home/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import { ProductAttributes } from "@/types/product";

export default function FeatureProduct({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
  })[];
}) {
  return (
    <div className="mb-15 lg:mb-30 sm:px-0">
      <h2 className="text-3xl font-bold text-center my-12 xl:my-20">
        Featured Products
      </h2>
      <ProductSlider>
        {[
          ...(products ?? []).map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              src={p.gallery && p.gallery[0]?.formats.large?.url}
              secSrc={p.images && p.images[0]?.formats.large?.url}
              title={p.name}
              discount_price={p.discount_price}
              price={p.price || 0}
              href={p.slug}
              rating={p.averageRating ?? 0}
              animation="zoom"
            />
          )),
        ]}
      </ProductSlider>
    </div>
  );
}
