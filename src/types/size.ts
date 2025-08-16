export type SizeType = {
  id: number;
  label: string; // "S", "M", "2-3Y", "One Size"
  code?: string | null;
  sort_order: number; // 1,2,3… or 23 for 2-3Y, etc.
};

export interface SizeGroup {
  id: number;
  name: string; // "Adult Alpha", "Kids Age", "One Size"
  slug: string;
  type: "alpha" | "numeric" | "age" | "standard";
  sizes: SizeType[];
}
