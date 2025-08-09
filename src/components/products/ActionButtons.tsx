"use client";

import { Button } from "@/components/ui/button";

export default function ActionButtons({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex gap-4 mt-6 mb-2">
      <Button disabled={disabled} className="flex-1 bg-black text-white rounded">
        Add to Cart
      </Button>
      <Button variant="outline" disabled={disabled} className="flex-1 rounded">
        Buy It Now
      </Button>
    </div>
  );
}
