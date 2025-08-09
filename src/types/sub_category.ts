import { CategoryAttributes } from "./category";

export interface SubCategoryAttributes {
  id: number;
  documentId: string;
  name: string;
  slug: string;
  label: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  category?: CategoryAttributes;
}
