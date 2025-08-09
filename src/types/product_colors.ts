import { ColorVariant } from "./color";
import { UploadedImage } from "./image";
import { ProductVariant } from "./variant";

export interface ProductColors {
  id: number;
  documentId: string;
  color: ColorVariant;
  images: UploadedImage[];
  swatch_image: UploadedImage;
  variants: ProductVariant[];
}
