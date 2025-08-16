"use client";

import { useEffect, useMemo, useState } from "react";
import { ProductAttributes } from "@/types/product";
import { ProductColors } from "@/types/product_colors";
import { ProductVariant } from "@/types/variant";
import ProductGallery from "@/components/products/ProductGallery";
import ColorSwatches from "@/components/products/ColorSwatches";
import SizeSelector from "@/components/products/SizeSelector";
import ActionButtons from "@/components/products/ActionButtons";
import SizeChartTrigger from "@/components/products/SizeChartTrigger";
import TrustBadges from "@/components/products/TrustBadges";
import QuantityDropdown from "@/components/products/QuantityDropdown";
import { sizes } from "@/lib/utils";

type CombinedVariant = ProductVariant & {
  colorId: number;
  colorName: string;
  documentId: string;
  inventory: { quantity?: number } | null | undefined;
  size?: { label?: string; sort_order?: number | null } | null;
};

const sizeRank = (v: {
  size?: { label?: string; sort_order?: number | null } | null;
}) => {
  const sort = v?.size?.sort_order;
  if (Number.isFinite(sort)) return Number(sort);

  const raw = v?.size?.label;
  const label = typeof raw === "string" ? raw.trim().toUpperCase() : "";

  if (label) {
    const idx = sizes.indexOf(label);
    if (idx >= 0) return idx + 1000;
    return 5000 + label.charCodeAt(0);
  }

  return 999999;
};

const getSizeLabelUpper = (v: CombinedVariant) => {
  const raw = v?.size?.label;
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
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
  const [selectedId, setSelectedId] = useState<string>(defaultVariantId);

  useEffect(() => {
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get("variant");
    if (fromUrl && variantMapById[fromUrl]) {
      setSelectedId(fromUrl);
    } else if (defaultVariantId) {
      url.searchParams.set("variant", defaultVariantId);
      window.history.replaceState({}, "", url.toString());
      setSelectedId(defaultVariantId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedVariant =
    variantMapById[selectedId] ??
    (defaultVariantId ? variantMapById[defaultVariantId] : undefined);

  // Build sizes for the selected color, unique by normalized label, prefer in-stock
  const sizesForColor = useMemo(() => {
    // debugger
    if (!selectedVariant) return [];
    const colorId = selectedVariant.colorId;
    const variants = Object.values(variantMapById).filter(
      (v) => v.colorId === colorId
    );

    const map = new Map<string, CombinedVariant>();
    for (const v of variants) {
      const key = getSizeLabelUpper(v);
      if (!key) continue;

      const cur = map.get(key);
      const qty = Number(v.inventory?.quantity ?? 0);
      if (!cur) {
        map.set(key, v);
      } else {
        const curQty = Number(cur.inventory?.quantity ?? 0);
        if (curQty <= 0 && qty > 0) map.set(key, v);
      }
    }

    return Array.from(map.values()).sort((a, b) => sizeRank(a) - sizeRank(b));
  }, [variantMapById, selectedVariant?.colorId, selectedVariant]);

  const setVariantAndSyncUrl = (newId: string) => {
    if (!variantMapById[newId]) return;
    setSelectedId(newId);
    const url = new URL(window.location.href);
    url.searchParams.set("variant", newId);
    window.history.replaceState({}, "", url.toString());
  };

  if (!selectedVariant) return null;

  const mainImages = imagesByColor[selectedVariant.colorId] ?? [];
  const displayPrice = Number(
    selectedVariant.price ?? product.price ?? 0
  ).toFixed(2);
  const isOutOfStock = Number(selectedVariant.inventory?.quantity ?? 0) === 0;

  return (
    <div className="py-1 px-1 md:py-3 md:px-6 animate-page-load-fade">
      <div className="mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Gallery */}
        <ProductGallery productName={product.name} images={mainImages} />

        {/* Right panel */}
        <div className="px-4">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl mb-4">Rs. {displayPrice}</p>

          {/* Color swatches */}
          <ColorSwatches
            productSlug={product.slug}
            swatchVariants={swatchVariants}
            selectedId={selectedId}
            variants={sizesForColor}
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
          <ActionButtons disabled={isOutOfStock} />

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
