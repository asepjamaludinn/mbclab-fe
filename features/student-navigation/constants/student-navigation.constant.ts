import { BookOpen, ClipboardList, Home, User } from "lucide-react";
import { StudentNavItem } from "../types/student-navigation.type";

export const STUDENT_NAV_ITEMS: StudentNavItem[] = [
  {
    label: "Home",
    href: "/student/dashboard",
    icon: Home,
  },
  {
    label: "Modul",
    href: "/student/modules",
    icon: BookOpen,
  },
  {
    label: "Assessment",
    href: "/student/assessment",
    icon: ClipboardList,
  },
  {
    label: "Akun",
    href: "/student/account",
    icon: User,
  },
];
