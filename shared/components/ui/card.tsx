import * as React from "react";
import { cn } from "@/shared/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "overflow-hidden rounded-[32px] border border-grey-200/60 bg-white p-6 shadow-sm transition-all duration-300",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
