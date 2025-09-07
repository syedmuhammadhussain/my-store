// components/FeatureAndNewsletter.tsx
"use client";

import { Leaf, HeartHandshake, Sparkles } from "lucide-react";
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

const formSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Enter a valid email"),
});

export function FeatureAndNewsletter() {
  const features = [
    {
      icon: Leaf,
      title: "Luxurious Organic Comfort",
      subtitle: "Skin Friendly",
    },
    {
      icon: HeartHandshake,
      title: "Ethical & Sustainable Production",
      subtitle: "Made with Love",
    },
    {
      icon: Sparkles,
      title: "Trendy Prints & Cuts",
      subtitle: "Effortlessly Chic",
    },
  ];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12 space-y-12">
        {/* Features */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map(({ icon: Icon, title, subtitle }) => (
            <div
              key={title}
              className="flex items-start gap-4 rounded-lg border border-neutral-200 bg-neutral-50 p-6 hover:bg-white transition"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="text-sm text-neutral-600">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mx-auto max-w-2xl">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Join our newsletter & get 10% off
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Be the first to know about new drops, restocks, and exclusive
              offers.
            </p>
          </div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Your email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="jane@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="sm:col-span-3">
                SIGN UP
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
