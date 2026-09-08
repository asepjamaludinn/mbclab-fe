"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminAccounts } from "../hooks/use-admin-accounts";
import { AdminAccount } from "../types/admin-account.type";
import { Button } from "@/shared/components/ui/button";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { useRowSelection } from "@/shared/hooks/use-row-selection";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";
import { AdminAccountFormDialog } from "./AdminAccountFormDialog";
import { DeleteAdminAccountDialog } from "./DeleteAdminAccountDialog";
import { getInitials } from "@/shared/utils/string";
import { useProfile } from "@/features/auth";
import { BulkDeleteAdminAccountsDialog } from "./BulkDeleteAdminAccountsDialog";

const DIVISION_OPTIONS = [
  { value: "", label: "Semua Divisi" },
  { value: "COORDINATOR", label: "Koordinator" },
  { value: "ACADEMIC", label: "Akademik" },
  { value: "PRACTICUM", label: "Praktikum" },
];

export function AdminAccountsFeature() {
  const { data: userProfile } = useProfile("ADMIN");
  const isCoordinator = userProfile?.division === "COORDINATOR";

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [division, setDivision] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [formOpen, setFormOpen] = useState(false);
  const [deletingAdmin, setDeletingAdmin] = useState<AdminAccount | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, division, pageSize]);

  const { data, isLoading, isError } = useAdminAccounts(
    page,
    pageSize,
    search,
    division,
  );
  const admins = data?.data ?? [];
  const meta = data?.meta;

  const {
    selectedIds,
    selectedItems,
    toggleRow,
    toggleList,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  } = useRowSelection(admins, (a) => a.id);

  const columns: DataTableColumn<AdminAccount>[] = [
    {
      key: "name",
      header: "Asisten",
      render: (acc) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-medium text-primary">
            {getInitials(acc.name)}
          </div>
          <div>
            <p className="text-sm font-medium tracking-tight text-grey-900">
              {acc.name}
            </p>
            <p className="font-secondary text-xs tracking-tight text-grey-500">
              {acc.nim}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "division",
      header: "Divisi",
      render: (acc) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-[10px] font-medium tracking-tight backdrop-blur-md border ${
            acc.division === "COORDINATOR"
              ? "bg-error/10 text-error border-error/10"
              : acc.division === "ACADEMIC"
                ? "bg-info/10 text-info-700 border-info/10"
                : "bg-success/10 text-success border-success/10"
          }`}
        >
          {acc.division}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (acc) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => setDeletingAdmin(acc)}
            disabled={!isCoordinator || acc.id === userProfile?.id}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-error hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Manajemen Akun Asisten"
      description="Kelola kredensial login (username/password) dan divisi untuk asisten."
      headerActions={
        isCoordinator && (
          <Button
            onClick={() => setFormOpen(true)}
            className="h-10 shrink-0 rounded-xl px-4 shadow-md font-medium tracking-tight"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Buat Akun
            Asisten
          </Button>
        )
      }
      selectedCount={selectedIds.size}
      itemLabel="akun"
      onClearSelection={clearSelection}
      bulkActions={
        <Button
          variant="danger"
          className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} /> Hapus{" "}
          {selectedIds.size} Akun
        </Button>
      }
      filters={
        <>
          <div className="flex h-11 flex-1 items-center rounded-xl border border-white/50 bg-white/50 backdrop-blur-md shadow-sm px-4 sm:max-w-md transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
            <Search
              className="mr-2.5 h-4 w-4 text-grey-400"
              strokeWidth={1.5}
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama atau username..."
              className="flex-1 bg-transparent text-sm font-medium tracking-tight text-grey-900 placeholder:font-normal placeholder:text-grey-400 focus:outline-none"
            />
          </div>
          <FilterDropdown
            value={division}
            options={DIVISION_OPTIONS}
            onChange={setDivision}
            widthClassName="sm:w-48"
            icon={
              <SlidersHorizontal
                className="h-4 w-4 shrink-0 text-grey-400"
                strokeWidth={1.5}
              />
            }
            hideCheckIcon={true}
          />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={admins}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data akun asisten."
        emptyIcon={ShieldCheck}
        emptyTitle="Tidak ada akun asisten"
        selection={{
          isAllSelected: isListAllSelected(admins),
          isSomeSelected: isListSomeSelected(admins),
          onToggleRow: toggleRow,
          onToggleAll: () => toggleList(admins),
          isRowSelected: (id) => selectedIds.has(id),
        }}
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        itemsLabel="akun"
      />
      <AdminAccountFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <DeleteAdminAccountDialog
        admin={deletingAdmin}
        onOpenChange={(open) => !open && setDeletingAdmin(null)}
      />
      <BulkDeleteAdminAccountsDialog
        admins={selectedItems}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={clearSelection}
      />
    </AdminPageLayout>
  );
}
