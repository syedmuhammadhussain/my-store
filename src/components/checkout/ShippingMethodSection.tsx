"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { Control } from "react-hook-form";
import { CheckoutFormValues, fadeItem, fadeContainer } from "@/types/checkout";
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Props = { control: Control<CheckoutFormValues> };

function ShippingMethodSectionBase({ control }: Props) {
  return (
    <motion.div variants={fadeContainer} className="space-y-4">
      <h2 className="text-lg font-medium">Shipping method</h2>
      <motion.div variants={fadeItem}>
        <FormField
          control={control}
          name="shippingMethod"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup value={field.value} onValueChange={field.onChange} className="grid gap-3">
                  <label className="flex items-center justify-between border rounded-md p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="standard" />
                      <span className="text-sm">Standard (3–6 days)</span>
                    </div>
                    <span className="text-sm">Free</span>
                  </label>
                  <label className="flex items-center justify-between border rounded-md p-3 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="express" />
                      <span className="text-sm">Express (1–2 days)</span>
                    </div>
                    <span className="text-sm">Rs. 499</span>
                  </label>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>
    </motion.div>
  );
}

export default memo(ShippingMethodSectionBase);
