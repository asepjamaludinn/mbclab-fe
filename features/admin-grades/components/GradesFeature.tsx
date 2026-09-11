"use client";

import { useEffect, useMemo, useState } from "react";
import { Search, Download, Pencil, GraduationCap, Eye } from "lucide-react";
import { useAdminGrades } from "../hooks/use-admin-grades";
import { AdminGrade } from "../types/admin-grade.type";
import { adminGradeService } from "../services/admin-grade.service";
import { useStudentModules } from "@/features/student-modules";
import { useAdminGroups } from "@/features/admin-groups/hooks/use-admin-groups";
import { Button } from "@/shared/components/ui/button";
import { getInitials } from "@/shared/utils/string";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";
import { EditTpScoreDialog } from "./EditTpScoreDialog";
import { ExamReviewDialog } from "./ExamReviewDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

function formatScore(score: number | null) {
  if (score === null || score === undefined) return "-";
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function ScorePill({
  score,
  tone,
}: {
  score: number | null;
  tone: "info" | "warning";
}) {
  if (score === null) {
    return (
      <span className="inline-flex items-center rounded-full border border-grey-200/50 bg-grey-100/50 px-2.5 py-1 font-secondary text-xs font-medium tracking-tight text-grey-500 backdrop-blur-md">
        Belum ada
      </span>
    );
  }

  const toneClass =
    tone === "info"
      ? "bg-info/10 text-info-700 border-info/10"
      : "bg-warning/10 text-warning-700 border-warning/10";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 font-secondary text-xs font-medium tracking-tight backdrop-blur-md ${toneClass}`}
    >
      {formatScore(score)}
    </span>
  );
}

export function GradesFeature() {
  const [searchInput, setSearchInput] = useState("");
  const [nim, setNim] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [groupId, setGroupId] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [editingGrade, setEditingGrade] = useState<AdminGrade | null>(null);
  const [reviewingGrade, setReviewingGrade] = useState<AdminGrade | null>(null);

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

  const { data, isLoading, isError } = useAdminGrades({
    moduleId: moduleId || undefined,
    groupId: groupId || undefined,
    nim: nim || undefined,
    page,
    limit: pageSize,
  });

  const grades = data?.data ?? [];
  const meta = data?.meta;

  const columns: DataTableColumn<AdminGrade>[] = [
    {
      key: "student",
      header: "Praktikan",
      render: (grade) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-secondary text-xs font-medium text-primary">
            {getInitials(grade.student.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium tracking-tight text-grey-900">
              {grade.student.name}
            </p>
            <p className="font-secondary text-xs tracking-tight text-grey-500">
              {grade.student.nim}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "group",
      header: "Kelompok",
      render: (grade) =>
        grade.student.group?.name ? (
          <span className="font-secondary text-sm font-medium tracking-tight text-grey-600">
            {grade.student.group.name}
          </span>
        ) : (
          <span className="font-secondary text-sm font-medium tracking-tight text-grey-400">
            Belum ada
          </span>
        ),
    },
    {
      key: "module",
      header: "Modul",
      render: (grade) => (
        <span className="font-secondary text-sm font-medium tracking-tight text-grey-700">
          {grade.module.title}
        </span>
      ),
    },
    {
      key: "tpScore",
      header: "Nilai TP",
      render: (grade) => <ScorePill score={grade.tpScore} tone="info" />,
    },
    {
      key: "taScore",
      header: "Nilai TA",
      render: (grade) => <ScorePill score={grade.taScore} tone="warning" />,
    },
    {
      key: "average",
      header: "Rata-rata",
      render: (grade) => {
        const hasBoth = grade.tpScore !== null && grade.taScore !== null;
        const average = hasBoth
          ? ((grade.tpScore as number) + (grade.taScore as number)) / 2
          : null;

        return (
          <span className="font-secondary text-sm font-medium tracking-tighter text-grey-900">
            {average !== null ? formatScore(average) : "-"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-medium uppercase tracking-wider text-grey-500",
      render: (grade) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => setEditingGrade(grade)}
            title="Ubah Nilai TP"
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
            aria-label="Ubah nilai TP"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => grade.taScore !== null && setReviewingGrade(grade)}
            disabled={grade.taScore === null}
            title={
              grade.taScore === null
                ? "Belum ada hasil TA"
                : "Lihat Detail Jawaban TA"
            }
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:shadow-none"
            aria-label="Lihat detail jawaban TA"
          >
            <Eye className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <AdminPageLayout
      title="Nilai & TP"
      description="Pantau nilai TP dan TA seluruh praktikan per modul praktikum."
      headerActions={
        <a
          href={adminGradeService.exportCsvUrl()}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button
            variant="outline"
            className="h-10 rounded-xl px-4 shadow-sm border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80 font-medium tracking-tight"
          >
            <Download className="mr-2 h-4 w-4" strokeWidth={1.5} />
            Export CSV
          </Button>
        </a>
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
              placeholder="Cari berdasarkan NIM..."
              className="flex-1 bg-transparent text-sm font-medium tracking-tight text-grey-900 placeholder:font-normal placeholder:text-grey-400 focus:outline-none"
            />
          </div>

          <FilterDropdown
            value={moduleId}
            options={moduleOptions}
            onChange={setModuleId}
            widthClassName="sm:w-64"
            hideCheckIcon={true}
          />

          <FilterDropdown
            value={groupId}
            options={groupOptions}
            onChange={setGroupId}
            widthClassName="sm:w-56"
            hideCheckIcon={true}
          />
        </>
      }
    >
      <DataTable
        columns={columns}
        data={grades}
        rowKey={(g) => g.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat data nilai."
        emptyIcon={GraduationCap}
        emptyTitle="Belum ada data nilai"
        emptyDescription="Nilai TP akan muncul setelah praktikan mengumpulkan TP, dan nilai TA setelah mengikuti ujian."
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="data nilai"
      />

      <EditTpScoreDialog
        grade={editingGrade}
        onOpenChange={(open) => !open && setEditingGrade(null)}
      />

      <ExamReviewDialog
        moduleId={reviewingGrade?.moduleId ?? null}
        studentId={reviewingGrade?.studentId ?? null}
        studentName={reviewingGrade?.student.name}
        onOpenChange={(open) => !open && setReviewingGrade(null)}
      />
    </AdminPageLayout>
  );
}
