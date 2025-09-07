import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

type Props = {
  loading?: boolean;
  className?: string;
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const QuickButton = forwardRef<HTMLButtonElement, Props>(
  ({ loading = false, className, onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        {...props}
        aria-label="Quick Buy"
        onClick={onClick}
        className={cn(
          `hidden lg:flex quickBuyBtn cursor-pointer absolute bottom-5 right-5 items-center justify-center 
          bg-white text-gray-900 rounded-sm w-10 h-10 overflow-hidden opacity-0 translate-y-4 transition-all duration-300 
          ease-out group-hover/product:opacity-100 group-hover/product:translate-y-0 hover:w-32 hover:px-3
          ${className}`,
          { "hover:w-10": loading }
        )}
      >
        {/* Icon or loading icon */}
        {loading ? (
          <Spinner variant="circle-filled" />
        ) : (
          <>
            <ShoppingCart className="h-5 w-5 flex-shrink-0" />
            <span className="ml-0 w-0 whitespace-nowrap opacity-0 transition-all duration-200 ease-in">
              Quick Buy
            </span>
          </>
        )}
      </button>
    );
  }
);

QuickButton.displayName = "QuickButton";
export default QuickButton;
