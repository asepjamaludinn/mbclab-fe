"use client";

import { ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";
import { RowCheckbox } from "@/shared/components/ui/row-checkbox";

type SelectionToolbarProps = {
  count: number;
  itemLabel: string;
  onClear: () => void;
  actions: ReactNode;
};

export function SelectionToolbar({
  count,
  itemLabel,
  onClear,
  actions,
}: SelectionToolbarProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-2.5">
        <RowCheckbox checked onChange={onClear} ariaLabel="Batalkan seleksi" />
        <p className="font-secondary text-sm font-semibold text-primary">
          {count} {itemLabel} dipilih
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          className="h-9 rounded-lg px-3 text-xs"
          onClick={onClear}
        >
          Batal
        </Button>
        {actions}
      </div>
    </div>
  );
}
