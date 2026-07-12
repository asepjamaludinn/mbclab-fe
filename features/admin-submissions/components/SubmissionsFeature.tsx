"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, FileText, Eye, ExternalLink } from "lucide-react";
import { useAdminSubmissions } from "../hooks/use-admin-submissions";
import { AdminSubmission } from "../types/admin-submission.type";
import { useStudentModules } from "@/features/student-modules";
import { useAdminGroups } from "@/features/admin-groups/hooks/use-admin-groups";
import { getInitials } from "@/shared/utils/string";
import { resolveAssetUrl } from "@/shared/utils/asset-url";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { PreviewSubmissionDialog } from "./PreviewSubmissionDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export function SubmissionsFeature() {
  const [searchInput, setSearchInput] = useState("");
  const [nim, setNim] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [previewingSubmission, setPreviewingSubmission] =
    useState<AdminSubmission | null>(null);

  useEffect(() => {
    const timeout = setTimeout(() => setNim(searchInput.trim()), 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [nim, moduleId, groupId, pageSize]);

  const { data: modulesRes } = useStudentModules(1, 50);
  const modules = modulesRes?.data ?? [];

  const moduleOptions = useMemo(
    () => [
      { value: "", label: "Semua Modul" },
      ...modules.map((m) => ({
        value: m.id,
        label: `Modul ${m.order} — ${m.title}`,
      })),
    ],
    [modules],
  );

  const { data: groupsRes } = useAdminGroups({ page: 1, limit: 200 });
  const groups = groupsRes?.data ?? [];

  const groupOptions = useMemo(
    () => [
      { value: "", label: "Semua Kelompok" },
      ...groups.map((g) => ({ value: g.id, label: g.name })),
    ],
    [groups],
  );

  const { data, isLoading, isError } = useAdminSubmissions({
    moduleId: moduleId || undefined,
    groupId: groupId || undefined,
    nim: nim || undefined,
    page,
    limit: pageSize,
  });

  const submissions = data?.data ?? [];
  const meta = data?.meta;

  const columns: DataTableColumn<AdminSubmission>[] = [
    {
      key: "student",
      header: "Praktikan",
      render: (s) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-bold text-primary">
            {getInitials(s.student.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-grey-900">
              {s.student.name}
            </p>
            <p className="font-secondary text-xs text-grey-500">
              {s.student.nim}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "group",
      header: "Kelompok",
      render: (s) =>
        s.student.group?.name ? (
          <span className="font-secondary text-sm text-grey-600">
            {s.student.group.name}
          </span>
        ) : (
          <span className="font-secondary text-sm text-grey-400">
            Belum ada
          </span>
        ),
    },
    {
      key: "module",
      header: "Modul",
      render: (s) => (
        <span className="font-secondary text-sm text-grey-700">
          {s.module.title}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Dikumpulkan",
      render: (s) => (
        <span className="font-secondary text-sm text-grey-600">
          {new Date(s.createdAt).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-xs font-bold ${
            s.isLate ? "bg-error/10 text-error" : "bg-success/10 text-success"
          }`}
        >
          {s.isLate ? "Terlambat" : "Tepat Waktu"}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (s) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setPreviewingSubmission(s)}
            title="Lihat PDF"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Lihat file PDF"
          >
            <Eye className="h-4 w-4" strokeWidth={2} />
          </button>

          <a
            href={resolveAssetUrl(s.fileUrl)}
            target="_blank"
            rel="noopener noreferrer"
            title="Buka di Tab Baru"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Buka file di tab baru"
          >
            <ExternalLink className="h-4 w-4" strokeWidth={2} />
          </a>
        </div>
      ),
    },
  ];

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <div>
        <h1 className="font-primary text-2xl font-bold tracking-tight text-grey-900">
          Pengumpulan TP
        </h1>
        <p className="mt-1 font-secondary text-sm text-grey-500">
          Lihat dan unduh file Tugas Pendahuluan (PDF) yang dikumpulkan
          praktikan.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex h-11 flex-1 items-center rounded-xl border border-grey-200 bg-white px-4 sm:max-w-md">
          <Search className="mr-2.5 h-4 w-4 text-grey-400" strokeWidth={2} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari berdasarkan NIM..."
            className="flex-1 bg-transparent text-sm text-grey-900 placeholder:text-grey-400 focus:outline-none"
          />
        </div>

        <FilterDropdown
          value={moduleId}
          options={moduleOptions}
          onChange={setModuleId}
          widthClassName="sm:w-64"
        />

        <FilterDropdown
          value={groupId}
          options={groupOptions}
          onChange={setGroupId}
          widthClassName="sm:w-56"
        />
      </div>

      <DataTable
        columns={columns}
        data={submissions}
        rowKey={(s) => s.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data pengumpulan TP."
        emptyIcon={FileText}
        emptyTitle="Belum ada TP yang dikumpulkan"
        emptyDescription="File akan muncul di sini setelah praktikan mengunggah Tugas Pendahuluan."
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="pengumpulan"
      />

      <PreviewSubmissionDialog
        submission={previewingSubmission}
        onOpenChange={(open) => !open && setPreviewingSubmission(null)}
      />
    </div>
  );
}
