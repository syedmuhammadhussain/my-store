import { SubCategoryAttributes } from "./sub_category";

export interface CategoryAttributes {
  id: number;
  name: string;
  slug: string;
  description?: string;
  sub_categories?: SubCategoryAttributes[];
}
