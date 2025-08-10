"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Box, X } from "lucide-react";

type Props = {
  onClearFilters?: () => void;
  viewAllHref?: string;
};

export default function EmptyProductState({ onClearFilters, viewAllHref = "/" }: Props) {
  return (
    <div className="w-full flex items-center justify-center py-12 px-4">
      <div className="text-center max-w-lg">
        <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
          <Box className="w-8 h-8 text-gray-400" />
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-sm text-gray-600 mb-4">
          Try clearing filters or browse other product.
        </p>

        {/* <div className="flex items-center justify-center gap-2">
          <Link href={viewAllHref}>
            <Button variant="default" className="px-4 py-2">
              View all
            </Button>
          </Link>

          {onClearFilters && (
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 px-3 py-2 border rounded-md text-sm text-gray-700 hover:bg-gray-50"
              aria-label="Clear filters"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
}
