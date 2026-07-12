"use client";

import { useMemo } from "react";
import { LucideIcon } from "lucide-react";

export type QuickSearchResult = {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  href?: string;
  externalHref?: string;
  scrollToId?: string;
};

export function useQuickSearch(
  query: string,
  entries: QuickSearchResult[],
  maxResults = 6,
) {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    return entries
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(q) ||
          (entry.subtitle ?? "").toLowerCase().includes(q),
      )
      .slice(0, maxResults);
  }, [query, entries, maxResults]);
}
