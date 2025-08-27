import React from "react";
import RelatedProductSlider from "@/components/products/related/RelatedProductSlider";
import RelatedProductSliderCard from "@/components/products/related/RelatedProductSliderCard";
import { ProductAttributes } from "@/types/product";

export default function ShopByCategory({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
  })[];
}) {
  return (
    <div className="px-5 sm:px-8 mb-20">
      <h2 className="text-3xl font-bold text-center my-6 xl:my-12">
        Shop By Category
      </h2>
      <RelatedProductSlider>
        {[
          ...(products ?? []).map((p) => (
            <RelatedProductSliderCard
              key={p.id}
              id={p.id}
              src={p.gallery && p.gallery[0]?.formats?.large?.url}
              secSrc={p.images && p.images[0]?.formats?.large?.url}
              title={p.name}
              discount_price={p.discount_price}
              price={p.price || 0}
              href={p.slug}
              rating={p.averageRating ?? 0}
              heightClassName="aspect-[2/3]"
            />
          )),
        ]}
      </RelatedProductSlider>
    </div>
  );
}
