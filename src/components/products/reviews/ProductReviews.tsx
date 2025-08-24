// components/reviews/ProductReviews.tsx
import { fetchReviewData } from "@/lib/reviews";
import ReviewSection from "./ReviewSection";

export default async function ProductReviews({
  productId,
}: {
  productId: number;
}) {
  const summary = await fetchReviewData(productId, "createdAt:desc");

  return (
    <ReviewSection
      productId={productId}
      initialSummary={summary.summary}
      initialReviews={summary.reviews}
    />
  );
}
