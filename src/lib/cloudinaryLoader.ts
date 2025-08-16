export default function cloudinaryLoader({
  src,
  width,
}: // quality,
{
  src: string;
  width: number;
  quality: number;
}) {
  const transform = [
    `w_${Math.round(width)}`,
    "c_fill",
    "f_auto",
    "q_auto",
  ].join(",");
  return src.replace("/upload/", `/upload/${transform}/`);
}
