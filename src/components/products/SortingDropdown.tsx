// src/components/products/SortingDropdown.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
// import qs from "qs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { MoveDown } from "lucide-react";

const SORT_OPTIONS = [
  { label: "Featured", value: "sequence_order:asc" },
  { label: "Best selling", value: "sold:desc" },
  { label: "A → Z", value: "name:asc" },
  { label: "Z → A", value: "name:desc" },
  { label: "Price, low → high", value: "price:asc" },
  { label: "Price, high → low", value: "price:desc" },
  { label: "Date, old → new", value: "createdAt:asc" },
  { label: "Date, new → old", value: "createdAt:desc" },
];

export function SortingDropdown() {
  const [position] = useState("Featured");
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // const current = searchParams.get("sort") ?? SORT_OPTIONS[0].value;

  const onChange = (sort: string) => {
    const params = Object.fromEntries(searchParams.entries());
    params.sort = sort ?? SORT_OPTIONS[0].value;

    // const query = qs.stringify(params, { encodeValuesOnly: false });
    router.push(`${pathname}?${params.sort}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="focus-visible:shadow-none p-0 border-0 text-black ml-2 bg-white hover:bg-white"
        >
          Sort by &nbsp;
          <MoveDown size="14" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={position} onValueChange={onChange}>
          {SORT_OPTIONS.map((opt) => (
            <DropdownMenuRadioItem value={opt.value} key={opt.value}>
              {opt.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
    // <select
    //   value={current}
    //   onChange={onChange}
    //   className="px-3 py-2 border rounded-md bg-white"
    // >
    //   {SORT_OPTIONS.map((opt) => (
    //     <option key={opt.value} value={opt.value}>
    //       {opt.label}
    //     </option>
    //   ))}
    // </select>
  );
}
