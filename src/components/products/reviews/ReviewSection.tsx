"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ReviewSummary from "./ReviewSummary";
import ReviewsList from "./ReviewsList";
import ReviewDialog from "./ReviewDialog";
import ReviewSorting from "./ReviewSorting";
import { fetchReviewData } from "@/lib/reviews";

export default function ReviewSection({
  productId,
  initialSummary,
  initialReviews,
}: {
  productId: number;
  initialSummary: {
    average: number;
    total: number;
    distribution: Record<number, number>;
  };
  initialReviews: any[];
}) {
  const [summary, setSummary] = useState(initialSummary);
  const [reviews, setReviews] = useState(initialReviews);
  const [sort, setSort] = useState("createdAt:desc");

  async function refresh(s = sort) {
    const { summary, reviews } = await fetchReviewData(productId, s);
    setReviews(reviews);
    setSummary(summary);
  }

  return (
    <section className="px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="max-w-6xl mx-auto"
      >
        <ReviewSummary summary={summary} />
        <div className="flex flex-row items-center justify-between gap-4 my-6">
          <ReviewSorting
            initial={sort}
            onChange={(v) => {
              setSort(v);
              refresh(v);
            }}
          />
          <ReviewDialog
            productId={productId}
            onSuccess={async () => {
              await refresh();
            }}
          />
        </div>
        <ReviewsList reviews={reviews} />
      </motion.div>
    </section>
  );
}
