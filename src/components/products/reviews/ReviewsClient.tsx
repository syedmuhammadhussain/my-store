// src/components/reviews/ReviewsClient.tsx
"use client";

import React, { useState, useMemo } from "react";
import Stars from "./Stars"; // adjust path if needed

export function ReviewsClient({ initialReviews }: { initialReviews: any[] }) {
  const [reviews, setReviews] = useState(initialReviews ?? []);
  const [sort, setSort] = useState("newest");

  const sorted = useMemo(() => {
    if (sort === "newest")
      return [...reviews].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
    if (sort === "oldest")
      return [...reviews].sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
    if (sort === "highest")
      return [...reviews].sort((a, b) => b.rating - a.rating);
    if (sort === "lowest")
      return [...reviews].sort((a, b) => a.rating - b.rating);
    return reviews;
  }, [reviews, sort]);

  return (
    <div className="mt-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <SortControl value={sort} onChange={(v: any) => setSort(v)} />
      </div>

      <div className="divide-y">
        {sorted.map((r: any) => (
          <ReviewItem key={r.id} review={r} />
        ))}
        {sorted.length === 0 && (
          <div className="p-6 text-center text-sm text-muted-foreground">
            No reviews yet.
          </div>
        )}
      </div>
    </div>
  );
}

function SortControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded p-1"
    >
      <option value="newest">Newest</option>
      <option value="oldest">Oldest</option>
      <option value="highest">Highest Rating</option>
      <option value="lowest">Lowest Rating</option>
    </select>
  );
}

function ReviewItem({ review }: { review: any }) {
  // author can be an object {name, verified} or a string
  const authorName =
    typeof review.author === "string"
      ? review.author
      : review.author?.name ?? "Anonymous";

  const isVerified =
    typeof review.author === "object" && !!review.author?.verified;

  // createdAt might be a string or Date; guard it
  const createdAtStr = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString()
    : "";

  return (
    <article className="py-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          {/* simple initials avatar */}
          <div className="h-12 w-12 rounded bg-gray-100 flex items-center justify-center text-xl">
            {authorName?.charAt(0)?.toUpperCase() ?? "U"}
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <Stars value={review.rating} />
              <div className="font-semibold">{authorName}</div>
              {isVerified && (
                <span className="mb-2 sm:mb-0 sm:ml-2 text-xs bg-black text-white px-2 py-0.5 rounded">
                  Verified
                </span>
              )}
            </div>

            <div className="text-sm text-muted-foreground">{createdAtStr}</div>
          </div>

          {review.title && <h4 className="mt-3 font-semibold">{review.title}</h4>}
          <p className="mt-2 text-sm text-gray-foreground">{review.body}</p>
        </div>
      </div>
    </article>
  );
}
