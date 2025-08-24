"use client";

import { Button } from "@/components/ui/button";

export default function ActionButtons({ disabled }: { disabled: boolean }) {
  return (
    <div className="flex flex-wrap gap-4 mb-2">
      <Button disabled={disabled} size="lg" className="flex-auto sm:flex-1 bg-black text-white rounded">
        Add to Cart
      </Button>
      <Button disabled={disabled} size="lg" variant="outline" className="flex-auto sm:flex-1 rounded">
        Buy It Now
      </Button>
    </div>
  );
}
