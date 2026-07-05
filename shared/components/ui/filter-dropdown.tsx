"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type FilterDropdownOption<T extends string> = {
  value: T;
  label: string;
};

type FilterDropdownProps<T extends string> = {
  icon?: React.ReactNode;
  value: T;
  options: FilterDropdownOption<T>[];
  onChange: (value: T) => void;
  widthClassName?: string;
  size?: "md" | "sm";
  direction?: "down" | "up";
};

export function FilterDropdown<T extends string>({
  icon,
  value,
  options,
  onChange,
  widthClassName = "sm:w-56",
  size = "md",
  direction = "down",
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
        className={`flex ${heightClass} w-full items-center gap-2 rounded-xl border bg-white ${paddingClass} ${textClass} font-medium text-grey-900 outline-none transition ${
          open
            ? "border-primary ring-2 ring-primary/10"
            : "border-grey-200 hover:border-grey-300"
        }`}
      >
        {icon}
        <span className="flex-1 truncate text-left">{selected?.label}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-grey-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          className={`absolute z-20 w-full overflow-hidden rounded-xl border border-grey-200 bg-white shadow-lg ${
            direction === "up" ? "bottom-full mb-1.5" : "mt-1.5"
          }`}
        >
          {options.map((option) => {
            const isActive = option.value === value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-left text-sm transition ${
                  isActive
                    ? "bg-primary/10 font-semibold text-primary"
                    : "text-grey-700 hover:bg-grey-50"
                }`}
              >
                {option.label}
                {isActive && (
                  <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
