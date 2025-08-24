import { Reviews } from "@/types/review";
import StrapiService from "./strapi.service";

export async function fetchReviewData(productId: number, sort: string) {
  const res = await StrapiService.getPublishedReviewsByProductId(productId, sort);
  const data = res.data as unknown as Reviews[];

  const reviews = data.map((r) => ({
    id: r.id,
    title: r.title,
    comment: r.comment,
    rating: r.rating,
    createdAt: r.createdAt,
    authorName: r.users_permissions_user?.username ?? r.username ?? "Anonymous",
    verified: !!r.users_permissions_user,
  }));

  const total = reviews.length;
  const average = total
    ? reviews.reduce((a, b) => a + (b.rating || 0), 0) / total
    : 0;
  const distribution = [5, 4, 3, 2, 1].reduce((acc, star) => {
    acc[star] = reviews.filter((r) => r.rating === star).length;
    return acc;
  }, {} as Record<number, number>);

  return {
    summary: { average, total, distribution },
    reviews,
  };
}
