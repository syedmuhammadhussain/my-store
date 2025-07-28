import { ColorVariant } from "./color";
import { UploadedImage } from "./image";
import { Inventory } from "./inventory";

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
}
