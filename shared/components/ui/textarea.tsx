import * as React from "react";
import { cn } from "@/shared/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "w-full rounded-2xl border border-grey-200 bg-grey-50 px-4 py-3 font-secondary text-sm text-grey-900 transition-all placeholder:text-grey-400 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
