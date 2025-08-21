"use client";

// ** React Imports
import { useEffect, useMemo, useState } from "react";
import { m, LazyMotion, domAnimation } from "framer-motion";
import { Star } from "lucide-react";

// ** Types
import { ProductAttributes } from "@/types/product";
import { ProductColors } from "@/types/product_colors";
import { ProductVariant } from "@/types/variant";
import type { Variants, TargetAndTransition, Transition } from "framer-motion";

// ** Components
import ProductGallery from "@/components/products/ProductGallery";
import ColorSwatches from "@/components/products/ColorSwatches";
import SizeSelector from "@/components/products/SizeSelector";
import ActionButtons from "@/components/products/ActionButtons";
import SizeChartTrigger from "@/components/products/SizeChartTrigger";
import TrustBadges from "@/components/products/TrustBadges";
import QuantityDropdown from "@/components/products/QuantityDropdown";
import ProductDiscount from "@/components/products/Discount";

// ** Utils
import { sizes } from "@/lib/utils";
// import ProductGalleryClient from "@/components/products/ProductGalleryClient";

// ** Inline Types
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
  const label =
    typeof v?.size?.label === "string" ? v.size.label.trim().toUpperCase() : "";
  if (label) {
    const idx = sizes.indexOf(label);
    return idx >= 0 ? idx + 1000 : 5000 + label.charCodeAt(0);
  }
  return 999999;
};

const getSizeLabelUpper = (v: CombinedVariant) => {
  const raw = v?.size?.label;
  return typeof raw === "string" ? raw.trim().toUpperCase() : "";
};

// ** Animation variants
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number): TargetAndTransition => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: "easeOut" as Transition["ease"], // cast to match type
    },
  }),
};

// ** FadeZoom Animations
const fadeZoom: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (): TargetAndTransition => ({
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut" as Transition["ease"], // or use [0.25, 0.1, 0.25, 1]
    },
  }),
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

  const sizesForColor = useMemo(() => {
    if (!selectedVariant) return [];
    const colorId = selectedVariant.colorId;
    const variants = Object.values(variantMapById).filter(
      (v) => v.colorId === colorId
    );
    const map = new Map<string, CombinedVariant>();
    for (const v of variants) {
      const key = getSizeLabelUpper(v);
      if (!key) continue;
      const qty = Number(v.inventory?.quantity ?? 0);
      const cur = map.get(key);
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
  const showOldPrice =
    product.discount_price != null &&
    product.price != null &&
    product.discount_price < product.price;
  const isOutOfStock = Number(selectedVariant.inventory?.quantity ?? 0) === 0;

  // Sections to animate in order
  const animatedSections = [
    <h1 key="title" className="text-2xl font-bold mb-4">
      {product.name}
    </h1>,
    <div key="price" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="text-lg flex items-center flex-wrap gap-2">
          Rs. {displayPrice}{" "}
          {showOldPrice && (
            <span className="text-gray-500 line-through">
              Rs.{product.price.toFixed(2)}
            </span>
          )}
          {product.discount_price && (
            <ProductDiscount
              key="product-discount"
              discount_price={product.discount_price}
              price={product.price}
              variant="two"
            />
          )}
        </div>
        <p className="text-md flex items-center gap-1">
          <Star className="w-3 h-3 text-black fill-black" strokeWidth={2} /> 3.0
        </p>
      </div>
    </div>,
    <ColorSwatches
      key="swatches"
      productSlug={product.slug}
      swatchVariants={swatchVariants}
      selectedId={selectedId}
      variants={sizesForColor}
      onSelect={(id) => setVariantAndSyncUrl(id)}
    />,
    <SizeSelector
      key="size-selector"
      selectedId={selectedId}
      variants={sizesForColor}
      onSelect={(id) => setVariantAndSyncUrl(id)}
    />,
    <QuantityDropdown key="quantity-dropdown" />,
    <ActionButtons key="action-buttons" disabled={isOutOfStock} />,
    <SizeChartTrigger key="size-chart-trigger" />,
    <TrustBadges key="trust-badges" />,
    product.description && (
      <div
        key="description"
        className="prose mt-6"
        dangerouslySetInnerHTML={{ __html: product.description }}
      />
    ),
  ];

  return (
    <div className="p-6 xl:py-3 xl:px-25 mt-0 xl:mt-10">
      <div className="relative mx-auto grid md:grid-cols-2 xl:grid-cols-3">
        <LazyMotion features={domAnimation}>
          {/* Gallery */}
          <div className="md:col-span-1 xl:col-span-2 md:mr-8 xl:m4-10 mb-8 sm:mb-0">
            <m.div
              variants={fadeZoom}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              {/* <ProductGalleryClient productName={product.name} images={mainImages} /> */}
              <ProductGallery productName={product.name} images={mainImages} />
            </m.div>
          </div>

          {/* Right panel staggered */}
          <div className="px-0 sm:px-4 sticky top-0">
            {animatedSections.map((section, i) => (
              <m.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i + 1} // start after gallery
              >
                {section}
              </m.div>
            ))}
          </div>
        </LazyMotion>
      </div>
    </div>
  );
}
