"use client";

import Image from "next/image";

export default function ColorSwatches({
  swatchVariants,
  selectedId,
  onSelect,
  variants,
}: {
  productSlug: string;
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
  return (
    <>
      {swatchVariants.length > 1 && (
        <div>
          <small className="uppercase text-sm">Other Colors</small>
          <div className="flex gap-2 mt-1 mb-4">
            {swatchVariants.map(({ variant: v, swatchUrl }) => {
              const isActive =
                // v.documentId === selectedId ||
                variants.find((vs) => vs.documentId === selectedId);
              // console.log("ColorSwatches isActive", isActive);
              // const isActive = v.documentId === selectedId;
              return (
                <button
                  key={v.colorId}
                  type="button"
                  onClick={() => onSelect(v.documentId)}
                  className={` cursor-pointer block rounded border-2 p-0.5 ${
                    isActive
                      ? "border-black"
                      : "border-gray-300 hover:border-black"
                  } `}
                  aria-pressed={Boolean(isActive)}
                  title={v.colorName}
                >
                  {swatchUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${swatchUrl}`}
                      width={30}
                      height={20}
                      alt={v.colorName}
                      className="object-cover"
                      sizes="(max-width: 640px) 30px, 30px"
                    />
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
