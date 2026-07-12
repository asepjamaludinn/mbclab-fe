"use client";

import { SearchX } from "lucide-react";
import { QuickSearchResult } from "@/shared/hooks/use-quick-search";

type QuickSearchDropdownProps = {
  query: string;
  results: QuickSearchResult[];
  onSelect: (result: QuickSearchResult) => void;
};

export function QuickSearchDropdown({
  query,
  results,
  onSelect,
}: QuickSearchDropdownProps) {
  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-[24px] border border-white/70 bg-white/95 p-2 shadow-[0_24px_60px_-30px_rgba(0,101,176,0.55)] backdrop-blur-2xl">
      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-2 px-4 py-6 text-center">
          <SearchX className="h-5 w-5 text-grey-300" strokeWidth={1.8} />
          <p className="font-secondary text-xs font-semibold text-grey-500">
            Tidak ada hasil untuk &quot;{query}&quot;
          </p>
        </div>
      ) : (
        <ul className="max-h-72 space-y-1 overflow-y-auto">
          {results.map((result) => {
            const Icon = result.icon;
            return (
              <li key={result.id}>
                <button
                  type="button"
                  // pointerdown (not click) so this fires before the input's
                  // blur/outside-click handler would close the dropdown first
                  onPointerDown={(e) => {
                    e.preventDefault();
                    onSelect(result);
                  }}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition hover:bg-primary/5"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-bold text-grey-900">
                      {result.title}
                    </span>
                    {result.subtitle && (
                      <span className="block truncate font-secondary text-[11px] text-grey-500">
                        {result.subtitle}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
