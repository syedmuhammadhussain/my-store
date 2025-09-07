"use client";

import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  CheckoutSchema,
  CheckoutFormValues,
  fadeContainer,
  fadeItem,
  defaultValues,
} from "@/types/checkout";

import ContactSection from "@/components/checkout/ContactSection";
import ShippingAddressSection from "@/components/checkout/ShippingAddressSection";
import ShippingMethodSection from "@/components/checkout/ShippingMethodSection";
import PaymentSection from "@/components/checkout/PaymentSection";
import OrderSummary from "@/components/checkout/OrderSummary";

import { useCartStore } from "@/stores/useCartStore";
import { redirect } from "next/navigation";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const items = useCartStore((s) => s.items);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(CheckoutSchema),
    defaultValues: {
      ...defaultValues,
      shippingMethod: "standard",
      paymentMethod: "COD",
    },
    mode: "onTouched",
  });

  // Prefill if logged in
  useEffect(() => {
    if (session?.user?.email) {
      // Option 1: Use session data directly if it has phone/username
      form.reset({
        email: session.user.email,
        phone: session.user.phone,
        fullName: session.user.username,
      });
    }

    // Option 2: Fetch /api/users/me for full profile
    // const fetchProfile = async () => {
    //     debugger
    //   try {
    //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/me`, {
    //       headers: { Authorization: `Bearer ${(session?.user as any)?.accessToken ?? ""}` },
    //     });
    //     if (!res.ok) return;
    //     const data = await res.json();
    //     form.setValue("email", data.email || "");
    //     form.setValue("phone", data.phone || "");
    //     if (data.username) {
    //       const [first, ...rest] = data.username.split(" ");
    //       form.setValue("fullName", first);
    //       form.setValue("lastName", rest.join(" "));
    //     }
    //   } catch (err) {
    //     console.error("Failed to fetch profile", err);
    //   }
    // };

    // if (session) {
    //   fetchProfile();
    // }
  }, [session, form]);

  const onSubmit = async (data: CheckoutFormValues) => {
    debugger;
    const orderItems = items.map((it) => ({
      quantity: it.quantity,
      product: it.productId,
      variant_sku: it.sku,
      variant: it.variantId,
    }));

    const payload = {
      data: {
        payment_method: data.paymentMethod,
        address: {
          address_line1: data.address1,
          address_line2: data.address2,
          postal_code: data.postalCode,
          phone_number: data.phone,
          country: parseInt(data.country),
          city: data.city,
          is_default: true,
        },
        order_items: orderItems,
      },
    };

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_BASE_URL}/api/orders`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: session ? `Bearer ${session.jwt}` : "",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) return;

    const json = await response.json();

    console.log(json);

    toast.success("Order has been created", {
      className: "bg-card text-card-foreground border-border",
    });

    form.reset({});

    setTimeout(() => redirect("/"), 200);
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <motion.div
        variants={fadeContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        {/* Left: form */}
        <motion.section
          variants={fadeItem}
          className="bg-white border rounded-lg p-6"
        >
          <h1 className="text-2xl font-semibold mb-1">Checkout</h1>
          <p className="text-sm text-gray-500 mb-6">
            We’ll use this info to fulfill your order.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <ContactSection control={form.control} />
              <div className="my-4 h-px bg-gray-200" />
              <ShippingAddressSection
                control={form.control}
                currentCountry={form.getValues("country")}
                setCountry={(val) =>
                  form.setValue("country", val, { shouldValidate: true })
                }
              />
              <div className="my-4 h-px bg-gray-200" />
              <ShippingMethodSection control={form.control} />
              <div className="my-4 h-px bg-gray-200" />
              <PaymentSection control={form.control} />

              <div className="flex items-center justify-between pt-2">
                <p className="text-xs text-gray-500">
                  By placing the order you agree to our Terms & Privacy Policy.
                </p>
                <Button
                  type="submit"
                  className="bg-black text-white"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Processing..."
                    : "Place order"}
                </Button>
              </div>
            </form>
          </Form>
        </motion.section>

        {/* Right: summary */}
        <OrderSummary control={form.control} />
      </motion.div>
    </main>
  );
}
