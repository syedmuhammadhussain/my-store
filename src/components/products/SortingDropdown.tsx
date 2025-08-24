// components/products/SortingDropdown.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

export default function SortingDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const current = searchParams.get("sort") ?? SORT_OPTIONS[0].value;
  const [position, setPosition] = useState(current);

  useEffect(() => {
    setPosition(current);
  }, [current]);

  const onChange = (sort: string) => {
    setPosition(sort);
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", sort);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="focus-visible:shadow-none p-0 border-0 text-black ml-2 md:bg-white md:hover:bg-white"
        >
          Sort by &nbsp; <MoveDown size="14" />
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
  );
}
