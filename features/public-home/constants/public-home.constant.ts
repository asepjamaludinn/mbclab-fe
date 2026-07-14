import {
  BookOpen,
  ClipboardCheck,
  Home,
  MessageCircle,
  User,
  UserRoundCheck,
  BookOpenCheck,
  UsersRound,
} from "lucide-react";
import {
  PublicBottomNavItem,
  PublicQuickMenu,
  HeroCard,
} from "../types/public-home.type";

export const WHATSAPP_COMMUNITY_URL =
  "https://whatsapp.com/channel/0029VarRUTBCBtxCncujA53v";

export const OA_LINE_MBC_LAB_URL = "https://line.me/R/ti/p/@mbclab";
export const SPS_URL = "https://igracias.telkomuniversity.ac.id/";

export const HERO_CARDS: HeroCard[] = [
  {
    title: "Modul",
    description: "Materi",
    href: "/modul",
    icon: BookOpenCheck,
    iconClassName: "bg-primary text-white",
  },
  {
    title: "Assessment",
    description: "TP & TA",
    href: "/assessment",
    icon: ClipboardCheck,
    iconClassName: "bg-warning text-white",
  },
  {
    title: "Asisten",
    description: "Tim lab",
    href: "#asisten",
    icon: UserRoundCheck,
    iconClassName: "bg-secondary text-white",
  },
  {
    title: "Kelompok",
    description: "Info SPS",
    href: "#kelompok",
    icon: UsersRound,
    iconClassName: "bg-info text-white",
  },
  {
    title: "Kontak",
    description: "OA LINE",
    href: OA_LINE_MBC_LAB_URL,
    icon: MessageCircle,
    iconClassName: "bg-success text-white",
    isExternal: true,
  },
];

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
