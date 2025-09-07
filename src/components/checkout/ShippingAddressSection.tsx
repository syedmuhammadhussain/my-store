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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

type Props = {
  control: Control<CheckoutFormValues>;
  setCountry: (val: string) => void;
  currentCountry: string;
};

function ShippingAddressSectionBase({
  control,
  setCountry,
  currentCountry,
}: Props) {
  return (
    <motion.div variants={fadeContainer} className="space-y-4">
      <h2 className="text-lg font-medium">Shipping address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Syed" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        {/* <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Ali" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div> */}
      </div>

      <motion.div variants={fadeItem}>
        <FormField
          control={control}
          name="address1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="House, street, area" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <motion.div variants={fadeItem}>
        <FormField
          control={control}
          name="address2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apartment, suite, etc. (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apt, floor, unit" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="Karachi" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="country"
            render={() => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={currentCountry}
                    onValueChange={setCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem defaultValue="1" value="1">
                        Pakistan
                      </SelectItem>
                      {/* <SelectItem value="US">United States</SelectItem> */}
                      {/* <SelectItem value="GB">United Kingdom</SelectItem> */}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
        {/* <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <Input placeholder="Sindh" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div> */}
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal code</FormLabel>
                <FormControl>
                  <Input placeholder="74000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div>

      {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={fadeItem}>
          <FormField
            control={control}
            name="country"
            render={() => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Select
                    defaultValue={currentCountry}
                    onValueChange={setCountry}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Pakistan</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </motion.div>
      </div> */}
    </motion.div>
  );
}

export default memo(ShippingAddressSectionBase);
