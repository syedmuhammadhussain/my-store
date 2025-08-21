// ProductReviews.tsx
// A single-file, component-based Reviews UI for Next.js (App Router) using Tailwind + shadcn-style components.
// - Server component (default export) fetches initial data (SSR) and passes to client components
// - Client components handle sorting, modal for writing reviews, simple accessibility
// NOTE: Replace fetchReviews() with your real API call or accept `initialData` as a prop.

import React from "react";
import Stars from "./Stars";
import { ReviewsClient } from "./ReviewsClient";

// Server component: default export
export default async function ProductReviews({
  productId,
  initialData,
}: {
  productId: string | number;
  initialData?: any;
}) {
  // If the parent passed initialData (from page-level fetch) we use that.
  // Otherwise, fetch on the server (SSR) so markup is pre-rendered for SEO/LCP.
  const data = initialData;

  return (
    <section className="px-6 py-12 lg:pt-30">
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-center">
          Customer Reviews
        </h2>
      </div>

      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Summary */}
          <div className="col-span-1">
            <SummaryCard summary={data} />
          </div>

          {/* Distribution + Write review button */}
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-center justify-between border p-6 rounded-lg">
              <div className="flex-1">
                <DistributionList
                  distribution={data.distribution}
                  total={data.total}
                />
              </div>
              <div className="pl-6">
                <WriteReviewCTA productId={productId} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Interactive review list client-side */}
      <ReviewsClient initialReviews={data.reviews} />
    </section>
  );
}

/* -----------------------------
   SummaryCard (server rendered)
   ----------------------------- */
function SummaryCard({ summary }: any) {
  const average = (summary.average ?? 0).toFixed(2);
  const total = summary.total ?? 0;
  return (
    <div className="p-6 border rounded-lg">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-xl">
            <Stars value={Math.round(summary.average ?? 0)} />
            <span className="text-lg font-semibold">{average} out of 5</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Based on {total} reviews
          </div>
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Distribution list (server rendered)
   ----------------------------- */
function DistributionList({ distribution, total }: any) {
  // distribution expected as {5: n,4: n,3: n,2: n,1: n}
  return (
    <div className="grid grid-cols-1 gap-2">
      {[5, 4, 3, 2, 1].map((star) => {
        const count = distribution?.[star] ?? 0;
        const pct = total ? Math.round((count / total) * 100) : 0;
        return (
          <div key={star} className="flex items-center gap-3">
            <div className="w-24 flex items-center gap-2">
              <Stars value={star} compact />
            </div>
            <div className="flex-1 bg-gray-100 h-3 rounded overflow-hidden">
              <div style={{ width: `${pct}%` }} className="h-3 bg-black" />
            </div>
            <div className="w-8 text-right text-sm">{count}</div>
          </div>
        );
      })}
    </div>
  );
}

/* -----------------------------
   CTA write review (client) - simple placeholder
   ----------------------------- */
function WriteReviewCTA({ productId }: { productId: string | number }) {
  // This could open a shadcn Dialog with a form — for brevity we use a link-looking button
  return (
    <div>
      <a
        href={`/products/${productId}#write-review`}
        className="inline-block bg-black text-white px-6 py-3 rounded font-medium"
      >
        Write a review
      </a>
    </div>
  );
}
