"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductAttributes } from "@/types/product";
import { ProductColors } from "@/types/product_colors";
import { ProductVariant } from "@/types/variant";
import { normalizeSize, sizeToValue } from "@/lib/utils";
import ProductGallery from "@/components/products/ProductGallery";
import ColorSwatches from "@/components/products/ColorSwatches";
import SizeSelector from "@/components/products/SizeSelector";
import ActionButtons from "@/components/products/ActionButtons";
import SizeChartTrigger from "@/components/products/SizeChartTrigger";
import TrustBadges from "@/components/products/TrustBadges";
import QuantityDropdown from "@/components/products/QuantityDropdown";

type CombinedVariant = ProductVariant & {
  colorId: number;
  colorName: string;
  documentId: string;
  inventory: { quantity?: number } | null | undefined;
};

export default function ProductClient({
  product,
  variantMapById,
  defaultVariantId,
  swatchVariants,
  imagesByColor,
}: {
  product: ProductAttributes;
  variantMapById: Record<string, CombinedVariant>;
  defaultVariantId: string;
  swatchVariants: { variant: CombinedVariant; swatchUrl: string | null }[];
  imagesByColor: Record<number, ProductColors["images"]>;
}) {
  // 1) Initial selected variant from URL (only once)
  const [selectedId, setSelectedId] = useState<string>(defaultVariantId);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("variant");
    if (fromUrl && variantMapById[fromUrl]) {
      setSelectedId(fromUrl);
    } else {
      url.searchParams.set("variant", defaultVariantId);
      window.history.replaceState({}, "", url.toString());
      setSelectedId(defaultVariantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedVariant =
    variantMapById[selectedId] ?? variantMapById[defaultVariantId];

  // Sizes available for the currently selected color
  const sizesForColor = useMemo(() => {
    if (!selectedVariant) return [];
    
    const variants = Object.values(variantMapById).filter(
      (v) => v.colorId === selectedVariant.colorId
    );
    const map = new Map<string, CombinedVariant>();
    for (const v of variants) {
      const key = normalizeSize(v.size);
      const cur = map.get(key);
      if (!cur) {
        map.set(key, v);
      } else {
        const curQty = Number(cur.inventory?.quantity ?? 0);
        const qty = Number(v.inventory?.quantity ?? 0);
        if (curQty <= 0 && qty > 0) map.set(key, v);
      }
    }
    return Array.from(map.entries())
      .sort((a, b) => sizeToValue(a[0]) - sizeToValue(b[0]))
      .map(([, v]) => v);
  }, [variantMapById, selectedVariant]); // Added selectedVariant to dependencies

  const setVariantAndSyncUrl = (newId: string) => {
    if (!variantMapById[newId]) return;
    setSelectedId(newId);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", newId);
    window.history.replaceState({}, "", url.toString());
  };

  // Early return must come AFTER all hooks
  if (!selectedVariant) return null;

  const mainImages = imagesByColor[selectedVariant.colorId] ?? [];

  return (
    <div className="py-1 px-1 md:py-3 md:px-15">
      <div className="mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gallery with fullscreen zoom */}
        <ProductGallery productName={product.name} images={mainImages} />

        {/* Right panel */}
        <div className="px-4">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl mb-4">
            Rs. {Number(selectedVariant.price).toFixed(2)}
          </p>

          {/* Color swatches */}
          <ColorSwatches
            productSlug={product.slug}
            swatchVariants={swatchVariants}
            selectedId={selectedId}
            onSelect={(id) => setVariantAndSyncUrl(id)}
          />

          {/* Sizes */}
          <SizeSelector
            selectedId={selectedId}
            variants={sizesForColor}
            onSelect={(id) => setVariantAndSyncUrl(id)}
          />

          {/* Quantity */}
          <QuantityDropdown />

          {/* Actions */}
          <ActionButtons
            disabled={Number(selectedVariant.inventory?.quantity ?? 0) === 0}
          />

          {/* Size chart */}
          <SizeChartTrigger />

          {/* Trust badges */}
          <TrustBadges />

          {/* Description */}
          {product.description && (
            <div
              className="prose mt-6"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
        </div>
      </div>
    </div>
  );
}