import StrapiService from "@/lib/strapi.service";
import { ProductAttributes } from "@/types/product";
import { ProductVariant } from "@/types/variant";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { ShieldCheck, Handshake, LockKeyhole } from "lucide-react";
import { sizes, sizeToValue } from "@/lib/utils";
import QuantityDropdown from "@/components/products/QuantityDropdown";
import SizeChart from "@/components/products/SizeChart";

type pParams = Promise<{ slug: string }>;
type pSearchParams = Promise<{ sku: string | undefined }>;

export const dynamic = "auto";
export const revalidate = 300;

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: pParams;
  searchParams: pSearchParams;
}) {
  const { slug } = await params;
  const { sku } = await searchParams;

  // Fetch product data
  const productData = await StrapiService.getProductBySlug(slug);
  if (!productData.data.length) return notFound();

  const [product] = productData.data as unknown as ProductAttributes[];
  const variants = product.variants as ProductVariant[];

  const sortedVariants = [...variants].sort((a, b) => {
    const diff = sizes.indexOf(a.size) - sizes.indexOf(b.size);
    if (diff !== 0) return diff;
    return a.color.name.localeCompare(b.color.name);
  });
  const defaultVariant = sortedVariants[0];
  const selectedVariant = sku
    ? variants.find((v) => v.sku === sku) || defaultVariant
    : defaultVariant;

  const variantsWithHref = variants.map((v) => ({
    ...v,
    href: `/products/${slug}?sku=${v.sku}`,
  }));

  const variantsByColor = variantsWithHref.reduce((acc, variant) => {
    const colorId = variant.color.id;

    if (!acc.has(colorId)) {
      acc.set(colorId, []);
    }
    acc.get(colorId).push(variant);

    return acc;
  }, new Map());

  const uniqueVariants = Array.from(variantsByColor.values()).map(
    (variants) => {
      return variants.reduce(
        (smallest: { size: string }, current: { size: string }) =>
          sizeToValue(current.size) < sizeToValue(smallest.size)
            ? current
            : smallest
      );
    }
  );

  return (
    <div className="py-1 px-1 md:py-3 md:px-15">
      <div className="mx-auto grid md:grid-cols-2 gap-8">
        {/* <code>{JSON.stringify(uniqueVariants)}</code> */}
        {/* Two main images side-by-side */}
        <div className="grid grid-cols-2 gap-4">
          {selectedVariant.images.slice(0, 2).map((img) => {
            const formats = img.formats || {};
            const priority = [
              "large",
              "original",
              "medium",
              "small",
              "thumbnail",
            ];
            const key =
              priority.find((k) => formats[k]) || Object.keys(formats)[0];
            const url = formats[key!]?.url;
            return (
              <div
                key={img.id}
                className="relative w-full aspect-[4/5] rounded-lg overflow-hidden"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${url}`}
                  alt={product.name}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            );
          })}
        </div>

        {/* Info panel */}
        <div className="px-4">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-md mb-4">Rs.{selectedVariant.price.toFixed(2)}</p>

          {/* Color Swatches */}
          <small className="uppercase">Other Colors</small>
          <div className="flex gap-2 mb-4 mt-1">
            {uniqueVariants.map((v) => (
              <Link
                key={v.color.id}
                href={v.href}
                className={`block border rounded border-2 p-1 ${
                  v.sku === selectedVariant.sku
                    ? "border-black"
                    : "border-gray-300"
                } hover:border-black`}
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}${v.images[0]?.formats.thumbnail?.url}`}
                  width={24}
                  height={24}
                  alt={v.color.name}
                  className="object-cover"
                />
              </Link>
            ))}
          </div>

          {/* Size Buttons */}
          <small className="uppercase">Size</small>
          <div className="flex gap-2 mb-6 mt-1">
            {sizes.map((size) => {
              const variantForSize = variantsWithHref.find(
                (v) =>
                  v.size === size && v.color.id === selectedVariant.color.id
              );
              if (!variantForSize) return null;
              return (
                <Link
                  key={size}
                  href={variantForSize.href}
                  className={`px-3 py-1 w-20 h-10 text-center flex flex-wrap items-center justify-center border rounded transition-colors ${
                    variantForSize.sku === selectedVariant.sku
                      ? "bg-black text-white"
                      : "border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {size}
                </Link>
              );
            })}
          </div>

          {/* Quantity & Actions */}
          <QuantityDropdown />

          <div className="flex items-center gap-4 mb-2 mt-6">
            <Button className="bg-black text-white w-full rounded-sm">
              {/* <Loader2 className="animate-spin h-4 w-4" />  */}
              Add to Cart
            </Button>
            <Button variant="outline" className="w-full rounded-sm">
              Buy It Now
            </Button>
          </div>

          {/* Size Chart Dialog */}
          <Dialog>
            <DialogTitle></DialogTitle>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-xs mb-8 p-0 bg-white border-0 hover:bg-white hover:underline"
              >
                <span className="uppercase">Size Chart</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <SizeChart />
              {/* <h2 className="text-xl font-semibold mb-4">Size Guide</h2>
              <p>Here goes the size chart details...</p> */}
            </DialogContent>
          </Dialog>

          <p className="flex items-center gap-2 text-md text-black-100 mb-4 font-semibold">
            <ShieldCheck size="25" strokeWidth="1" />
            <span>Exceptional Customer Service</span>
          </p>
          <p className="flex items-center gap-2 text-md text-black-100 mb-4 font-semibold">
            <Handshake size="25" strokeWidth="1" />
            <span>Easy Exchange</span>
          </p>
          <p className="flex items-center gap-2 text-md text-black-100 mb-4 font-semibold">
            <LockKeyhole size="25" strokeWidth="1" />
            <span>Secure Payment</span>
          </p>

          {/* Description */}
          <div
            className="prose mt-4"
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        </div>
      </div>
    </div>
  );
}
