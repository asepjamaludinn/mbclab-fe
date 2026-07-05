"use client";

import { Check } from "lucide-react";

type RowCheckboxProps = {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  ariaLabel: string;
};

export function RowCheckbox({
  checked,
  indeterminate = false,
  onChange,
  ariaLabel,
}: RowCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={ariaLabel}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border transition ${
        checked || indeterminate
          ? "border-primary bg-primary text-white"
          : "border-grey-300 bg-white hover:border-primary/50"
      }`}
    >
      {indeterminate ? (
        <span className="h-[2px] w-2.5 rounded-full bg-white" />
      ) : checked ? (
        <Check className="h-3 w-3" strokeWidth={3} />
      ) : null}
    </button>
  );
}
