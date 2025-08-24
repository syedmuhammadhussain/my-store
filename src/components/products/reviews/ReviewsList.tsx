"use client";

import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";
import Stars from "./ReviewStars";
import { Reviews } from "@/types/review";

export default function ReviewsList({ reviews }: { reviews: Reviews[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;

  const totalPages = Math.ceil(reviews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedReviews = reviews.slice(startIndex, startIndex + pageSize);

  if (!reviews?.length) {
    return (
      <p className="text-center text-muted-foreground py-10">No reviews yet.</p>
    );
  }

  return (
    <div className="divide-y mt-10">
      <div className="space-y-4">
        {paginatedReviews.map((r, idx) => (
          <motion.article
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.28 }}
            className="py-6"
          >
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 md:h-12 md:w-12 text-xs md:text-base flex items-center justify-center bg-gray-200 rounded-full font-semibold">
                {(r.authorName || "U").charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <Stars value={r.rating} />
                    <span className="font-semibold text-xs md:text-base">
                      {r.authorName}
                    </span>
                    {r.verified && (
                      <span className="text-xs bg-black text-white px-2 py-0.5 rounded truncate">
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="text-xs md:text-sm text-muted-foreground">
                    {r.createdAt
                      ? new Date(r.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>

                {r.title && (
                  <h4 className="mt-2 font-semibold text-xs md:text-base">
                    {r.title}
                  </h4>
                )}
                {r.comment && (
                  <p className="mt-2 text-sm leading-6 text-xs md:text-base">
                    {r.comment}
                  </p>
                )}
              </div>
            </div>
          </motion.article>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.max(prev - 1, 1));
                  }}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
