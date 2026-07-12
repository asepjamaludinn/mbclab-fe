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
import { AdminAccountFormDialog } from "./AdminAccountFormDialog";
import { DeleteAdminAccountDialog } from "./DeleteAdminAccountDialog";
import { getInitials } from "@/shared/utils/string";
import { useProfile } from "@/features/auth";

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

  const columns: DataTableColumn<AdminAccount>[] = [
    {
      key: "name",
      header: "Asisten",
      render: (acc) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-bold text-primary">
            {getInitials(acc.name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-grey-900">{acc.name}</p>
            <p className="font-secondary text-xs text-grey-500">{acc.nim}</p>
          </div>
        </div>
      ),
    },
    {
      key: "division",
      header: "Divisi",
      render: (acc) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-xs font-bold ${
            acc.division === "COORDINATOR"
              ? "bg-error/10 text-error-700"
              : acc.division === "ACADEMIC"
                ? "bg-info/10 text-info-700"
                : "bg-success/10 text-success-700"
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
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (acc) => (
        <div className="flex justify-end gap-1.5">
          <button
            onClick={() => setDeletingAdmin(acc)}
            title="Hapus Akun"
            disabled={!isCoordinator || acc.id === userProfile?.id}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-grey-400"
          >
            <Trash2 className="h-4 w-4" strokeWidth={2} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div className="flex w-full flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
            Manajemen Akun Asisten
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Kelola kredensial login (username/password) dan divisi untuk
            asisten.
          </p>
        </div>
        {isCoordinator && (
          <Button
            onClick={() => setFormOpen(true)}
            className="h-10 shrink-0 rounded-lg px-4 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
            Buat Akun Asisten
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 flex-1 items-center rounded-xl border border-grey-200 bg-white px-4 sm:max-w-md">
          <Search className="mr-2.5 h-4 w-4 text-grey-400" strokeWidth={2} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari nama atau username..."
            className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
          />
        </div>
        <FilterDropdown
          value={division}
          options={DIVISION_OPTIONS}
          onChange={setDivision}
          widthClassName="sm:w-48"
          icon={<SlidersHorizontal className="h-4 w-4 text-grey-400" />}
        />
      </div>

      <DataTable
        columns={columns}
        data={admins}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data akun asisten."
        emptyIcon={ShieldCheck}
        emptyTitle="Tidak ada akun asisten"
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
    </div>
  );
}
