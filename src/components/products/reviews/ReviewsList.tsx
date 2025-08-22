"use client";

import { motion } from "framer-motion";
import Stars from "./Stars";

export default function ReviewsList({ reviews }: { reviews: any[] }) {
  if (!reviews?.length) {
    return (
      <p className="text-center text-muted-foreground py-10">No reviews yet.</p>
    );
  }

  return (
    <div className="divide-y mt-10">
      {reviews.map((r, idx) => (
        <motion.article
          key={r.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.04, duration: 0.28 }}
          className="py-6"
        >
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 flex items-center justify-center bg-gray-200 rounded-full font-semibold">
              {(r.authorName || "U").charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <Stars value={r.rating} />
                  <span className="font-semibold">{r.authorName}</span>
                  {r.verified && (
                    <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : ""}
                </div>
              </div>

              {r.title && <h4 className="mt-2 font-semibold">{r.title}</h4>}
              {r.comment && (
                <p className="mt-2 text-sm leading-6">{r.comment}</p>
              )}
            </div>
          </div>
        </motion.article>
      ))}
    </div>
  );
}
