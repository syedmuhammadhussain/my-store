"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";
import { CheckoutFormValues, fadeItem, fadeContainer } from "@/types/checkout";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

type Props = { control: Control<CheckoutFormValues> };

function ContactSectionBase({ control }: Props) {
  return (
    <motion.div variants={fadeContainer} className="space-y-4">
      <h2 className="text-lg font-medium">Contact</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+92 3xx xxxxxxx" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

export default memo(ContactSectionBase);
