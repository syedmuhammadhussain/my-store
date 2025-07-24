// app/categories/[slug]/page.tsx
import Link from "next/link";
import Image from "next/image";
import qs from "qs";

export const dynamic = "force-dynamic"; // always SSR

type Product = {
  id: number;
  slug: string;
  name: string;
  rating: number;
  images: { url: string }[];
  variants: { price: number }[];
};

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  debugger;
  // 1. Fetch all products in this category, populate first two images and the cheapest variant
  const query = qs.stringify(
    {
      filters: {
        categories: {
          slug: {
            $eq: params.slug,
          },
        },
      },
      populate: ["images", "variants"],
      fields: ["name", "slug", "rating"],
    },
    {
      encodeValuesOnly: true, // prettier URLs
    }
  );

  const res = await fetch(`${process.env.STRAPI_URL}/api/products?${query}`, {
    cache: "no-store",
  });

  const json = await res.json();
  const products: Product[] = json.data.map((d: any) => ({
    id: d.id,
    slug: d.attributes.slug,
    name: d.attributes.name,
    rating: d.attributes.rating,
    images: d.attributes.images.slice(0, 2),
    // pick the lowest-price variant for listing
    variants: d.attributes.variants.sort((a: any, b: any) => a.price - b.price),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {products.map((p) => (
        <Link key={p.id} href={`/products/${p.slug}`} className="card">
          <div className="relative w-full h-64">
            <Image
              src={p.images[0]?.url}
              alt={p.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-2">
            <h2 className="text-lg font-semibold">{p.name}</h2>
            <p className="text-sm text-gray-500">
              Rating: {p.rating.toFixed(1)}
            </p>
            <p className="mt-1 font-bold">
              Rs.{p.variants[0].price.toFixed(2)}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
