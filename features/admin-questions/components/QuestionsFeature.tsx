"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, HelpCircle, Pencil, Trash2, UploadCloud } from "lucide-react";
import { useAdminQuestions } from "../hooks/use-admin-questions";
import { AdminQuestion, QuestionType } from "../types/admin-question.type";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import { DataTable, DataTableColumn } from "@/shared/components/ui/data-table";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import { useRowSelection } from "@/shared/hooks/use-row-selection";
import { AdminPageLayout } from "@/shared/components/layout/AdminPageLayout";
import { QuestionFormDialog } from "./QuestionFormDialog";
import { DeleteQuestionDialog } from "./DeleteQuestionDialog";
import { BulkImportQuestionsDialog } from "./BulkImportQuestionsDialog";
import { BulkDeleteQuestionsDialog } from "./BulkDeleteQuestionsDialog";

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
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
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

  const {
    selectedIds,
    toggleRow,
    toggleList,
    selectedItems,
    clearSelection,
    isListAllSelected,
    isListSomeSelected,
  } = useRowSelection(questions, (q) => q.id);

  const columns: DataTableColumn<AdminQuestion>[] = [
    {
      key: "module",
      header: "Modul",
      cellClassName: "px-6 py-5 align-top",
      render: (q) => (
        <div className="pt-0.5">
          <span className="whitespace-nowrap font-secondary text-sm font-medium tracking-tight text-grey-900">
            Modul{" "}
            {q.module?.order ??
              modules.find((m) => m.id === q.moduleId)?.order ??
              "-"}
          </span>
        </div>
      ),
    },
    {
      key: "type",
      header: "Jenis",
      cellClassName: "px-6 py-5 align-top",
      render: (q) => (
        <div className="flex flex-col items-start gap-1.5 pt-0.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 font-secondary text-[10px] font-bold tracking-tight backdrop-blur-md border ${
              q.type === "TA"
                ? "bg-warning/10 text-warning-700 border-warning/10"
                : "bg-info/10 text-info-700 border-info/10"
            }`}
          >
            {q.type}
          </span>
          {q.type === "TP" && q.tpVariant && q.tpVariant !== "ALL" && (
            <span className="inline-flex items-center rounded-full bg-grey-100 border border-grey-200 px-2 py-0.5 font-secondary text-[10px] font-semibold text-grey-600">
              {q.tpVariant === "EVEN" ? "Genap" : "Ganjil"}
            </span>
          )}
        </div>
      ),
    },
    {
      key: "content",
      header: "Pertanyaan",
      cellClassName:
        "px-6 py-5 align-top max-w-xs sm:max-w-sm lg:max-w-2xl xl:max-w-3xl",
      render: (q) => (
        <div className="flex flex-col gap-2.5">
          {/* Pertanyaan ID */}
          <div className="flex items-start gap-3">
            <span className="mt-[3px] flex h-5 w-7 shrink-0 items-center justify-center rounded border border-primary/20 bg-primary/10 font-secondary text-[9px] font-extrabold tracking-wider text-primary">
              ID
            </span>
            <p className="text-[13px] font-medium leading-relaxed tracking-tight text-grey-900 whitespace-pre-wrap">
              {q.content}
            </p>
          </div>

          {/* Pertanyaan EN */}
          {q.contentEn ? (
            <div className="flex items-start gap-3">
              <span className="mt-[3px] flex h-5 w-7 shrink-0 items-center justify-center rounded border border-grey-300 bg-grey-200/50 font-secondary text-[9px] font-extrabold tracking-wider text-grey-600">
                EN
              </span>
              <p className="text-[13px] font-medium leading-relaxed tracking-tight text-grey-500 whitespace-pre-wrap">
                {q.contentEn}
              </p>
            </div>
          ) : (
            <div className="flex items-start gap-3">
              <div className="w-7 shrink-0" />
              <p className="mt-1 font-secondary text-[11px] italic text-grey-400">
                *Belum ada terjemahan bahasa Inggris
              </p>
            </div>
          )}
        </div>
      ),
    },
    {
      key: "answer",
      header: "Answer",
      cellClassName: "px-6 py-5 align-top",
      render: (q) => (
        <div className="pt-0.5">
          {q.type === "TA" ? (
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-success/10 border border-success/10 backdrop-blur-md font-secondary text-xs font-bold tracking-tight text-success">
              {q.correctAnswer}
            </span>
          ) : (
            <span className="font-secondary text-xs font-medium text-grey-400">
              -
            </span>
          )}
        </div>
      ),
    },
    {
      key: "actions",
      header: "Aksi",
      headerClassName:
        "px-6 py-3.5 text-right font-secondary text-[11px] font-bold uppercase tracking-wider text-grey-500",
      cellClassName: "px-6 py-5 align-top",
      render: (q) => (
        <div className="flex items-start justify-end gap-1.5 pt-0.5">
          <button
            onClick={() => {
              setEditingQuestion(q);
              setFormOpen(true);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-grey-500 transition-all hover:bg-white hover:text-primary hover:shadow-sm"
          >
            <Pencil className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setDeletingQuestion(q)}
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
      title="Bank Soal"
      description="Kelola soal Tugas Pendahuluan (TP) dan Tes Awal (TA) per modul."
      headerActions={
        <>
          <Button
            variant="outline"
            onClick={() => setImportOpen(true)}
            className="h-10 rounded-xl px-4 shadow-sm border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80 font-medium tracking-tight"
          >
            <UploadCloud className="mr-2 h-4 w-4" strokeWidth={1.5} /> Impor CSV
          </Button>
          <Button
            onClick={() => {
              setEditingQuestion(null);
              setFormOpen(true);
            }}
            className="h-10 rounded-xl px-4 shadow-md font-medium tracking-tight"
          >
            <Plus className="mr-2 h-4 w-4" strokeWidth={1.5} /> Tambah Soal
          </Button>
        </>
      }
      selectedCount={selectedIds.size}
      itemLabel="soal"
      onClearSelection={clearSelection}
      bulkActions={
        <Button
          variant="danger"
          className="h-9 rounded-lg px-3 text-xs font-medium tracking-tight"
          onClick={() => setBulkDeleteOpen(true)}
        >
          <Trash2 className="mr-1.5 h-3.5 w-3.5" strokeWidth={1.5} />
          Hapus {selectedIds.size} Soal
        </Button>
      }
      filters={
        <>
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
        </>
      }
    >
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
        selection={{
          isAllSelected: isListAllSelected(questions),
          isSomeSelected: isListSomeSelected(questions),
          onToggleRow: toggleRow,
          onToggleAll: () => toggleList(questions),
          isRowSelected: (id) => selectedIds.has(id),
        }}
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
      <BulkDeleteQuestionsDialog
        questions={selectedItems}
        open={bulkDeleteOpen} 
        onOpenChange={setBulkDeleteOpen}
        onDeleted={clearSelection}
      />
    </AdminPageLayout>
  );
}
