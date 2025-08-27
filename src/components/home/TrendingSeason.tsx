import ProductCard from "@/components/home/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import { Button } from "@/components/ui/button";

import { ProductAttributes } from "@/types/product";

export default function TrendingSeason({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
  })[];
}) {
  return (
    <div className="mb-15 lg:mb-30 sm:px-0">
      <div className="flex flex-wrap justify-between items-center ml-3 px-5 sm:px-8 mb-8">
        <div>
          <p className="text-gray-800 text-base md:mb-5 mb-1">MOST LOVED</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-5">
            Trending this Season
          </h2>
        </div>
        <Button
          variant="default"
          className="rounded-none h-12 px-12 uppercase font-normal"
        >
          Shop All Trending
        </Button>
      </div>
      <ProductSlider
        perView={{ base: 1, sm: 2, md: 2, lg: 3, xl: 3 }}
        scroll={{ mobile: 1, tabletPortrait: 2, desktop: 3 }}
      >
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
              heightClassName="md:aspect-[2/3]"
            />
          )),
        ]}
      </ProductSlider>
    </div>
  );
}
