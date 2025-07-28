import { StrapiResponse } from "./common";
import { Discount } from "./discount";
import { UploadedImage } from "./image";
import { SubCategory } from "./sub_category";
import { ProductVariant } from "./variant";

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
  variants?: ProductVariant[];
  sub_category?: SubCategory;
  discount?: Discount;
}

export type SingleProductResponse = StrapiResponse<ProductAttributes>;
export type MultipleProductResponse = StrapiResponse<ProductAttributes[]>;
