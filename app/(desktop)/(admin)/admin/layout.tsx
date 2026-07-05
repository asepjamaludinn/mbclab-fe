import { ReactNode } from "react";
import { AdminAppShell } from "@/shared/components/layout/AdminAppShell";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/get-query-client";
import { User } from "@/features/auth";

async function prefetchAdminProfile(): Promise<User | null> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.toString();

  if (!allCookies) return null;

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) return null;

  try {
    const res = await fetch(`${apiUrl}/auth/profile`, {
      headers: { Cookie: allCookies },
      cache: "no-store",
    });

    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["profile"],
    queryFn: prefetchAdminProfile,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminAppShell>{children}</AdminAppShell>
    </HydrationBoundary>
  );
}
