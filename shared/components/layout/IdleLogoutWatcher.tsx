"use client";

import { useIdleLogout } from "@/shared/hooks/use-idle-logout";
import { useSessionRevokedWatcher } from "@/shared/hooks/use-session-revoked-watcher";

export function IdleLogoutWatcher() {
  useIdleLogout(true);
  useSessionRevokedWatcher();
  return null;
}
