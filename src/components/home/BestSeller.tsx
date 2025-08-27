"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductCard from "@/components/home/ProductCard";
import ProductSlider from "@/components/ProductSlider";
import { ProductAttributes } from "@/types/product";

export default function BestSeller({
  products,
}: {
  products: (ProductAttributes & {
    averageRating?: number;
    reviewsCount?: number;
  })[];
}) {
  // ** States
  const [tab, setTab] = useState("bestSeller");

  return (
    <div className="mb-15 lg:mb-30 sm:px-0">
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <div className="flex justify-center items-center mb-10">
          <TabsList className="p-0 bg-background-none justify-start border-b border-violet-500/65 rounded-none">
            <TabsTrigger
              value="bestSeller"
              className="cursor-pointer text-base font-bold rounded-none bg-background-none h-full border-gray-50 data-[state=active]:shadow-none pb-5
              data-[state=active]:bg-background-none border-b-4 data-[state=active]:border-violet-500/65"
            >
              Best Seller
            </TabsTrigger>
            <TabsTrigger
              value="newaArrivals"
              className="cursor-pointer text-base font-bold rounded-none bg-background-none h-full border-gray-50 data-[state=active]:shadow-none pb-5
              data-[state=active]:bg-background-none border-b-4 data-[state=active]:border-violet-500/65"
            >
              New Arrivals
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="bestSeller">
          <ProductSlider
            perView={{ base: 2, sm: 2, md: 2, lg: 3, xl: 4 }}
            scroll={{ mobile: 1 }}
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
                  animation="fade"
                  heightClassName="aspect-[4/5] md:aspect-[2/3]"
                />
              )),
            ]}
          </ProductSlider>
        </TabsContent>
        <TabsContent value="newaArrivals">
          <ProductSlider
            perView={{ base: 2, sm: 2, md: 2, lg: 3, xl: 4 }}
            scroll={{ mobile: 1 }}
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
                  animation="fade"
                  heightClassName="aspect-[4/5] md:aspect-[2/3]"
                />
              )),
            ]}
          </ProductSlider>
        </TabsContent>
      </Tabs>
    </div>
  );
}
