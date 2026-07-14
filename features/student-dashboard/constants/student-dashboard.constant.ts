import {
  BookOpen,
  ClipboardCheck,
  UserRoundCheck,
  MessageCircle,
} from "lucide-react";

export const WHATSAPP_COMMUNITY_URL =
  "https://whatsapp.com/channel/0029VarRUTBCBtxCncujA53v";

export const DASHBOARD_QUICK_ACCESS_ITEMS = [
  {
    title: "Modul",
    href: "/student/modules",
    icon: BookOpen,
  },
  {
    title: "Asisten",
    href: "#asisten",
    icon: UserRoundCheck,
  },

  {
    title: "Assessment",
    href: "/student/assessment",
    icon: ClipboardCheck,
  },
  {
    title: "Info TP",
    href: WHATSAPP_COMMUNITY_URL,
    icon: MessageCircle,
    isExternal: true,
  },
];
