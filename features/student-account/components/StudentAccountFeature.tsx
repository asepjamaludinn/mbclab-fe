"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProfile, authService } from "@/features/auth";
import { PublicBottomNavigation } from "@/features/public-home";
import { AccountHeader } from "./AccountHeader";
import { AccountActions } from "./AccountActions";

export function StudentAccountFeature() {
  const { data: user, isLoading } = useProfile();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authService.logout();
      router.push("/login/student");
    } catch (error) {
      console.error("Logout failed", error);
      setIsLoggingOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grey-50">
        <span className="animate-pulse font-secondary text-sm font-bold text-primary">
          Memuat Profil...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <AccountHeader name={user?.name} nim={user?.nim} />

      <AccountActions
        role={user?.role}
        isLoggingOut={isLoggingOut}
        onLogout={handleLogout}
      />

      <PublicBottomNavigation />
    </main>
  );
}
