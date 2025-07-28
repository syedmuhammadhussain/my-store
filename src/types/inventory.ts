/**
 * Inventory status enumeration
 */
export type InventoryStatus = "In Stock" | "Low Stock" | "Out of Stock";

/**
 * Base inventory interface
 */
export interface Inventory {
  id?: number;
  documentId?: string;
  label: string;
  quantity: number;
  low_stock_threshold: number;
  inventory_status: InventoryStatus;
  total_items?: string;
  location: string;
  restock_date?: Date | string | null;
  expiry_date?: Date | string | null;
  back_order_allowed: boolean;
  reserved_quantity: number;
  safety_stock: number;
  last_updated?: Date | string;
  notes?: string;
}
