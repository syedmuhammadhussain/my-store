"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import ProductSlider from "../ProductSlider";
import ProductCard from "./ProductCard";
import { ProductAttributes } from "@/types/product";

export default function RelatedProductsTabs({
  related = [],
  recent = [],
}: any) {
  const [tab, setTab] = useState("youMayLike");

  return (
    <section className="px-5 sm:px-8">
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <div className="flex justify-center items-center">
          <TabsList>
            <TabsTrigger value="youMayLike">You May Also Like</TabsTrigger>
            <TabsTrigger value="recentlyViewed">Recently Viewed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="youMayLike">
          <ProductSlider>
            {related.map((p: ProductAttributes) => (
              <ProductCard
                key={p.id}
                id={p.id}
                src={p.gallery && p.gallery[0]?.formats?.small?.url}
                secSrc={p.images && p.images[0]?.formats?.small?.url}
                title={p.name}
                discount_price={p.discount_price}
                price={p.price || 0}
                href={p.slug}
                rating={p.views}
              />
            ))}
          </ProductSlider>
        </TabsContent>

        <TabsContent value="recentlyViewed">
          <ProductSlider>
            {related.map((p: ProductAttributes) => (
              <ProductCard
                key={p.id}
                id={p.id}
                src={p.gallery && p.gallery[0]?.formats?.small?.url}
                secSrc={p.images && p.images[0]?.formats?.small?.url}
                title={p.name}
                discount_price={p.discount_price}
                price={p.price || 0}
                href={p.slug}
                rating={p.views}
              />
            ))}
          </ProductSlider>
        </TabsContent>
      </Tabs>
    </section>
  );
}
