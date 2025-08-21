"use client";

import { Button } from "@/components/ui/button";

export default function ActionButtons({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-4 mb-2">
      <Button disabled={disabled} className="flex-auto sm:flex-1 bg-black text-white rounded">
        Add to Cart
      </Button>
      <Button variant="outline" disabled={disabled} className="flex-auto sm:flex-1 rounded">
        Buy It Now
      </Button>
    </div>
  );
}
