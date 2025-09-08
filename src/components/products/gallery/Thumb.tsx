// import StrapiImage from "@/components/StrapiImage";
import type { UploadedImage } from "@/types/image";
import { getBestImageFormat } from "@/lib/utils";
import ProductImage from "@/components/ProductImage";

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
      <ProductImage animation="none" src={thumb?.url} title={alt} imageClass="cursor-zoom-in" />
    </button>
  );
}
