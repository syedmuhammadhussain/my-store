import * as React from "react";
import { Star } from "lucide-react";

export function Rating({
  rating,
  size = "w-3 h-3",
  label,
}: {
  rating: number;
  size?: string;
  label?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
      className="flex items-center space-x-0.5"
    >
      {Array.from({ length: 5 }, (_, i) => {
        // const starValue = i + 1;
        const fillPercent = Math.min(Math.max(rating - i, 0), 1) * 100; // 0–100%

        return (
          <div key={i} className="relative">
            {/* Empty star (base) */}
            <Star className={`${size} text-black`} strokeWidth={1} />

            {/* Filled portion */}
            {fillPercent > 0 && (
              <Star
                className={`${size} text-black fill-black absolute top-0 left-0 overflow-hidden`}
                style={{
                  clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
                }}
                strokeWidth={1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
