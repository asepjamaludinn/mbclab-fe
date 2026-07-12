"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  UsersRound,
  Download,
  Trash2,
  Pencil,
  UserCog,
  Users,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminGroups } from "../hooks/use-admin-groups";
import { AdminGroup } from "../types/admin-group.type";
import { GroupFormDialog } from "./GroupFormDialog";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { BulkDeleteGroupsDialog } from "./Bulkdeletegroupsdialog";
import { Button } from "@/shared/components/ui/button";
import { adminGroupService } from "../services/admin-group.service";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { SelectionToolbar } from "@/shared/components/ui/selection-toolbar";
import { useRowSelection } from "@/shared/hooks/use-row-selection";

type SortField = "name" | "members";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "filled" | "empty";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Kelompok" },
  { value: "filled", label: "Sudah Ada Anggota" },
  { value: "empty", label: "Belum Ada Anggota" },
];

export function GroupsFeature() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sort, setSort] = useState<{ field: SortField; dir: SortDir }>({
    field: "name",
    dir: "asc",
  });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AdminGroup | null>(null);
  const [deletingGroup, setDeletingGroup] = useState<AdminGroup | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, sort, pageSize]);

  const { data, isLoading, isError } = useAdminGroups({
    page,
    limit: pageSize,
    search,
    status: statusFilter,
    sortField: sort.field,
    sortDir: sort.dir,
  });

  const groups = data?.data ?? [];
  const meta = data?.meta;

  const {
    selectedIds,
    selectedItems: selectedGroups,
    toggleRow,
    toggleList,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  } = useRowSelection(groups, (g) => g.id);

  const toggleSort = (field: SortField) => {
    setSort((prev) =>
      prev.field === field
        ? { field, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { field, dir: "asc" },
    );
  };

  const openCreateDialog = () => {
    setEditingGroup(null);
    setFormOpen(true);
  };

  const openEditDialog = (group: AdminGroup) => {
    setEditingGroup(group);
    setFormOpen(true);
  };

  const columns: DataTableColumn<AdminGroup>[] = [
    {
      key: "index",
      header: "#",
      headerClassName:
        "w-12 px-0 py-3.5 font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      cellClassName:
        "px-0 py-4 font-secondary text-xs font-semibold text-grey-400",
      render: (_group, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      key: "name",
      header: "Nama Kelompok",
      sortDir: sort.field === "name" ? sort.dir : null,
      onSort: () => toggleSort("name"),
      render: (group) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <UsersRound className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-semibold text-grey-900">
            {group.name}
          </span>
        </div>
      ),
    },
    {
      key: "members",
      header: "Anggota",
      sortDir: sort.field === "members" ? sort.dir : null,
      onSort: () => toggleSort("members"),
      render: (group) => (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-secondary text-xs font-bold ${
            (group._count?.students ?? 0) > 0
              ? "bg-primary/10 text-primary"
              : "bg-grey-100 text-grey-500"
          }`}
        >
          <Users className="h-3 w-3" strokeWidth={2.5} />
          {group._count?.students ?? 0} anggota
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (group) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/groups/${group.id}`}
            title="Kelola Anggota"
            aria-label="Kelola Anggota"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
          >
            <UserCog className="h-4 w-4" strokeWidth={2} />
          </Link>
          <button
            onClick={() => openEditDialog(group)}
            title="Ubah Nama Kelompok"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Ubah nama kelompok"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setDeletingGroup(group)}
            title="Hapus Kelompok"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error"
            aria-label="Hapus kelompok"
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
            Kelompok Praktikum
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Kelola pembagian kelompok dan anggota praktikan.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <a
            href={adminGroupService.exportCsvUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="h-10 rounded-lg px-4 shadow-sm"
            >
              <Download className="mr-2 h-4 w-4" strokeWidth={2} />
              Export CSV
            </Button>
          </a>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg px-4 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
            Buat Kelompok
          </Button>
        </div>
      </div>

      {selectedIds.size > 0 ? (
        <SelectionToolbar
          count={selectedIds.size}
          itemLabel="kelompok"
          onClear={clearSelection}
          actions={
            <Button
              type="button"
              variant="danger"
              className="h-9 rounded-lg px-3 text-xs"
              onClick={() => setBulkDeleteOpen(true)}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={2} />
              Hapus {selectedIds.size} Kelompok
            </Button>
          }
        />
      ) : (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex h-11 flex-1 items-center rounded-xl border border-grey-200 bg-white px-4 sm:max-w-md">
            <Search className="mr-2.5 h-4 w-4 text-grey-400" strokeWidth={2} />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Cari nama kelompok..."
              className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
            />
          </div>

          <FilterDropdown
            icon={
              <SlidersHorizontal
                className="h-4 w-4 shrink-0 text-grey-400"
                strokeWidth={2}
              />
            }
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={groups}
        rowKey={(g) => g.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data kelompok."
        emptyIcon={UsersRound}
        emptyTitle="Tidak ada kelompok yang cocok"
        emptyDescription="Coba ubah kata kunci pencarian atau filter."
        selection={{
          isAllSelected: isListAllSelected(groups),
          isSomeSelected: isListSomeSelected(groups),
          onToggleRow: toggleRow,
          onToggleAll: () => toggleList(groups),
          isRowSelected: (id) => selectedIds.has(id),
        }}
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="kelompok"
      />

      <GroupFormDialog
        group={editingGroup}
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditingGroup(null);
        }}
      />
      <DeleteGroupDialog
        group={deletingGroup}
        onOpenChange={(open) => !open && setDeletingGroup(null)}
      />
      <BulkDeleteGroupsDialog
        groups={selectedGroups}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={clearSelection}
      />
    </div>
  );
}
