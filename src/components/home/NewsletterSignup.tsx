// components/NewsletterSignup.tsx
"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
});

export function NewsletterSignup() {
  const [status, setStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: "", email: "" },
    mode: "onTouched",
  });

  async function onSubmit(values: z.infer<typeof FormSchema>) {
    try {
      setStatus("loading");
      // Replace with your actual endpoint
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to subscribe");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 2500);
    }
  }

  return (
    <section aria-label="Newsletter signup" className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Join our newsletter and get 10% off your first order
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Be the first to know about new drops, restocks, and exclusive offers.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="text-left sm:col-span-2">
                  <FormLabel>Your email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="jane@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
            <div className="sm:col-span-3">
              <Button
                type="submit"
                className="w-full"
                disabled={status === "loading"}
              >
                {status === "loading" ? "Signing up..." : "SIGN UP"}
              </Button>
              {status === "success" && (
                <p className="mt-2 text-sm text-green-600">
                  Thanks! Please check your inbox.
                </p>
              )}
              {status === "error" && (
                <p className="mt-2 text-sm text-red-600">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
