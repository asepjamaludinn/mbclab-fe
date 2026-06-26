import { Metadata } from "next";
import { cookies } from "next/headers";
import { StudentDashboardFeature } from "@/features/student-dashboard";
import { User } from "@/features/auth";

export const metadata: Metadata = {
  title: "Dashboard Praktikan | MBCLAB Portal",
  description:
    "Kelola aktivitas praktikum, akses modul, dan kumpulkan TP serta TA melalui dashboard praktikan.",
};

async function getProfileData(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("refresh_token")?.value;

  if (!token) return null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/profile`,
      {
        headers: {
          Cookie: `refresh_token=${token}`,
        },
        cache: "no-store",
      },
    );

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Gagal melakukan fetch profil dari server:", error);
    return null;
  }
}

export default async function StudentDashboardPage() {
  const user = await getProfileData();
  return <StudentDashboardFeature user={user} />;
}
