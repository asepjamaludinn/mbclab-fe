"use client";

import { useRef, useState } from "react";
import { UploadCloud, Download, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useBulkImportQuestions } from "../hooks/use-admin-questions";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { BulkImportQuestionsResult } from "../types/admin-question.type";

const CSV_TEMPLATE = `type,content,optionA,optionB,optionC,optionD,optionE,correctAnswer
TA,Apa kepanjangan dari CPU?,Central Processing Unit,Central Program Unit,Computer Personal Unit,Central Peripheral Unit,Central Process Utility,A
TP,Jelaskan prinsip kerja transistor.,,,,,,`;

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function BulkImportQuestionsDialog({ open, onOpenChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [moduleId, setModuleId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BulkImportQuestionsResult | null>(null);

  const { data: modulesRes } = useStudentModules(1, 50);
  const modules = modulesRes?.data ?? [];

  const { mutateAsync: bulkImport, isPending } = useBulkImportQuestions();

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "template_soal.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSubmit = async () => {
    setError("");
    setResult(null);
    if (!moduleId) {
      setError("Pilih modul tujuan terlebih dahulu.");
      return;
    }
    if (!file) {
      setError("Pilih file CSV terlebih dahulu.");
      return;
    }
    try {
      const res = await bulkImport({ moduleId, file });
      setResult(res);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal mengimpor soal."
          : "Gagal mengimpor soal.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setFile(null);
          setModuleId("");
          setError("");
          setResult(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
            <UploadCloud className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Impor Soal (CSV)</DialogTitle>
          <DialogDescription>
            Kolom wajib: type, content. Untuk soal TA, wajib juga optionA-E dan
            correctAnswer (A-E).
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-4 inline-flex items-center gap-1.5 font-secondary text-xs font-bold text-primary hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          Unduh template CSV
        </button>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
              Modul Tujuan
            </label>
            <select
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
            >
              <option value="">Pilih modul...</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  Modul {m.order} — {m.title}
                </option>
              ))}
            </select>
          </div>

          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-2xl border-2 border-dashed border-grey-200 p-5 text-center transition hover:border-primary/40 hover:bg-grey-50"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="font-secondary text-xs font-semibold text-grey-700">
              {file ? file.name : "Klik untuk pilih file CSV"}
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm text-success">
                {result.importedCount} soal berhasil diimpor.
              </div>
              {result.failedRows.length > 0 && (
                <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-700" />
                    <div className="min-w-0 flex-1">
                      <p className="font-secondary text-sm font-bold text-warning-700">
                        {result.failedRows.length} baris gagal
                      </p>
                      <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
                        {result.failedRows.map((r) => (
                          <li
                            key={r.row}
                            className="font-secondary text-xs text-warning-700/90"
                          >
                            Baris {r.row}: {r.reason}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Mengimpor..." : "Impor Soal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
