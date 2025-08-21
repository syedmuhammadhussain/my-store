import Image from "next/image";

export default function ProductSliderImage({
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
      sizes="
        (max-width: 400px) 30vw,
        (max-width: 640px) 50vw,
        (max-width: 1024px) 33vw,
        (max-width: 1536px) 25vw,
        50vw
    "
    />
  );
}
