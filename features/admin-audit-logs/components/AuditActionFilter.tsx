"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { AUDIT_ACTION_CATEGORIES } from "../constants/admin-audit-log.constant";

type AuditActionFilterProps = {
  value: string;
  onChange: (value: string) => void;
};

export function AuditActionFilter({ value, onChange }: AuditActionFilterProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const selectedLabel = useMemo(() => {
    if (!value) return "Semua Aksi";
    for (const group of AUDIT_ACTION_CATEGORIES) {
      const found = group.actions.find((a) => a.value === value);
      if (found) return found.label;
    }
    return value;
  }, [value]);

  const filteredGroups = useMemo(() => {
    if (!query.trim()) return AUDIT_ACTION_CATEGORIES;
    const q = query.toLowerCase();
    return AUDIT_ACTION_CATEGORIES.map((group) => ({
      ...group,
      actions: group.actions.filter(
        (a) =>
          a.label.toLowerCase().includes(q) ||
          group.category.toLowerCase().includes(q),
      ),
    })).filter((group) => group.actions.length > 0);
  }, [query]);

  return (
    <div ref={containerRef} className="relative h-11 w-full sm:w-72">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex h-11 w-full items-center gap-2 rounded-xl border bg-white px-3.5 text-sm font-medium text-grey-900 outline-none transition ${
          open
            ? "border-primary ring-2 ring-primary/10"
            : "border-grey-200 hover:border-grey-300"
        }`}
      >
        <span className="flex-1 truncate text-left">{selectedLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-grey-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full min-w-[280px] overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-grey-100 px-3 py-2.5">
            <Search
              className="h-3.5 w-3.5 shrink-0 text-grey-400"
              strokeWidth={2}
            />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari aksi atau kategori..."
              className="w-full bg-transparent text-xs text-grey-900 placeholder:text-grey-400 focus:outline-none"
            />
          </div>

          <div className="max-h-80 overflow-y-auto py-1.5">
            <button
              type="button"
              onClick={() => {
                onChange("");
                setOpen(false);
              }}
              className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition ${
                !value
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-grey-700 hover:bg-grey-50"
              }`}
            >
              Semua Aksi
              {!value && <Check className="h-3.5 w-3.5" strokeWidth={2.5} />}
            </button>

            {filteredGroups.length === 0 ? (
              <p className="px-3.5 py-4 text-center font-secondary text-xs text-grey-400">
                Tidak ditemukan.
              </p>
            ) : (
              filteredGroups.map((group) => (
                <div key={group.category} className="mt-1 first:mt-0">
                  <p className="px-3.5 py-1.5 font-secondary text-[10px] font-bold uppercase tracking-wider text-grey-400">
                    {group.category}
                  </p>
                  {group.actions.map((a) => {
                    const isActive = a.value === value;
                    return (
                      <button
                        key={a.value}
                        type="button"
                        onClick={() => {
                          onChange(a.value);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center justify-between gap-2 px-3.5 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-primary/10 font-semibold text-primary"
                            : "text-grey-700 hover:bg-grey-50"
                        }`}
                      >
                        {a.label}
                        {isActive && (
                          <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
