"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  UserRoundCheck,
  Pencil,
  Trash2,
  ImageOff,
  SlidersHorizontal,
} from "lucide-react";
import {
  useAdminAssistants,
  useUpdateAssistant,
} from "../hooks/use-admin-assistants";
import { AdminAssistantProfile } from "../types/admin-assistant.type";
import { Button } from "@/shared/components/ui/button";
import { Switch } from "@/shared/components/ui/switch";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { resolveAssetUrl } from "@/shared/utils/asset-url";
import { useRowSelection } from "@/shared/hooks/use-row-selection";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";
import { AssistantFormDialog } from "./AssistantFormDialog";
import { DeleteAssistantDialog } from "./DeleteAssistantDialog";
import { BulkDeleteAssistantsDialog } from "./BulkDeleteAssistantsDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
type StatusFilter = "all" | "active" | "inactive";
const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Semua Status" },
  { value: "active", label: "Aktif" },
  { value: "inactive", label: "Nonaktif" },
];

export function AssistantsFeature() {
  const { data: assistants = [], isLoading, isError } = useAdminAssistants();
  const { mutate: updateAssistant, variables: togglingVariables } =
    useUpdateAssistant();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingAssistant, setEditingAssistant] =
    useState<AdminAssistantProfile | null>(null);
  const [deletingAssistant, setDeletingAssistant] =
    useState<AdminAssistantProfile | null>(null);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, statusFilter, pageSize]);

  const filteredSorted = useMemo(() => {
    let result = assistants.filter(
      (a) =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.position.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    if (statusFilter === "active") result = result.filter((a) => a.isActive);
    if (statusFilter === "inactive") result = result.filter((a) => !a.isActive);
    return [...result].sort((a, b) => a.order - b.order);
  }, [assistants, searchQuery, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSorted.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredSorted.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const {
    selectedIds,
    toggleRow,
    selectedItems,
    toggleList,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  } = useRowSelection(paginated, (a) => a.id);

  const isTogglingRow = (id: string) => togglingVariables?.id === id;

  const columns: DataTableColumn<AdminAssistantProfile>[] = [
    {
      key: "photo",
      header: "Foto",
      headerClassName:
        "w-16 px-6 py-3.5 font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (a) => (
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-white/60 bg-white/50 shadow-sm backdrop-blur-md">
          {a.photoUrl ? (
            <Image
              src={resolveAssetUrl(a.photoUrl)}
              alt={a.name}
              width={44}
              height={44}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <ImageOff className="h-4 w-4 text-grey-300" strokeWidth={1.5} />
          )}
        </div>
      ),
    },
    {
      key: "name",
      header: "Nama",
      render: (a) => (
        <div>
          <p className="text-sm font-medium tracking-tight text-grey-900">
            {a.name}
          </p>
          <p className="mt-0.5 font-secondary text-xs tracking-tight text-grey-500">
            {a.position}
          </p>
        </div>
      ),
    },
    {
      key: "order",
      header: "Urutan",
      render: (a) => (
        <span className="font-secondary text-sm font-medium tracking-tight text-grey-600">
          {a.order}
        </span>
      ),
    },
    {
      key: "status",
      header: "Tampil di Publik",
      render: (a) => (
        <div className="flex items-center gap-2.5">
          <Switch
            checked={a.isActive}
            disabled={isTogglingRow(a.id)}
            onCheckedChange={(checked) =>
              updateAssistant({ id: a.id, payload: { isActive: checked } })
            }
          />
          <span className="font-secondary text-xs font-medium tracking-tight text-grey-500">
            {a.isActive ? "Aktif" : "Nonaktif"}
          </span>
        </div>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (a) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => {
              setEditingAssistant(a);
              setFormOpen(true);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setDeletingAssistant(a)}
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
      title="Asisten Laboratorium"
      description="Kelola profil, foto, dan urutan tampil asisten di halaman publik."
      headerActions={
        <Button
          onClick={() => {
            setEditingAssistant(null);
            setFormOpen(true);
          }}
          className="h-10 shrink-0 rounded-xl px-4 shadow-md font-medium tracking-tight"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Tambah Asisten
        </Button>
      }
      selectedCount={selectedIds.size}
      itemLabel="asisten"
      onClearSelection={clearSelection}
      bulkActions={
        <Button
          variant="danger"
          className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} /> Hapus{" "}
          {selectedIds.size} Profil
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama atau posisi..."
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
            widthClassName="sm:w-48"
            hideCheckIcon={true}
          />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={paginated}
        rowKey={(a) => a.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data asisten."
        emptyIcon={UserRoundCheck}
        emptyTitle={
          assistants.length === 0
            ? "Belum ada profil asisten"
            : "Tidak ada asisten yang cocok"
        }
        emptyDescription={
          assistants.length === 0
            ? 'Klik "Tambah Asisten" untuk membuat profil pertama.'
            : "Coba ubah kata kunci pencarian atau filter."
        }
        selection={{
          isAllSelected: isListAllSelected(paginated),
          isSomeSelected: isListSomeSelected(paginated),
          onToggleRow: toggleRow,
          onToggleAll: () => toggleList(paginated),
          isRowSelected: (id) => selectedIds.has(id),
        }}
        page={safePage}
        pageSize={pageSize}
        totalItems={filteredSorted.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="asisten"
      />

      <AssistantFormDialog
        assistant={editingAssistant}
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditingAssistant(null);
        }}
      />
      <DeleteAssistantDialog
        assistant={deletingAssistant}
        onOpenChange={(open) => !open && setDeletingAssistant(null)}
      />
      <BulkDeleteAssistantsDialog
        assistants={selectedItems}
        open={bulkDeleteOpen}
        onOpenChange={setBulkDeleteOpen}
        onDeleted={clearSelection}
      />
    </AdminPageLayout>
  );
}
