export interface Discount {
  id: number;
  documentId: string;
  description?: string;
  type: "percentage" | "fixed";
  value: string;
  start_date?: string;
  end_date?: string;
  createdAt: string;
  updatedAt: string;
}
