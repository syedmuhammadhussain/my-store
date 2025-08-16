"use client";

import ProductImage from "@/components/products/ProductImage";

export default function ColorSwatches({
  swatchVariants,
  selectedId,
  onSelect,
  variants,
}: {
  productSlug?: string;
  swatchVariants: {
    variant: { documentId: string; colorId: number; colorName: string };
    swatchUrl: string | null;
  }[];
  selectedId: string;
  onSelect: (id: string) => void;
  variants: {
    documentId: string;
    size: string;
    colorId: number;
    inventory?: { quantity?: number } | null;
  }[];
}) {
  // Find currently selected variant (may be undefined during initial load)
  const selectedVariant = variants.find((v) => v.documentId === selectedId);
  const selectedColorId = selectedVariant?.colorId;
  const selectedSize = selectedVariant?.size;

  return (
    <>
      {swatchVariants.length > 1 && (
        <div>
          <small className="uppercase text-xs font-semibold">
            Other Colors Available
          </small>
          <div className="flex gap-1 mt-1 mb-4">
            {swatchVariants.map(({ variant: v, swatchUrl }) => {
              // active if this swatch's color matches the currently selected variant's color
              const isActive =
                selectedColorId !== undefined
                  ? selectedColorId === v.colorId
                  : v.documentId === selectedId; // fallback

              // When clicking a swatch we try to keep the current size if a matching color+size exists.
              const handleClick = () => {
                // Try find same color + same size
                const sameColorSameSize = variants.find(
                  (vv) => vv.colorId === v.colorId && vv.size === selectedSize
                );
                if (sameColorSameSize) {
                  onSelect(sameColorSameSize.documentId);
                  return;
                }

                // Fallback: first variant with same color
                const sameColorAny = variants.find(
                  (vv) => vv.colorId === v.colorId
                );
                if (sameColorAny) {
                  onSelect(sameColorAny.documentId);
                  return;
                }

                // Final fallback: use the documentId provided by swatchVariants
                onSelect(v.documentId);
              };

              return (
                <button
                  key={v.documentId}
                  type="button"
                  onClick={handleClick}
                  className={`cursor-pointer block rounded border-2 p-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${
                    isActive
                      ? "border-black"
                      : "border-gray-300 hover:border-black"
                  }`}
                  aria-pressed={Boolean(isActive)}
                  title={v.colorName}
                >
                  {swatchUrl ? (
                    <div className="relative w-8 h-12 rounded overflow-hidden">
                      <ProductImage
                        src={swatchUrl}
                        alt={v.colorName}
                        className="object-cover"
                      />
                      {/* <Image
                        src={swatchUrl}
                        alt={v.colorName}
                        fill
                        className="object-cover"
                        sizes="30px"
                        priority={false}
                      /> */}
                    </div>
                  ) : (
                    <span
                      className="inline-block w-6 h-6 rounded-full"
                      style={{ backgroundColor: "#ccc" }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
