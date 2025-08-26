"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import RelatedProductSlider from "./RelatedProductSlider";
import RelatedProductSliderCard from "./RelatedProductSliderCard";
import { ProductAttributes } from "@/types/product";

export default function RelatedProductsTabs({
  related = [],
  recent = [],
}: any) {
  const [tab, setTab] = useState("youMayLike");

  return (
    <div className="px-5 sm:px-8">
      <Tabs value={tab} onValueChange={(v) => setTab(v)}>
        <div className="flex justify-center items-center mb-10">
          <TabsList>
            <TabsTrigger value="youMayLike">You May Also Like</TabsTrigger>
            <TabsTrigger value="recentlyViewed">Recently Viewed</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="youMayLike">
          <RelatedProductSlider>
            {related.slice(0, 4).map((p: ProductAttributes, index: number) => (
              <div className="embla__slide" key={index}>
                <div className="embla__slide__number">
                  <RelatedProductSliderCard
                    id={p.id}
                    src={p.gallery && p.gallery[0]?.formats?.large?.url}
                    secSrc={p.images && p.images[0]?.formats?.large?.url}
                    title={p.name}
                    discount_price={p.discount_price}
                    price={p.price || 0}
                    href={p.slug}
                    rating={p.views}
                  />
                </div>
              </div>
            ))}
          </RelatedProductSlider>
        </TabsContent>

        <TabsContent value="recentlyViewed">
          <RelatedProductSlider>
            {related.slice(0, 4).map((p: ProductAttributes) => (
              <RelatedProductSliderCard
                key={p.id}
                id={p.id}
                src={p.gallery && p.gallery[0]?.formats?.large?.url}
                secSrc={p.images && p.images[0]?.formats?.large?.url}
                title={p.name}
                discount_price={p.discount_price}
                price={p.price || 0}
                href={p.slug}
                rating={p.views}
              />
            ))}
          </RelatedProductSlider>
        </TabsContent>
      </Tabs>
    </div>
  );
}
