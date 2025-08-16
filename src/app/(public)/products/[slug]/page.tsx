export const revalidate = 300;

import { notFound } from "next/navigation";
import StrapiService from "@/lib/strapi.service";
import ProductClient from "./ProductClient";
import { ProductAttributes } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ProductColors } from "@/types/product_colors";
import { sizeToValue } from "@/lib/utils";

type CombinedVariant = ProductVariant & {
  colorId: number;
  colorName: string;
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
  const { slug } = params;

  const res = await StrapiService.getProductBySlug(slug);
  if (!res.data?.length) return notFound();

  const product = res.data[0] as ProductAttributes;

  const allVariants: CombinedVariant[] = (product.product_colors ?? [])
    .flatMap((pc) => {
      const colorId = pc?.color?.id ?? 0;
      const colorName = pc?.color?.name ?? "";
      const variants = Array.isArray(pc?.variants) ? pc.variants : [];
      return variants.map((v) => ({
        ...v,
        colorId,
        colorName,
        inventory: v.inventory ?? { quantity: 0 },
      }));
    });

  if (!allVariants.length) {
    return (
      <ProductClient
        product={product}
        variantMapById={{}}
        defaultVariantId={""}
        swatchVariants={[]}
        imagesByColor={{}}
      />
    );
  }

  const variantMapById: Record<string, CombinedVariant> = Object.fromEntries(
    allVariants.filter((v) => !!v.documentId).map((v) => [v.documentId, v])
  );

  const imagesByColor: Record<number, ProductColors["images"]> = {};
  (product.product_colors ?? []).forEach((pc) => {
    if (pc?.color?.id != null) {
      imagesByColor[pc.color.id] = pc.images ?? [];
    }
  });

  const sorted = allVariants
    .slice()
    .sort((a, b) => sizeToValue(a) - sizeToValue(b) || a.colorName.localeCompare(b.colorName));

  const defaultVariantId = sorted[0]?.documentId ?? allVariants[0].documentId;

  const swatchVariants = (product.product_colors ?? [])
    .map((pc) => {
      const swatchUrl =
        pc?.swatch_image?.formats?.thumbnail?.url ?? pc?.swatch_image?.url ?? null;

      const variants = Array.isArray(pc?.variants) ? pc.variants : [];
      if (!variants.length) return null;

      const candidate = variants
        .map((v) => ({
          ...v,
          colorId: pc.color.id,
          colorName: pc.color.name,
          inventory: v.inventory ?? { quantity: 0 },
        }))
        .reduce((prev, cur) => (sizeToValue(cur) < sizeToValue(prev) ? cur : prev));

      return { variant: candidate, swatchUrl };
    })
    .filter(Boolean) as { variant: CombinedVariant; swatchUrl: string | null }[];

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
