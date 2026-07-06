import { Metadata } from "next";
import { AdminDashboardFeature } from "@/features/admin-dashboard";

export const metadata: Metadata = {
  title: "Dashboard Admin | MBCLAB Portal",
  description: "Pantau aktivitas, nilai, dan sesi praktikum secara real-time.",
};

export default function AdminDashboardPage() {
  return <AdminDashboardFeature />;
}
