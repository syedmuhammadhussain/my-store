import { ColorVariant } from "./color";
import { UploadedImage } from "./image";
import { Inventory } from "./inventory";
import { ProductColors } from "./product_colors";
import { SizeType } from "./size";

export interface ProductVariant {
  id: number;
  documentId: string;
  size: string;
  sku: string;
  price: number;
  basePrice: number | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  inventory: Inventory;
  images: UploadedImage[];
  color: ColorVariant;
  product_colors: ProductColors[];
  colorId: number;
  colorName: string;
  sizeObj?: SizeType;        // add this if you don’t want to change the name
  size_rel?: SizeType;       // or name it `size` if you replace the enum
}
