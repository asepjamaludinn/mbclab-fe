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
  FileCheck2,
  ShieldCheck,
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

type SidebarMenuDefinition = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

type SidebarMenuGroup = {
  label: string;
  menus: SidebarMenuDefinition[];
};

const MENU_GROUPS: SidebarMenuGroup[] = [
  {
    label: "Utama",
    menus: [
      { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Akademik",
    menus: [
      { label: "Modul", href: "/admin/modules", icon: BookOpen },
      { label: "Bank Soal", href: "/admin/questions", icon: HelpCircle },
      { label: "Sesi Ujian", href: "/admin/sessions", icon: ClipboardCheck },
      {
        label: "Pengumpulan TP",
        href: "/admin/submissions",
        icon: FileCheck2,
      },
      { label: "Nilai TA & TP", href: "/admin/grades", icon: FileText },
    ],
  },
  {
    label: "Manajemen Pengguna",
    menus: [
      { label: "Kelompok", href: "/admin/groups", icon: Layers },
      { label: "Praktikan", href: "/admin/students", icon: Users },
      {
        label: "Asisten Lab",
        href: "/admin/assistants",
        icon: UserRoundCheck,
      },
      {
        label: "Akun Asisten",
        href: "/admin/accounts",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Sistem",
    menus: [{ label: "Audit Log", href: "/admin/audit-logs", icon: History }],
  },
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

  const hasAccess = (href: string) => {
    const division = user?.division;

    if (division === "COORDINATOR") return true;

    if (division === "ACADEMIC") {
      const allowed = [
        "/admin/dashboard",
        "/admin/modules",
        "/admin/questions",
        "/admin/sessions",
        "/admin/submissions",
        "/admin/grades",
      ];
      return allowed.includes(href);
    }

    if (division === "PRACTICUM") {
      const allowed = [
        "/admin/dashboard",
        "/admin/sessions",
        "/admin/groups",
        "/admin/students",
        "/admin/submissions",
        "/admin/grades",
      ];
      return allowed.includes(href);
    }

    const allowedGeneral = [
      "/admin/dashboard",
      "/admin/sessions",
      "/admin/submissions",
      "/admin/grades",
    ];
    return allowedGeneral.includes(href);
  };

  const filteredMenuGroups = MENU_GROUPS.map((group) => ({
    ...group,
    menus: group.menus.filter((menu) => hasAccess(menu.href)),
  })).filter((group) => group.menus.length > 0);

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/60 bg-white/40 backdrop-blur-2xl"
    >
      <SidebarHeader>
        <div className="flex items-center justify-center py-3">
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

      <SidebarSeparator className="bg-white/50" />

      <SidebarContent className="px-2 py-2">
        {filteredMenuGroups.map((group) => (
          <SidebarGroup key={group.label} className="py-2">
            <SidebarGroupLabel className="font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-400 px-3 mb-1">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {group.menus.map((menu) => {
                  const Icon = menu.icon;
                  const isActive = pathname.startsWith(menu.href);

                  return (
                    <SidebarMenuItem key={menu.label}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={menu.label}
                        className={`h-11 rounded-2xl font-secondary text-sm font-medium tracking-tight transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : "text-grey-600 hover:bg-white/60 hover:text-grey-900"
                        }`}
                      >
                        <Link
                          href={menu.href}
                          className="flex items-center gap-3 px-3"
                        >
                          <Icon
                            strokeWidth={1.5}
                            className="h-4 w-4 shrink-0"
                          />
                          <span>{menu.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="bg-white/50" />

      <SidebarFooter className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 rounded-2xl border border-white/60 bg-white/50 p-2.5 text-left shadow-sm backdrop-blur-md transition-all duration-300 hover:bg-white/80 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:border-none group-data-[collapsible=icon]:bg-transparent">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/90 text-xs font-medium text-white shadow-sm backdrop-blur-md">
                {getInitials(user?.name || "A")}
              </div>

              <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-medium tracking-tight leading-tight text-grey-900">
                  {user?.name || "Administrator"}
                </p>
                <p className="mt-0.5 truncate font-secondary text-xs tracking-tight text-grey-500">
                  {user?.nim || "Asisten Laboratorium"}
                </p>
              </div>

              <ChevronsUpDown
                className="h-4 w-4 shrink-0 text-grey-400 group-data-[collapsible=icon]:hidden"
                strokeWidth={1.5}
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            side="top"
            align="end"
            className="w-[--radix-dropdown-menu-trigger-width] min-w-[220px] rounded-2xl border border-white/60 bg-white/80 p-1.5 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl"
          >
            <div className="flex items-center gap-3 px-2.5 py-2">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/90 text-xs font-medium text-white shadow-sm">
                {getInitials(user?.name || "A")}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium tracking-tight leading-tight text-grey-900">
                  {user?.name || "..."}
                </p>
                <p className="mt-0.5 truncate font-secondary text-xs tracking-tight text-grey-500">
                  {user?.nim || "..."}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="my-1 bg-white/50" />

            <DropdownMenuItem
              asChild
              className="rounded-xl font-medium tracking-tight text-grey-700 focus:bg-white/60 focus:text-primary"
            >
              <Link
                href="/admin/settings"
                className="cursor-pointer flex items-center gap-2 py-2 px-2.5"
              >
                <Settings strokeWidth={1.5} className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="my-1 bg-white/50" />

            <DropdownMenuItem
              variant="danger"
              onClick={handleLogout}
              className="rounded-xl font-medium tracking-tight text-error focus:bg-error/10 focus:text-error flex items-center gap-2 py-2 px-2.5 cursor-pointer"
            >
              <LogOut strokeWidth={1.5} className="h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
