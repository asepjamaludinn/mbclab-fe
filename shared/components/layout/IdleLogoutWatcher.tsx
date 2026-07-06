"use client";

import { useIdleLogout } from "@/shared/hooks/use-idle-logout";

export function IdleLogoutWatcher() {
  useIdleLogout(true);
  return null;
}
