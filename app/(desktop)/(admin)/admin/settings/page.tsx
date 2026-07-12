import { Metadata } from "next";
import { AdminSettingsFeature } from "@/features/admin-settings";

export const metadata: Metadata = {
  title: "Pengaturan Akun | MBCLAB Admin",
  description: "Kelola profil dan pengaturan keamanan akun asisten Anda.",
};

export default function AdminSettingsPage() {
  return <AdminSettingsFeature />;
}
