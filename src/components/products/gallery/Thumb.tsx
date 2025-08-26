import StrapiImage from "@/components/StrapiImage";
import type { UploadedImage } from "@/types/image";
import { getBestImageFormat } from "@/lib/utils";

interface ThumbProps {
  img: UploadedImage;
  alt: string;
  onClick: () => void;
}

export function Thumb({ img, alt, onClick }: ThumbProps) {
  const thumb = getBestImageFormat(img);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Open image ${alt}`}
      className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
    >
      <StrapiImage
        src={thumb?.url}
        alt={alt}
        className="object-contain w-full h-full cursor-zoom-in"
      />
    </button>
  );
}
