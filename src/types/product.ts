import { StrapiResponse } from "./common";
import { Discount } from "./discount";
import { UploadedImage } from "./image";
import { SubCategoryAttributes } from "./sub_category";
import { ProductVariant } from "./variant";
import { ProductColors } from "./product_colors";

export interface ProductAttributes {
  id: number;
  documentId: string;
  name: string;
  description: string;
  slug: string;
  discount_price: number | null;
  price: number;
  is_feature: boolean;
  views: number;
  sales: number;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  images?: UploadedImage[];
  gallery?: UploadedImage[];
  variants?: ProductVariant[];
  sub_category?: SubCategoryAttributes;
  discount?: Discount;
  product_colors: ProductColors[];
}

export type SingleProductResponse = StrapiResponse<ProductAttributes>;
export type MultipleProductResponse = StrapiResponse<ProductAttributes[]>;
