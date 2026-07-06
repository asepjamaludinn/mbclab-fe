"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, HelpCircle, Pencil, Trash2, UploadCloud } from "lucide-react";
import { useAdminQuestions } from "../hooks/use-admin-questions";
import { AdminQuestion, QuestionType } from "../types/admin-question.type";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { QuestionFormDialog } from "./QuestionFormDialog";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";
import { BulkImportQuestionsDialog } from "./BulkImportQuestionsDialog";

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

type TypeFilter = "" | QuestionType;

const TYPE_OPTIONS: { value: TypeFilter; label: string }[] = [
  { value: "", label: "Semua Jenis" },
  { value: "TA", label: "Tes Awal (TA)" },
  { value: "TP", label: "Tugas Pendahuluan (TP)" },
];

export function QuestionsFeature() {
  const [moduleId, setModuleId] = useState("");
  const [type, setType] = useState<TypeFilter>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(
    null,
  );
  const [deletingQuestion, setDeletingQuestion] =
    useState<AdminQuestion | null>(null);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    setPage(1);
  }, [moduleId, type, pageSize]);

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

  const { data, isLoading, isError } = useAdminQuestions({
    page,
    limit: pageSize,
    moduleId: moduleId || undefined,
    type: (type || undefined) as QuestionType | undefined,
  });

  const questions = data?.data ?? [];
  const meta = data?.meta;

  const openCreateDialog = () => {
    setEditingQuestion(null);
    setFormOpen(true);
  };

  const openEditDialog = (question: AdminQuestion) => {
    setEditingQuestion(question);
    setFormOpen(true);
  };

  const columns: DataTableColumn<AdminQuestion>[] = [
    {
      key: "content",
      header: "Pertanyaan",
      cellClassName: "px-6 py-4 max-w-md",
      render: (q) => (
        <div>
          <p className="line-clamp-2 text-sm font-semibold text-grey-900">
            {q.content}
          </p>
          <p className="mt-1 font-secondary text-xs text-grey-500">
            Modul {q.module?.order} — {q.module?.title}
          </p>
        </div>
      ),
    },
    {
      key: "type",
      header: "Jenis",
      render: (q) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-xs font-bold ${
            q.type === "TA"
              ? "bg-warning/10 text-warning-700"
              : "bg-info/10 text-info-700"
          }`}
        >
          {q.type === "TA" ? "Tes Awal" : "Tugas Pendahuluan"}
        </span>
      ),
    },
    {
      key: "answer",
      header: "Jawaban Benar",
      render: (q) =>
        q.type === "TA" ? (
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/10 font-secondary text-xs font-bold text-success">
            {q.correctAnswer}
          </span>
        ) : (
          <span className="font-secondary text-xs text-grey-400">-</span>
        ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      render: (q) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            onClick={() => openEditDialog(q)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-primary/10 hover:text-primary"
            aria-label="Ubah soal"
          >
            <Pencil className="h-4 w-4" strokeWidth={2} />
          </button>
          <button
            onClick={() => setDeletingQuestion(q)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-grey-400 transition hover:bg-error/10 hover:text-error"
            aria-label="Hapus soal"
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
            Bank Soal
          </h1>
          <p className="mt-1 font-secondary text-sm text-grey-500">
            Kelola soal Tugas Pendahuluan (TP) dan Tes Awal (TA) per modul.
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="h-10 rounded-lg px-4 shadow-sm"
          >
            <UploadCloud className="mr-2 h-4 w-4" strokeWidth={2} />
            Import CSV
          </Button>
          <Button
            onClick={openCreateDialog}
            className="h-10 rounded-lg px-4 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={2} />
            Tambah Soal
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <FilterDropdown
          value={moduleId}
          options={moduleOptions}
          onChange={setModuleId}
          widthClassName="sm:w-64"
        />
        <FilterDropdown
          value={type}
          options={TYPE_OPTIONS}
          onChange={setType}
          widthClassName="sm:w-56"
        />
      </div>

      <DataTable
        columns={columns}
        data={questions}
        rowKey={(q) => q.id}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Gagal memuat bank soal."
        emptyIcon={HelpCircle}
        emptyTitle="Belum ada soal"
        emptyDescription='Klik "Tambah Soal" untuk membuat soal pertama.'
        page={page}
        pageSize={pageSize}
        totalItems={meta?.total ?? 0}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        itemsLabel="soal"
      />

      <QuestionFormDialog
        question={editingQuestion}
        open={formOpen}
        onOpenChange={(o) => {
          setFormOpen(o);
          if (!o) setEditingQuestion(null);
        }}
        defaultModuleId={moduleId || undefined}
      />
      <DeleteQuestionDialog
        question={deletingQuestion}
        onOpenChange={(open) => !open && setDeletingQuestion(null)}
      />
      <BulkImportQuestionsDialog
        open={importOpen}
        onOpenChange={setImportOpen}
      />
    </div>
  );
}
