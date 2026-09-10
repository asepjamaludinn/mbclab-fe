"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/shared/lib/toast";

export function useSessionRevokedWatcher() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const socket = io(`${process.env.NEXT_PUBLIC_API_URL}/session-events`, {
      withCredentials: true,
    });

    socket.on("force-logout", (payload: { reason?: string }) => {
      queryClient.clear();

      showToast.warning(
        "Sesi Diakhiri",
        payload.reason || "Sesi Anda telah diakhiri dari perangkat lain.",
      );

      const isAdminArea = window.location.pathname.startsWith("/admin");
      window.location.href = isAdminArea ? "/login/admin" : "/login/student";
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);
}
