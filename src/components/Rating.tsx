// src/components/Rating.tsx
import * as React from 'react';
import { Star } from 'lucide-react';

export interface RatingProps {
  /** Numeric rating from 0 to 5 (fractional allowed) */
  rating: number;
  /** Tailwind size classes, e.g. "w-4 h-4" */
  size?: string;
  /** aria-label override */
  label?: string;
}

export function Rating({
  rating,
  size = 'w-4 h-4',
  label,
}: RatingProps) {
  const stars = [];
  const fullStars = Math.floor(rating);

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(
        <Star
          key={i}
          fill="text-black-500"
          className={size}
        />
      );
    } else {
      stars.push(
        <Star
          key={i}
          className={`${size} text-black-500`}
        />
      );
    }
  }

  return (
    <div
      role="img"
      aria-label={label ?? `${rating} out of 5 stars`}
      className="flex items-center space-x-0.5"
    >
      {stars}
    </div>
  );
}
