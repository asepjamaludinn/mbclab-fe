"use client";

import React from "react";
import { AppSidebar } from "./AppSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { IdleLogoutWatcher } from "./IdleLogoutWatcher";

type AdminAppShellProps = {
  children: React.ReactNode;
};

export function AdminAppShell({ children }: AdminAppShellProps) {
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
    </SidebarProvider>
  );
}
