import { ShoppingCart } from "lucide-react";

type Props = {
  label: string;
  className?: string;
};

export default function QuickButton({ label, className }: Props) {
  return (
    <button
      aria-label="Quick Buy"
      className={`hidden lg:flex quickBuyBtn cursor-pointer absolute bottom-5 right-5 items-center justify-center 
        bg-white text-gray-900 rounded-sm w-10 h-10 overflow-hidden opacity-0 translate-y-4 transition-all duration-300 
        ease-out group-hover/product:opacity-100 group-hover/product:translate-y-0 hover:w-32 hover:px-3
        ${className}
      `}
    >
      <ShoppingCart className="h-5 w-5 flex-shrink-0" />
      <span className="ml-0 w-0 whitespace-nowrap opacity-0 transition-all duration-200 ease-in">
        {label}
      </span>
    </button>
  );
}
