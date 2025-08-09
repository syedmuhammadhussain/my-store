// app/products/[slug]/page.tsx
// export const dynamic = "force-static";
export const revalidate = 300;

import { notFound } from "next/navigation";
import StrapiService from "@/lib/strapi.service";
import ProductClient from "./ProductClient";
import { ProductAttributes } from "@/types/product";
import { ProductColors } from "@/types/product_colors";
import { ProductVariant } from "@/types/variant";
import { sizeToValue } from "@/lib/utils";

type CombinedVariant = ProductVariant & {
  colorId: number;
  colorName: string;
  documentId: string; // ensure this exists on your type or extend it
  inventory: { quantity?: number } | null | undefined;
};

export async function generateStaticParams() {
  const res = await StrapiService.getAllProductSlugs();
  return res.data.map(({ slug }) => ({ slug }));
}

export default async function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const res = await StrapiService.getProductBySlug(slug);
  if (!res.data?.length) return notFound();

  const product = res.data[0] as ProductAttributes;

  // Flatten and enrich with color info
  const allVariants: CombinedVariant[] = product.product_colors.flatMap((pc) =>
    pc.variants.map((v) => ({
      ...v,
      colorId: pc.color.id,
      colorName: pc.color.name,
      // ensure inventory shape
      inventory: v.inventory ?? { quantity: 0 },
    }))
  );
  if (!allVariants.length) return notFound();

  // Map by documentId for O(1) lookup
  const variantMapById: Record<string, CombinedVariant> = Object.fromEntries(
    allVariants.map((v) => [v.documentId, v])
  );

  // Images keyed by color id
  const imagesByColor: Record<number, ProductColors["images"]> = {};
  product.product_colors.forEach((pc) => {
    imagesByColor[pc.color.id] = pc.images;
  });

  // Default variant = smallest size among all
  const defaultVariantId =
    allVariants
      .slice()
      .sort((a, b) => sizeToValue(a.size) - sizeToValue(b.size))[0]
      ?.documentId ?? allVariants[0].documentId;

  // Swatch reps: smallest size per color
  const swatchVariants = product.product_colors.map((pc) => {
    const swatchUrl =
      pc.swatch_image?.formats?.thumbnail?.url ?? pc.swatch_image?.url ?? null;

    const candidate = pc.variants
      .map((v) => ({
        ...v,
        colorId: pc.color.id,
        colorName: pc.color.name,
        inventory: v.inventory ?? { quantity: 0 },
      }))
      .reduce((prev, cur) =>
        sizeToValue(cur.size) < sizeToValue(prev.size) ? cur : prev
      );

    return { variant: candidate, swatchUrl };
  });

  console.log("SwatchVariants *******: ", swatchVariants)

  return (
    <ProductClient
      product={product}
      variantMapById={variantMapById}
      defaultVariantId={defaultVariantId}
      swatchVariants={swatchVariants}
      imagesByColor={imagesByColor}
    />
  );
}
