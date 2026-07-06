"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Layers,
  ClipboardCheck,
  HelpCircle,
  FileText,
  Settings,
  LogOut,
  ChevronsUpDown,
  UserRoundCheck,
  History,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { authService, useProfile } from "@/features/auth";
import { getInitials } from "@/shared/utils/string";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/shared/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

const MAIN_MENUS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Modul", href: "/admin/modules", icon: BookOpen },
  { label: "Bank Soal", href: "/admin/questions", icon: HelpCircle },
  { label: "Kelompok", href: "/admin/groups", icon: Layers },
  { label: "Praktikan", href: "/admin/students", icon: Users },
  { label: "Sesi Ujian", href: "/admin/sessions", icon: ClipboardCheck },
  { label: "Nilai & TP", href: "/admin/grades", icon: FileText },
  { label: "Asisten Lab", href: "/admin/assistants", icon: UserRoundCheck },
  { label: "Audit Log", href: "/admin/audit-logs", icon: History },
];

export function AppSidebar() {
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { data: user } = useProfile("ADMIN");

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error("Gagal memanggil endpoint logout:", err);
    } finally {
      queryClient.clear();

      window.location.href = "/login/admin";
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center justify-center py-2">
          <Image
            src="/images/logo_utama.svg"
            alt="Logo"
            width={125}
            height={34}
            priority
            className="h-9 w-auto group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/images/logo_utama.svg"
            alt="Logo"
            width={28}
            height={28}
            className="hidden h-7 w-7 object-contain group-data-[collapsible=icon]:block"
          />
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_MENUS.map((menu) => {
                const Icon = menu.icon;
                const isActive = pathname.startsWith(menu.href);

                return (
                  <SidebarMenuItem key={menu.label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={menu.label}
                    >
                      <Link href={menu.href}>
                        <Icon strokeWidth={2} />
                        <span>{menu.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition hover:bg-grey-100 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {getInitials(user?.name || "A")}
              </div>

              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold leading-tight text-grey-900">
                  {user?.name || "Administrator"}
                </p>
                <p className="mt-0.5 truncate text-xs text-grey-500">
                  {user?.nim || "Asisten Laboratorium"}
                </p>
              </div>

              <ChevronsUpDown className="h-4 w-4 shrink-0 text-grey-400 group-data-[collapsible=icon]:hidden" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[220px]"
          >
            <div className="flex items-center gap-3 px-2.5 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                {getInitials(user?.name || "A")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold leading-tight text-grey-900">
                  {user?.name || "..."}
                </p>
                <p className="mt-0.5 truncate text-xs text-grey-500">
                  {user?.nim || "..."}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <Settings strokeWidth={2} />
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="danger" onClick={handleLogout}>
              <LogOut strokeWidth={2} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
