import Stars from "./Stars";

/* -----------------------------
   ReviewItem (client)
   ----------------------------- */
export default function ReviewItem({ review }: { review: any }) {
  // review: { id, rating, title, body, author: { name, avatar, verified }, createdAt }
  const created = new Date(review.createdAt).toLocaleDateString();
  return (
    <article className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xl">
            {review.author?.name?.[0] ?? "U"}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Stars value={review.rating} />
              <div className="font-semibold">
                {review.author?.name ?? "Anonymous"}
              </div>
              {review.author?.verified && (
                <span className="ml-2 text-xs bg-teal-900 text-white px-2 py-0.5 rounded">
                  Verified
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{created}</div>
          </div>

          {review.title && (
            <h4 className="mt-3 font-semibold">{review.title}</h4>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{review.body}</p>
        </div>
      </div>
    </article>
  );
}
