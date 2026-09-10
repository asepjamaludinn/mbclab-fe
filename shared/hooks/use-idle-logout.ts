"use client";

import { useCallback, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/features/auth";
import { api } from "@/shared/lib/api";

const DEFAULT_IDLE_TIMEOUT_MINUTES = 20;

const ACTIVITY_EVENTS: (keyof WindowEventMap)[] = [
  "mousemove",
  "mousedown",
  "keydown",
  "scroll",
  "touchstart",
];

type ClientConfig = {
  idleTimeoutMinutes: number;
};

async function fetchClientConfig(): Promise<ClientConfig> {
  const res = await api.get<ClientConfig>("/config/client");
  return res.data;
}

export function useClientConfig(enabled: boolean) {
  return useQuery({
    queryKey: ["client-config"],
    queryFn: fetchClientConfig,
    enabled,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

export function useIdleLogout(enabled: boolean) {
  const queryClient = useQueryClient();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: clientConfig } = useClientConfig(enabled);

  const idleTimeoutMs =
    (clientConfig?.idleTimeoutMinutes ?? DEFAULT_IDLE_TIMEOUT_MINUTES) *
    60 *
    1000;

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
      timerRef.current = setTimeout(handleIdleLogout, idleTimeoutMs);
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
  }, [enabled, handleIdleLogout, idleTimeoutMs]);
}
