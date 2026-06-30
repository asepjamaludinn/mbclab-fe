import { BookOpen, ClipboardList, FileText } from "lucide-react";

export const DASHBOARD_QUICK_ACCESS_ITEMS = [
  {
    title: "Akses Modul",
    description: "Buka materi, panduan praktikum, dan modul pembelajaran.",
    href: "/student/modules",
    icon: BookOpen,
    variant: "large",
    className: "bg-primary text-white shadow-primary/20",
  },
  {
    title: "Kumpulkan TP",
    description: "Upload laporan PDF.",
    href: "/student/submissions",
    icon: FileText,
    variant: "small",
    className: "bg-success text-white shadow-success/20",
  },
  {
    title: "Kerjakan TA",
    description: "Masuk sesi kuis.",
    href: "/student/assessment",
    icon: ClipboardList,
    variant: "small",
    className: "bg-warning text-white shadow-warning/20",
  },
] as const;
