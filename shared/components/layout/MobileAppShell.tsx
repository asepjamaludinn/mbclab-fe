"use client";

import { Toaster } from "sonner";

type MobileAppShellProps = {
  children: React.ReactNode;
};

export function MobileAppShell({ children }: MobileAppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[480px] bg-white shadow-sm">
      {children}

      <Toaster
        position="top-center"
        expand={false}
        gap={12}
        closeButton
        toastOptions={{
          duration: 4000,
          unstyled: true,
          classNames: {
            toast: "app-toast",
            title: "app-toast-title",
            description: "app-toast-description",
            content: "app-toast-content",
            icon: "app-toast-icon",
            closeButton: "app-toast-close",
            actionButton: "app-toast-action",
            cancelButton: "app-toast-cancel",
            success: "app-toast--success",
            error: "app-toast--error",
            warning: "app-toast--warning",
            info: "app-toast--info",
          },
        }}
      />
    </div>
  );
}
