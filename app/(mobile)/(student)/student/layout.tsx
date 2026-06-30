import { ReactNode } from "react";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";

import { StudentBottomNavigation } from "@/features/student-navigation";
import { User } from "@/features/auth";

async function prefetchProfileData(): Promise<User | null> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();

  if (!allCookies) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL belum diatur.");
    return null;
  }

  try {
    const res = await fetch(`${apiUrl}/auth/profile`, {
      headers: { Cookie: allCookies },
      cache: "no-store",
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error: unknown) {
    console.error("Gagal prefetch profil di layout:", error);
    return null;
  }
}

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: prefetchProfileData,
  });

  return (
    <div className="min-h-screen bg-grey-200">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <main className="pb-28">{children}</main>
        <StudentBottomNavigation />
      </HydrationBoundary>
    </div>
  );
}
