import {
  BookOpen,
  ClipboardCheck,
  Home,
  MessageCircle,
  User,
  UserRoundCheck,
} from "lucide-react";
import {
  PublicBottomNavItem,
  PublicQuickMenu,
} from "../types/public-home.type";

export const WHATSAPP_COMMUNITY_URL =
  "https://chat.whatsapp.com/ISI_LINK_COMMUNITY_KAMU";

export const publicQuickMenus: PublicQuickMenu[] = [
  {
    label: "Modul",
    href: "/modul",
    icon: BookOpen,
    colorClassName: "bg-primary/10",
    iconClassName: "text-primary",
  },
  {
    label: "Asisten",
    href: "#asisten",
    icon: UserRoundCheck,
    colorClassName: "bg-success/10",
    iconClassName: "text-success",
  },
  {
    label: "Assessment",
    href: "/assessment",
    icon: ClipboardCheck,
    colorClassName: "bg-warning/10",
    iconClassName: "text-warning",
    requiresAuth: true,
  },
  {
    label: "Info TP",
    href: WHATSAPP_COMMUNITY_URL,
    icon: MessageCircle,
    colorClassName: "bg-info/10",
    iconClassName: "text-info",
    isExternal: true,
  },
];

export const publicBottomNavItems: PublicBottomNavItem[] = [
  {
    label: "Home",
    href: "/",
    icon: Home,
    isLink: true,
  },
  {
    label: "Modul",
    href: "/modul",
    icon: BookOpen,
  },
  {
    label: "Assessment",
    href: "/assessment",
    icon: ClipboardCheck,
    isLink: true,
    requiresAuth: true,
  },
  {
    label: "Akun",
    href: "/account",
    icon: User,
    isLink: true,
    requiresAuth: true,
  },
];
