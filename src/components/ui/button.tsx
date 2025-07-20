import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "cursor-pointer inline-flex items-center justify-center select-none font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        blue3d: [
          "text-lg rounded-full",
          "bg-blue-500 text-white border border-blue-400",
          "shadow-[0_5px_0_0_#0552d1,0_12px_4px_0_#1b70f841]",
          "active:translate-y-1 active:shadow-none active:border-b-0",
        ].join(" "),
        white3d: [
          "text-lg rounded-full",
          "bg-white text-black border border-white-400",
          "shadow-[0_5px_0_0_#f8f8f8,0_12px_4px_0_#92929242]",
          "active:translate-y-1 active:shadow-none active:border-b-0",
        ].join(" "),
      },
      size: {
        default: "px-6 py-3",
        // sm: "px-3 py-2 text-sm",
        lg: "px-3 py-2 text-sm md:px-5 md:py-3 md:text-base",
        icon: "p-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);
Button.displayName = "Button";
