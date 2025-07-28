import { UploadedImage } from "./image";
import { MultipleProductResponse } from "./product";

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sub_categories?: SubCategoryAttributes[];
}

export interface SubCategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: UploadedImage;
  products?: MultipleProductResponse;
}
