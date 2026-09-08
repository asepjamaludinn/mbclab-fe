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
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { BulkDeleteGroupsDialog } from "./Bulkdeletegroupsdialog";
import { Button } from "@/shared/components/ui/button";
import { adminGroupService } from "../services/admin-group.service";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { useRowSelection } from "@/shared/hooks/use-row-selection";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";

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

  const columns: DataTableColumn<AdminGroup>[] = [
    {
      key: "index",
      header: "#",
      headerClassName:
        "w-12 px-0 py-3.5 font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      cellClassName:
        "px-0 py-4 font-secondary text-xs font-medium tracking-tight text-grey-400",
      render: (_group, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      key: "name",
      header: "Nama Kelompok",
      sortDir: sort.field === "name" ? sort.dir : null,
      onSort: () => toggleSort("name"),
      render: (group) => (
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/10 backdrop-blur-md text-primary">
            <UsersRound className="h-5 w-5" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium tracking-tight text-grey-900">
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
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-secondary text-xs font-medium tracking-tight backdrop-blur-md border ${
            (group._count?.students ?? 0) > 0
              ? "bg-primary/10 text-primary border-primary/10"
              : "bg-grey-100/50 text-grey-500 border-grey-200/50"
          }`}
        >
          <Users className="h-3 w-3" strokeWidth={1.5} />
          {group._count?.students ?? 0} anggota
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (group) => (
        <div className="flex items-center justify-end gap-1.5">
          <Link
            href={`/admin/groups/${group.id}`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
          >
            <UserCog className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <Link
            href={`/admin/groups/${group.id}/edit`}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </Link>
          <button
            onClick={() => setDeletingGroup(group)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-error hover:shadow-sm"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Kelompok Praktikum"
      description="Kelola pembagian kelompok dan anggota praktikan."
      headerActions={
        <>
          <a
            href={adminGroupService.exportCsvUrl()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button
              variant="outline"
              className="h-10 rounded-xl px-4 shadow-sm border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80 font-medium tracking-tight"
            >
              <Download className="mr-2 h-4 w-4" strokeWidth={1.5} /> Export CSV
            </Button>
          </a>
          <Link href="/admin/groups/create">
            <Button className="h-10 rounded-xl px-4 shadow-md font-medium tracking-tight">
              <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Buat Kelompok
            </Button>
          </Link>
        </>
      }
      selectedCount={selectedIds.size}
      itemLabel="kelompok"
      onClearSelection={clearSelection}
      bulkActions={
        <Button
          type="button"
          variant="danger"
          className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
          Hapus {selectedIds.size} Kelompok
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
              placeholder="Cari nama kelompok..."
              className="flex-1 bg-transparent text-sm font-medium tracking-tight text-grey-900 placeholder:font-normal placeholder:text-grey-400 focus:outline-none"
            />
          </div>
          <FilterDropdown
            icon={
              <SlidersHorizontal
                className="h-4 w-4 shrink-0 text-grey-400"
                strokeWidth={1.5}
              />
            }
            value={statusFilter}
            options={STATUS_OPTIONS}
            onChange={setStatusFilter}
            hideCheckIcon={true}
          />
        </>
      }
    >
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
    </AdminPageLayout>
  );
}
