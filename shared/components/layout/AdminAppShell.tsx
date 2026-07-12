"use client";

import React from "react";
import { Toaster } from "sonner";
import { AppSidebar } from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { IdleLogoutWatcher } from "./IdleLogoutWatcher";
import { useAdminRealtime } from "@/shared/hooks/use-admin-realtime";

type AdminAppShellProps = {
  children: React.ReactNode;
};

export function AdminAppShell({ children }: AdminAppShellProps) {
  useAdminRealtime();

  return (
    <SidebarProvider>
      <IdleLogoutWatcher />
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger />
        </header>

        <main className="flex-1 overflow-y-auto px-6 pb-6">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </SidebarInset>

      <Toaster
        position="bottom-right"
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
    </SidebarProvider>
  );
}
