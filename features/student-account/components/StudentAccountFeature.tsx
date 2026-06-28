"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile, authService } from "@/features/auth";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { AccountHeader } from "./AccountHeader";
import { AccountActions } from "./AccountActions";

export function StudentAccountFeature() {
  const { data: user, isLoading } = useProfile("STUDENT");
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authService.logout();

      queryClient.removeQueries({ queryKey: ["profile"] });
      queryClient.clear();

      router.replace("/login/student");
      router.refresh();
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.16),transparent_34%),linear-gradient(180deg,#f8f9fa_0%,#eef6ff_45%,#f8f9fa_100%)] pb-28">
        <section className="px-5 pt-6">
          <div className="mx-auto h-32 w-32 animate-pulse rounded-full bg-white/70" />
          <div className="mx-auto mt-5 h-7 w-44 animate-pulse rounded-xl bg-white/70" />
          <div className="mx-auto mt-3 h-4 w-36 animate-pulse rounded-full bg-white/70" />
        </section>

        <section className="mt-8 space-y-4 px-5">
          <div className="h-56 animate-pulse rounded-[34px] bg-white/70" />
          <div className="h-24 animate-pulse rounded-[30px] bg-white/70" />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <AccountHeader
        name={user?.name}
        nim={user?.nim}
        role={user?.role}
        groupName={user?.group?.name}
      />

      <AccountActions
        role={user?.role}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />

      <StudentBottomNavigation />
    </main>
  );
}
