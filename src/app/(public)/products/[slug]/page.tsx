export const revalidate = 300;

import { notFound } from "next/navigation";
import StrapiService from "@/lib/strapi.service";
import ProductClient from "./ProductClient";
import { ProductAttributes } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import { ProductColors } from "@/types/product_colors";
import { sizeToValue } from "@/lib/utils";
import ProductReviews from "@/components/products/reviews/ProductReviews";
import SecurePaymentInfo from "@/components/products/details/SecurePaymentInfo";
import RelatedProductsTabs from "@/components/products/related/RelatedProductsTabs";
import type { Metadata } from "next";
import { buildProductMetadata } from "@/lib/metadata";

type CombinedVariant = ProductVariant & {
  colorId: number;
  colorName: string;
  inventory: { quantity?: number } | null | undefined;
};

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const res = await StrapiService.fetchProductByIdForMetaData(params.slug);
  const product =
    Array.isArray(res.data) && res.data.length ? (res.data[0] as any) : null;

  if (!product) {
    return {
      title: "Product not found • Digo Fashion",
      description: "The requested product was not found.",
      robots: { index: false, follow: false },
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://my-store-tau-nine.vercel.app"
      ),
    } as Metadata;
  }

  // Build trimmed object for metadata builder (avoid passing huge objects)
  const minimal = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    gallery: product.gallery ?? [],
    price: product.price,
    currency: product.currency,
    availability: product.availability,
  };

  return buildProductMetadata(minimal);
}

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

  const allVariants: CombinedVariant[] = (product.product_colors ?? []).flatMap(
    (pc) => {
      const colorId = pc?.color?.id ?? 0;
      const colorName = pc?.color?.name ?? "";
      const variants = Array.isArray(pc?.variants) ? pc.variants : [];
      return variants.map((v) => ({
        ...v,
        colorId,
        colorName,
        inventory: v.inventory ?? { quantity: 0 },
      }));
    }
  );

  if (!allVariants.length) {
    return (
      <div className="p-6 md:py-3 md:px-25 mt-0 sm:mt-6 animate-page-load-fade">
        <ProductClient
          product={product}
          variantMapById={{}}
          defaultVariantId={""}
          swatchVariants={[]}
          imagesByColor={{}}
        />
      </div>
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
    .sort(
      (a, b) =>
        sizeToValue(a) - sizeToValue(b) ||
        a.colorName.localeCompare(b.colorName)
    );

  const defaultVariantId = sorted[0]?.documentId ?? allVariants[0].documentId;

  const swatchVariants = (product.product_colors ?? [])
    .map((pc) => {
      const swatchUrl =
        pc?.swatch_image?.formats?.thumbnail?.url ??
        pc?.swatch_image?.url ??
        null;

      const variants = Array.isArray(pc?.variants) ? pc.variants : [];
      if (!variants.length) return null;

      const candidate = variants
        .map((v) => ({
          ...v,
          colorId: pc.color.id,
          colorName: pc.color.name,
          inventory: v.inventory ?? { quantity: 0 },
        }))
        .reduce((prev, cur) =>
          sizeToValue(cur) < sizeToValue(prev) ? cur : prev
        );

      return { variant: candidate, swatchUrl };
    })
    .filter(Boolean) as {
    variant: CombinedVariant;
    swatchUrl: string | null;
  }[];

  const featuredRes = await StrapiService.getFeaturedProducts();
  const featured = featuredRes.data as unknown as ProductAttributes[];

  return (
    <div>
      <ProductClient
        product={product}
        variantMapById={variantMapById}
        defaultVariantId={defaultVariantId}
        swatchVariants={swatchVariants}
        imagesByColor={imagesByColor}
      />

      <SecurePaymentInfo />

      <ProductReviews productId={product.id} />

      <RelatedProductsTabs related={featured} recent={[]} />
    </div>
  );
}
