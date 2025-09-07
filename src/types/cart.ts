// types/cart.ts
export type CurrencyCode = "PKR";

export type CartLine = {
  id: string; // stable per (product+variant)
  productId: string; // product.documentId
  variantId?: string; // variant.documentId
  title: string; // product.name
  variantTitle?: string; // size.label
  price: number; // unit price; using displayPrice
  currency: CurrencyCode;
  quantity: number;
  image: { src: string; alt: string };
  maxQty?: number; // inventory.quantity
  metadata?: Record<string, string | number | boolean>;
};

export type CartTotals = {
  subtotal: number;
  itemsCount: number;
  currency: CurrencyCode;
};

export type CartState = {
  lines: CartLine[];
  currency: CurrencyCode;
  cartId?: string;
  updatedAt?: number;
};
