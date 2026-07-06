import { Metadata } from "next";
import { AdminLoginForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Login Admin | MBCLAB Portal",
  description:
    "Masuk ke portal manajemen MBC Laboratory khusus untuk asisten dan koordinator.",
};

export default function AdminLoginPage() {
  return <AdminLoginForm />;
}
