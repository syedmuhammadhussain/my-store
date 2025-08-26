import Image from "next/image";

export default function StrapiImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="
        (max-width: 400px) 70vw,
        (max-width: 640px) 70vw,
        (max-width: 1024px) 50vw, 50vw,
        (max-width: 1536px) 25vw,
        50vw
      "
      placeholder="blur"
      blurDataURL={`${src.replace("/upload/", "/upload/w_20,q_20/")}`}
      className={className}
      quality={90}
    />
  );
}
