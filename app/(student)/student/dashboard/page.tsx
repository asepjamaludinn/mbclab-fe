import { Metadata } from "next";
import { StudentDashboardFeature } from "@/features/student-dashboard";

export const metadata: Metadata = {
  title: "Dashboard Praktikan | MBCLAB Portal",
  description:
    "Kelola aktivitas praktikum, akses modul, dan kumpulkan TP serta TA melalui dashboard praktikan.",
};

export default function StudentDashboardPage() {
  return <StudentDashboardFeature />;
}
