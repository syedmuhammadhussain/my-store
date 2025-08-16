import Image from "next/image";

// function cloudinaryLoader({ src, width }: { src: string; width: number }) {
//   const transform = [
//     `w_${Math.round(width)}`,
//     "c_fill",
//     "g_auto",
//     "f_auto",
//     "q_auto",
//   ].join(",");
//   return src.replace("/upload/", `/upload/${transform}/`);
// }

export default function ProductImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <Image
      // loader={cloudinaryLoader}
      src={src}
      alt={alt}
      fill
      sizes="
            (max-width: 400px) 30vw,
            (max-width: 640px) 50vw,
            (max-width: 1024px) 33vw,
            (max-width: 1536px) 25vw,
            50vw
        "
      placeholder="blur"
      blurDataURL={`${src.replace("/upload/", "/upload/w_20,q_20/")}`}
      className={className}
    />
  );
}
