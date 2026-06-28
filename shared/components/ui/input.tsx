import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconClassName, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon && (
          <div
            className={cn(
              "pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-4",
              iconClassName || "text-primary",
            )}
          >
            {icon}
          </div>
        )}

        <input
          type={type}
          className={cn(
            "w-full rounded-2xl border border-grey-200 bg-grey-50 py-3 pr-4 font-secondary text-sm text-grey-900 transition-all placeholder:text-grey-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10",
            icon ? "pl-11" : "pl-4",
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
