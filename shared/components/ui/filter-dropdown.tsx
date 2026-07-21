"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type FilterDropdownOption<T extends string | number> = {
  value: T;
  label: string;
};

type FilterDropdownProps<T extends string | number> = {
  icon?: React.ReactNode;
  value: T;
  options: FilterDropdownOption<T>[];
  onChange: (value: T) => void;
  widthClassName?: string;
  size?: "md" | "sm";
  direction?: "down" | "up";
  hideCheckIcon?: boolean;
};

export function FilterDropdown<T extends string | number>({
  icon,
  value,
  options,
  onChange,
  widthClassName = "sm:w-56",
  size = "md",
  direction = "down",
  hideCheckIcon = false,
}: FilterDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const heightClass = size === "sm" ? "h-8" : "h-11";
  const textClass = size === "sm" ? "text-xs" : "text-sm";
  const paddingClass = size === "sm" ? "px-2.5" : "px-3.5";

  return (
    <div
      ref={containerRef}
      className={`relative ${heightClass} w-full ${widthClassName}`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`flex ${heightClass} w-full items-center gap-2 rounded-xl border bg-white/50 backdrop-blur-md shadow-sm ${paddingClass} ${textClass} font-medium tracking-tight text-grey-900 outline-none transition-all ${
          open
            ? "border-primary/50 ring-2 ring-primary/10"
            : "border-white/60 hover:border-white/80 hover:bg-white/80"
        }`}
      >
        {icon}
        <span className="flex-1 truncate text-left">{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-grey-400 transition-transform duration-300 ${
            open ? "rotate-180 text-primary" : ""
          }`}
          strokeWidth={1.5}
        />
      </button>

      {open && (
        /* PERBAIKAN DI SINI: Ditambahkan z-50, max-h-60, overflow-y-auto, dan dihapus overflow-hidden yang membatasi */
        <div
          className={`absolute z-50 w-full max-h-60 overflow-y-auto custom-scrollbar rounded-2xl border border-white/50 bg-white/90 backdrop-blur-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.15)] ${
            direction === "up" ? "bottom-full mb-2" : "mt-2"
          }`}
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={String(option.value)}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm tracking-tight transition-colors ${
                  isActive
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-grey-700 font-medium hover:bg-white/60"
                }`}
              >
                {option.label}
                {isActive && !hideCheckIcon && (
                  <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
