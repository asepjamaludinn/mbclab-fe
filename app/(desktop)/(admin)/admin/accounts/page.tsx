import { Metadata } from "next";
import { AdminAccountsFeature } from "@/features/admin-accounts";

export const metadata: Metadata = {
  title: "Akun Login Asisten | MBCLAB Admin",
  description: "Manajemen akun login asisten dan hak akses divisi.",
};

export default function AdminAccountsPage() {
  return <AdminAccountsFeature />;
}
