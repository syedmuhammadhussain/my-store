import Image from "next/image";

export default function ProductThumbnailImage({
  src,
  alt,
  className,
  width,
  height,
}: {
  src: string;
  alt?: string;
  className?: string;
  width?: number;
  height?: number;
}) {
  // you can replace with your Cloudinary loader or custom component
  return (
    <Image
      src={src}
      alt={alt ?? ""}
      width={width ?? 300}
      height={height ?? 300}
      className={className}
      priority={false}
      quality={85}
      sizes="
        (max-width: 400px) 80vw,
        (max-width: 640px) 100vw, 100px,
        (max-width: 1024px) 33vw,
        (max-width: 1536px) 25vw,
        50vw
      "
    />
  );
}
