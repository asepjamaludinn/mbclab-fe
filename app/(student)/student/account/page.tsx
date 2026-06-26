import { Metadata } from "next";
import { cookies } from "next/headers";
import { User } from "lucide-react";
import { PublicLockedFeature } from "@/features/public-locked";
import { StudentAccountFeature } from "@/features/student-account";

export const metadata: Metadata = {
  title: "Akun Praktikan | MBCLAB Portal",
  description: "Kelola profil dan pengaturan akun praktikan Anda.",
};

export default async function AccountPage() {
  const cookieStore = await cookies();
  const hasToken = !!cookieStore.get("refresh_token")?.value;

  if (!hasToken) {
    return (
      <PublicLockedFeature
        title="Akun Terkunci"
        description="Halaman akun hanya dapat digunakan setelah Anda login. Silakan masuk terlebih dahulu."
        icon={User}
      />
    );
  }

  return <StudentAccountFeature />;
}
