import { LucideIcon } from "lucide-react";

export type PublicAssistant = {
  id: string;
  name: string;
  role: string;
  photoUrl?: string;
};

export type PublicModule = {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
  fileUrl: string;
};

export type PublicQuickMenu = {
  label: string;
  href: string;
  icon: LucideIcon;
  colorClassName: string;
  iconClassName: string;
  isExternal?: boolean;
  requiresAuth?: boolean;
};

export type PublicBottomNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isLink?: boolean;
  requiresAuth?: boolean;
};

export type PublicAssistantApiResponse = {
  id: string;
  name: string;
  position: string;
  photoUrl: string | null;
  order: number;
};

export type PublicModuleApiResponse = {
  id: string;
  title: string;
  description: string | null;
  isActive: boolean;
  fileUrl: string | null;
  order: number;
  tpDeadline: string | null;
};

export type HeroCard = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  iconClassName: string;
  isExternal?: boolean;
};
