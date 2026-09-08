"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Search,
  Users,
  Pencil,
  KeyRound,
  ShieldOff,
  ShieldCheck,
  Trash2,
  SlidersHorizontal,
} from "lucide-react";
import { useAdminStudents } from "../hooks/use-admin-students";
import { AdminStudent, StudentStatusFilter } from "../types/admin-student.type";
import { useAdminGroups } from "@/features/admin-groups/hooks/use-admin-groups";
import { Button } from "@/shared/components/ui/button";
import { getInitials } from "@/shared/utils/string";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { useRowSelection } from "@/shared/hooks/use-row-selection";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";
import { StudentFormDialog } from "./StudentFormDialog";
import { EditStudentDialog } from "./EditStudentDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { StatusToggleDialog } from "./StatusToggleDialog";
import { DeleteStudentDialog } from "./DeleteStudentDialog";
import {
  BulkStudentActionDialog,
  BulkStudentAction,
} from "./BulkStudentActionDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];
const STATUS_OPTIONS: { value: StudentStatusFilter; label: string }[] = [
  { value: "active", label: "Akun Aktif" },
  { value: "inactive", label: "Akun Nonaktif" },
  { value: "all", label: "Semua Status" },
];

export function StudentsFeature() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [groupId, setGroupId] = useState("");
  const [status, setStatus] = useState<StudentStatusFilter>("active");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<AdminStudent | null>(
    null,
  );
  const [resettingStudent, setResettingStudent] = useState<AdminStudent | null>(
    null,
  );
  const [togglingStudent, setTogglingStudent] = useState<AdminStudent | null>(
    null,
  );
  const [deletingStudent, setDeletingStudent] = useState<AdminStudent | null>(
    null,
  );
  const [bulkAction, setBulkAction] = useState<BulkStudentAction | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, groupId, status, pageSize]);

  const { data: groupsRes } = useAdminGroups({ page: 1, limit: 200 });
  const groups = groupsRes?.data ?? [];
  const groupOptions = useMemo(
    () => [
      { value: "", label: "Semua Kelompok" },
      ...groups.map((g) => ({ value: g.id, label: g.name })),
    ],
    [groups],
  );

  const { data, isLoading, isError } = useAdminStudents({
    page,
    limit: pageSize,
    search,
    groupId,
    status,
  });
  const students = data?.data ?? [];
  const meta = data?.meta;

  const {
    selectedIds,
    selectedItems: selectedStudents,
    toggleRow,
    toggleList,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  } = useRowSelection(students, (s) => s.id);

  const columns: DataTableColumn<AdminStudent>[] = [
    {
      key: "name",
      header: "Nama",
      render: (student) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-medium text-primary">
            {getInitials(student.name)}
          </div>
          <span className="text-sm font-medium tracking-tight text-grey-900">
            {student.name}
          </span>
        </div>
      ),
    },
    {
      key: "nim",
      header: "NIM",
      render: (student) => (
        <span className="font-secondary text-sm tracking-tight text-grey-500">
          {student.nim}
        </span>
      ),
    },
    {
      key: "group",
      header: "Kelompok",
      render: (student) =>
        student.group?.name ? (
          <span className="font-secondary text-sm font-medium tracking-tight text-grey-600">
            {student.group.name}
          </span>
        ) : (
          <span className="font-secondary text-sm font-medium tracking-tight text-grey-400">
            Belum ada
          </span>
        ),
    },
    {
      key: "class",
      header: "Kelas",
      render: (student) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-[10px] font-medium tracking-tight backdrop-blur-md border ${
            student.isInternational
              ? "bg-primary/10 text-primary border-primary/10"
              : "bg-grey-100/50 text-grey-500 border-grey-200/50"
          }`}
        >
          {student.isInternational ? "Internasional" : "Reguler"}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (student) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-[10px] font-medium tracking-tight backdrop-blur-md border ${
            student.isDeleted
              ? "bg-error/10 text-error border-error/10"
              : "bg-success/10 text-success border-success/10"
          }`}
        >
          {student.isDeleted ? "Nonaktif" : "Aktif"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (student) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setEditingStudent(student)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setResettingStudent(student)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-warning hover:shadow-sm"
          >
            <KeyRound className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setTogglingStudent(student)}
            className={`flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:shadow-sm ${
              student.isDeleted ? "hover:text-success" : "hover:text-error"
            }`}
          >
            {student.isDeleted ? (
              <ShieldCheck className="h-4 w-4" strokeWidth={1.5} />
            ) : (
              <ShieldOff className="h-4 w-4" strokeWidth={1.5} />
            )}
          </button>
          <button
            onClick={() => setDeletingStudent(student)}
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
      title="Praktikan"
      description="Kelola akun, kelompok, dan status aktif praktikan."
      headerActions={
        <Button
          onClick={() => setFormOpen(true)}
          className="h-10 shrink-0 rounded-xl px-4 shadow-md font-medium tracking-tight"
        >
          <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Tambah Praktikan
        </Button>
      }
      selectedCount={selectedIds.size}
      itemLabel="praktikan"
      onClearSelection={clearSelection}
      bulkActions={
        <>
          <Button
            type="button"
            variant="default"
            className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
            onClick={() => setBulkAction("activate")}
          >
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />{" "}
            Aktifkan
          </Button>
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
            onClick={() => setBulkAction("deactivate")}
          >
            <ShieldOff className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />{" "}
            Nonaktifkan
          </Button>
          <Button
            type="button"
            variant="danger"
            className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight shadow-sm"
            onClick={() => setBulkAction("delete")}
          >
            <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} /> Hapus
          </Button>
        </>
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
              placeholder="Cari nama atau NIM..."
              className="flex-1 bg-transparent text-sm font-medium tracking-tight text-grey-900 placeholder:font-normal placeholder:text-grey-400 focus:outline-none"
            />
          </div>
          <FilterDropdown
            value={groupId}
            options={groupOptions}
            onChange={setGroupId}
            widthClassName="sm:w-56"
            hideCheckIcon={true}
          />
          <FilterDropdown
            icon={
              <SlidersHorizontal
                className="h-4 w-4 shrink-0 text-grey-400"
                strokeWidth={1.5}
              />
            }
            value={status}
            options={STATUS_OPTIONS}
            onChange={setStatus}
            widthClassName="sm:w-48"
            hideCheckIcon={true}
          />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={students}
        rowKey={(s) => s.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data praktikan."
        emptyIcon={Users}
        emptyTitle="Tidak ada praktikan yang cocok"
        emptyDescription="Coba ubah kata kunci pencarian atau filter."
        selection={{
          isAllSelected: isListAllSelected(students),
          isSomeSelected: isListSomeSelected(students),
          onToggleRow: toggleRow,
          onToggleAll: () => toggleList(students),
          isRowSelected: (id) => selectedIds.has(id),
        }}
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="praktikan"
      />

      <StudentFormDialog open={formOpen} onOpenChange={setFormOpen} />
      <EditStudentDialog
        student={editingStudent}
        groups={groups}
        onOpenChange={(open) => !open && setEditingStudent(null)}
      />
      <ResetPasswordDialog
        student={resettingStudent}
        onOpenChange={(open) => !open && setResettingStudent(null)}
      />
      <StatusToggleDialog
        student={togglingStudent}
        onOpenChange={(open) => !open && setTogglingStudent(null)}
      />
      <DeleteStudentDialog
        student={deletingStudent}
        onOpenChange={(open) => !open && setDeletingStudent(null)}
      />
      {bulkAction && (
        <BulkStudentActionDialog
          students={selectedStudents}
          action={bulkAction}
          open={!!bulkAction}
          onOpenChange={(open) => !open && setBulkAction(null)}
          onDone={clearSelection}
        />
      )}
    </AdminPageLayout>
  );
}
