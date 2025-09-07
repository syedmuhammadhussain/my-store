// components/AvatarWithBadge.jsx
import React from "react";
import ProductThumbnailImage from "@/components/products/gallery/ProductThumbnailImage";

interface Props {
  src: string;
  alt?: string;
  count?: number;
  size?: "md" | "sm" | "lg";
  className?: string;
}

export default function AvatarWithBadge({
  src,
  alt = "Avatar",
  count = 0,
  size = "md", // "sm" | "md" | "lg"
  className = "",
}: Props) {
  const sizes = {
    sm: { avatar: "w-8 h-8", badge: "w-4 h-4 text-[10px]" },
    md: { avatar: "w-12 h-12", badge: "w-5 h-5 text-xs" },
    lg: { avatar: "w-16 h-16", badge: "w-6 h-6 text-sm" },
  };

  const chosen = sizes[size] || sizes.md;
  const show = Number(count) > 0;
  const display = Number(count) > 99 ? "99+" : String(count);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Avatar */}
      <ProductThumbnailImage
        src={src}
        alt={alt}
        width={100}
        height={90}
        className="object-cover rounded h-[90px] w-[100px]"
      />

      {/* Badge */}
      {show && (
        <span
          role="status"
          aria-label={`Notifications: ${display}`}
          className={`
            absolute -top-0 -right-0 
            translate-x-1/3 -translate-y-1/3
            flex items-center justify-center
            rounded-full
            bg-black/60 text-white font-semibold
            ${chosen.badge}
            ring-2 ring-white shadow-md
            select-none
          `}
        >
          {display}
        </span>
      )}
    </div>
  );
}
