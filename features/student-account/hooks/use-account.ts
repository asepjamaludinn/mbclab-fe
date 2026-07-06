"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth";

export function useLogout() {
  const queryClient = useQueryClient();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch (error) {
      console.error("Gagal memanggil endpoint logout:", error);
    } finally {
      queryClient.removeQueries({ queryKey: ["profile"] });
      queryClient.clear();

      window.location.href = "/login/student";
    }
  };

  return { isLoggingOut, handleLogout };
}
