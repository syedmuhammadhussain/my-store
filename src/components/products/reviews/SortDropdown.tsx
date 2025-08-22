"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

const sortOptions = [
  { label: "Newest first", value: "createdAt:desc" },
  { label: "Oldest first", value: "createdAt:asc" },
  { label: "Highest rating", value: "rating:desc" },
  { label: "Lowest rating", value: "rating:asc" },
];

export default function SortDropdown({ onChange, initial }: { onChange: (v: string) => void; initial: string }) {
  const [value, setValue] = useState(initial);

  return (
    <Select
      value={value}
      onValueChange={(v) => {
        setValue(v);
        onChange(v);
      }}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}