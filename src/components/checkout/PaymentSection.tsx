"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";
import { CheckoutFormValues, fadeItem, fadeContainer } from "@/types/checkout";
import { FormField, FormItem, FormControl, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

type Props = { control: Control<CheckoutFormValues> };

function PaymentSectionBase({ control }: Props) {
  return (
    <motion.div variants={fadeContainer} className="space-y-4">
      <h2 className="text-lg font-medium">Payment</h2>

      <motion.div variants={fadeItem}>
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">
                  <label className="flex items-center justify-between border rounded-md p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="COD" />
                      <span className="text-sm">Cash on Delivery</span>
                    </div>
                    <span className="text-sm text-gray-500">No fees</span>
                  </label>
                  <label className="flex items-center justify-between border rounded-md p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="Credit Card" />
                      <span className="text-sm">Credit/Debit Card</span>
                    </div>
                    <span className="text-sm text-gray-500">Via secure gateway</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={fadeItem}>
        <FormField
          control={control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Order notes (optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Any special instructions?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default memo(PaymentSectionBase);
