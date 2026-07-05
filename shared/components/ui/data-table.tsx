"use client";

import { ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  ChevronLeft,
  ChevronRight,
  LucideIcon,
} from "lucide-react";
import { RowCheckbox } from "@/shared/components/ui/row-checkbox";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";

export type DataTableColumn<T> = {
  key: string;
  header: ReactNode;
  render: (row: T, rowIndex: number) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  sortDir?: "asc" | "desc" | null;
  onSort?: () => void;
};

export type DataTableSelection = {
  isAllSelected: boolean;
  isSomeSelected: boolean;
  isRowSelected: (id: string) => boolean;
  onToggleRow: (id: string) => void;
  onToggleAll: () => void;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  emptyIcon?: LucideIcon;
  emptyTitle?: string;
  emptyDescription?: string;
  rowClassName?: (row: T) => string;
  selection?: DataTableSelection;
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  itemsLabel?: string;
};

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function SortIcon({ dir }: { dir?: "asc" | "desc" | null }) {
  if (!dir) {
    return (
      <ChevronsUpDown className="h-3 w-3 text-grey-300" strokeWidth={2.5} />
    );
  }
  return dir === "asc" ? (
    <ArrowUp className="h-3 w-3 text-primary" strokeWidth={2.5} />
  ) : (
    <ArrowDown className="h-3 w-3 text-primary" strokeWidth={2.5} />
  );
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading,
  isError,
  errorMessage = "Gagal memuat data.",
  emptyIcon: EmptyIcon,
  emptyTitle = "Tidak ada data",
  emptyDescription,
  rowClassName,
  selection,
  page,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  itemsLabel = "data",
}: DataTableProps<T>) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  return (
    <div className="overflow-hidden rounded-2xl border border-grey-200 bg-white shadow-sm">
      {isLoading ? (
        <div className="divide-y divide-grey-100">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 animate-pulse bg-grey-100/60" />
          ))}
        </div>
      ) : isError ? (
        <div className="p-10 text-center">
          <p className="font-secondary text-sm font-semibold text-error">
            {errorMessage}
          </p>
        </div>
      ) : data.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-14 text-center">
          {EmptyIcon && (
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <EmptyIcon className="h-7 w-7" strokeWidth={1.8} />
            </div>
          )}
          <p className="text-sm font-bold text-grey-900">{emptyTitle}</p>
          {emptyDescription && (
            <p className="mt-1 font-secondary text-xs text-grey-500">
              {emptyDescription}
            </p>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-grey-200 bg-grey-50/70">
                  {selection && (
                    <th className="w-12 px-6 py-3.5">
                      <RowCheckbox
                        checked={selection.isAllSelected}
                        indeterminate={selection.isSomeSelected}
                        onChange={selection.onToggleAll}
                        ariaLabel="Pilih semua baris di halaman ini"
                      />
                    </th>
                  )}
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className={
                        col.headerClassName ??
                        "px-6 py-3.5 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500"
                      }
                    >
                      {col.onSort ? (
                        <button
                          onClick={col.onSort}
                          className="inline-flex items-center gap-1.5 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500 transition hover:text-grey-700"
                        >
                          {col.header}
                          <SortIcon dir={col.sortDir} />
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-100">
                {data.map((row, idx) => {
                  const id = rowKey(row);
                  const isSelected = selection?.isRowSelected(id) ?? false;
                  return (
                    <tr
                      key={id}
                      className={`transition ${
                        isSelected ? "bg-primary/5" : "hover:bg-grey-50/60"
                      } ${rowClassName ? rowClassName(row) : ""}`}
                    >
                      {selection && (
                        <td className="px-6 py-4">
                          <RowCheckbox
                            checked={isSelected}
                            onChange={() => selection.onToggleRow(id)}
                            ariaLabel={`Pilih baris ${id}`}
                          />
                        </td>
                      )}
                      {columns.map((col) => (
                        <td
                          key={col.key}
                          className={col.cellClassName ?? "px-6 py-4"}
                        >
                          {col.render(row, idx)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-grey-100 px-6 py-4 sm:flex-row">
            <div className="flex items-center gap-4">
              <p className="font-secondary text-xs text-grey-500">
                Menampilkan{" "}
                <span className="font-bold text-grey-700">
                  {(safePage - 1) * pageSize + 1}-
                  {Math.min(safePage * pageSize, totalItems)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-grey-700">{totalItems}</span>{" "}
                {itemsLabel}
              </p>

              {onPageSizeChange && (
                <div className="flex items-center gap-1.5">
                  <span className="font-secondary text-xs text-grey-500 whitespace-nowrap shrink-0">
                    Per halaman:
                  </span>
                  <FilterDropdown
                    size="sm"
                    widthClassName="w-[72px]"
                    direction="up"
                    value={String(pageSize)}
                    options={pageSizeOptions.map((s) => ({
                      value: String(s),
                      label: String(s),
                    }))}
                    onChange={(v) => onPageSizeChange(Number(v))}
                  />
                </div>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onPageChange(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-200 text-grey-500 transition hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman sebelumnya"
              >
                <ChevronLeft className="h-4 w-4" strokeWidth={2} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 || p === totalPages || Math.abs(p - safePage) <= 1,
                )
                .reduce<number[]>((acc, p) => {
                  if (acc.length && p - acc[acc.length - 1] > 1) acc.push(-1);
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === -1 ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="px-1.5 font-secondary text-xs text-grey-400"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => onPageChange(p)}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg font-secondary text-xs font-bold transition ${
                        p === safePage
                          ? "bg-primary text-white shadow-sm"
                          : "text-grey-600 hover:bg-grey-50"
                      }`}
                    >
                      {p}
                    </button>
                  ),
                )}

              <button
                onClick={() => onPageChange(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-grey-200 text-grey-500 transition hover:bg-grey-50 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Halaman berikutnya"
              >
                <ChevronRight className="h-4 w-4" strokeWidth={2} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
