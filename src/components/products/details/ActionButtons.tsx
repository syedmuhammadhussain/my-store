"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export default function ActionButtons({
  disabled,
  onClick,
  loading,
}: {
  disabled: boolean;
  onClick: () => void;
  loading: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-4 mb-2">
      <Button
        disabled={disabled || loading}
        size="lg"
        className="flex-auto sm:flex-1 bg-black text-white rounded"
        onClick={onClick}
      >
        {loading ? <Spinner variant="ellipsis" /> : "Add to Cart"}
      </Button>
      <Button
        disabled={disabled}
        size="lg"
        variant="outline"
        className="flex-auto sm:flex-1 rounded"
      >
        Buy It Now
      </Button>
    </div>
  );
}
