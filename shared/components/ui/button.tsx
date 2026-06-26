import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[20px] font-secondary font-semibold transition-all active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-secondary shadow-[0_15px_30px_rgba(0,101,176,0.1)] hover:shadow-[0_15px_30px_rgba(0,101,176,0.2)]",
        secondary: "bg-secondary text-white hover:bg-secondary/80",
        outline:
          "border border-grey-200/60 bg-white hover:border-primary/20 hover:shadow-md text-grey-900",
        ghost: "bg-primary/10 text-primary hover:bg-primary hover:text-white",
        danger: "bg-error/10 text-error hover:bg-error/20",
      },
      size: {
        default: "px-6 py-4 text-sm",
        sm: "px-4 py-2.5 text-xs",
        lg: "px-8 py-5 text-base",
        icon: "h-12 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
