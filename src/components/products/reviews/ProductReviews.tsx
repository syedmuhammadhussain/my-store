// components/reviews/ProductReviews.tsx
import { fetchReviewData } from "@/lib/reviews";
import ReviewSectionClient from "./ReviewSectionClient";

export default async function ProductReviews({
  productId,
  isLoggedIn,
}: {
  productId: number;
  isLoggedIn: boolean;
}) {
  const { summary, reviews } = await fetchReviewData(productId);

  return (
    <ReviewSectionClient
      productId={productId}
      isLoggedIn={isLoggedIn}
      initialSummary={summary}
      initialReviews={reviews}
    />
  );
}
