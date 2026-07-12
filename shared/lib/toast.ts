import { toast } from "sonner";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import { createElement } from "react";

const iconProps = { className: "h-4 w-4", strokeWidth: 2.25 };

export const showToast = {
  success: (title: string, description?: string) =>
    toast.success(title, {
      description,
      icon: createElement(CheckCircle2, iconProps),
    }),

  error: (title: string, description?: string) =>
    toast.error(title, {
      description,
      icon: createElement(XCircle, iconProps),
    }),

  warning: (title: string, description?: string) =>
    toast.warning(title, {
      description,
      icon: createElement(AlertTriangle, iconProps),
    }),

  info: (title: string, description?: string) =>
    toast.info(title, {
      description,
      icon: createElement(Info, iconProps),
    }),
};
