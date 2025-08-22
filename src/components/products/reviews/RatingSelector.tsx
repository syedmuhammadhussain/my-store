"use client";

import * as React from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function RatingSelector({
  value,
  onChange,
  max = 5,
  size = 24,
}: {
  value: number;
  onChange: (val: number) => void;
  max?: number;
  size?: number;
}) {
  const [hovered, setHovered] = React.useState<number | null>(null);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const filled =
          hovered != null ? starValue <= hovered : starValue <= value;
        return (
          <button
            key={starValue}
            type="button"
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onChange(starValue)}
            className="focus:outline-none cursor-pointer"
            aria-label={`${starValue} Star${starValue > 1 ? "s" : ""}`}
          >
            <Star
              className={cn(
                "transition-colors",
                filled ? "fill-yellow-400 text-yellow-400" : "text-black-300"
              )}
              width={size}
              height={size}
            />
          </button>
        );
      })}
    </div>
  );
}
