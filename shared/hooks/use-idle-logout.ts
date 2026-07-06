"use client";

import { useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth";

const IDLE_TIMEOUT_MS = 20 * 60 * 1000;
const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

export function useIdleLogout(enabled: boolean) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleIdleLogout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {}
    queryClient.clear();
    const isAdmin = window.location.pathname.startsWith("/admin");
    window.location.href = isAdmin ? "/login/admin" : "/login/student";
  }, [queryClient]);

  useEffect(() => {
    if (!enabled) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(handleIdleLogout, IDLE_TIMEOUT_MS);
    };

    ACTIVITY_EVENTS.forEach((evt) =>
      window.addEventListener(evt, resetTimer, { passive: true }),
    );
    resetTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((evt) =>
        window.removeEventListener(evt, resetTimer),
      );
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [enabled, handleIdleLogout]);
}
