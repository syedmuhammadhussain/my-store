// types/filters.ts
import { SizeType } from "./size";

export interface Filters {
  price: [number, number];
  sizes: SizeType[];
  inStock: boolean;
  outOfStock: boolean;
  onSale: boolean;
}

export interface FilterSidebarProps {
  initialCount: number;
  category: string;
  filters: {
    inStock: boolean;
    outOfStock: boolean;
    price: [number, number];
    sizes: string[];
  };
  onFiltersChange: (next: FilterSidebarProps["filters"]) => void;
}
