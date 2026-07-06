"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/shared/lib/api";

type UserWithPasswordFlag = { mustChangePassword?: boolean } | null | undefined;

export function useSyncMustChangePasswordFlag(user: UserWithPasswordFlag) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasForcedParam = searchParams.get("forceChangePassword") === "1";

  useEffect(() => {
    if (!user || !hasForcedParam || user.mustChangePassword !== false) {
      return;
    }

    let isCancelled = false;

    api
      .post("/auth/refresh")
      .catch(() => {})
      .finally(() => {
        if (isCancelled) return;
        const url = new URL(window.location.href);
        url.searchParams.delete("forceChangePassword");
        router.replace(url.pathname + (url.search ? url.search : ""));
      });

    return () => {
      isCancelled = true;
    };
  }, [user?.mustChangePassword, hasForcedParam]);
}
