"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth";

export function useLogout() {
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

  return { isLoggingOut, handleLogout };
}
