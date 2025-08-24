"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuantityDropdown() {
  const [quantity, setQuantity] = useState("1"); // Default to first item

  return (
    <div className="mb-12">
      <small className="uppercase text-xs font-medium mb-2 block">Quantity</small>

      <Select value={quantity} onValueChange={setQuantity}>
        <SelectTrigger size="sm" className="w-[128px] border-gray-300 hover:border-black">
          <SelectValue>
            {quantity} {/* Show selected value */}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="text-red">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "10+"].map((q) => (
            <SelectItem key={q} value={q}>
              {" "}
              {/* Remove onChange here */}
              {q}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
