import { Variants } from "framer-motion";
import { z } from "zod";

export const CheckoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(7, "Enter a valid phone"),

  fullName: z.string().min(1, "Required"),
  //   lastName: z.string().min(1, "Required"),
  address1: z.string().min(3, "Required"),
  address2: z.string().optional(),
  city: z.string().min(1, "Required"),
  postalCode: z.string().min(3, "Required"),
  country: z.string().min(1, "Required"),
  // state: z.string().min(1, "Required"),

  notes: z.string().optional(),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum([
    "COD",
    "Credit Card",
    "PayPal",
    "Apple Pay",
    "Stripe",
    "ACH",
  ]),
});

export type CheckoutFormValues = z.infer<typeof CheckoutSchema>;

// Animation variants (keep identical across sections)
export const fadeContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

export const fadeItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

export const defaultValues = {
  email: "",
  phone: "",
  fullName: "",
  address1: "",
  address2: "",
  city: "",
  postalCode: "",
  country: "1",
  notes: "",
  shippingMethod: "standard",
  paymentMethod: "COD",
};
