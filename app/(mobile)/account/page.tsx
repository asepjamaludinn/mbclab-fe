import { Metadata } from "next";
import { User } from "lucide-react";
import { PublicLockedFeature } from "@/features/public-locked";

export const metadata: Metadata = {
  title: "Akun Terkunci | MBCLAB Portal",
  description: "Silakan login untuk mengakses informasi profil praktikan Anda.",
};

export default function AccountPage() {
  return (
    <PublicLockedFeature
      title="Akun belum tersedia"
      description="Halaman akun hanya dapat digunakan setelah Anda login. Silakan masuk terlebih dahulu untuk melihat profil, kelompok, modul, dan riwayat aktivitas praktikum Anda."
      icon={User}
    />
  );
}
