"use client";

import { useRef, useState, useMemo } from "react";
import { UploadCloud, Download, AlertTriangle } from "lucide-react";
import axios from "axios";
import { useBulkImportQuestions } from "../hooks/use-admin-questions";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
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

const CSV_TEMPLATE = `type,tpVariant,content,contentEn,optionA,optionAEn,optionB,optionBEn,optionC,optionCEn,optionD,optionDEn,optionE,optionEEn,correctAnswer
TA,ALL,Apa kepanjangan dari CPU?,What does CPU stand for?,Central Processing Unit,Central Processing Unit,Central Program Unit,Central Program Unit,Computer Personal Unit,Computer Personal Unit,Central Peripheral Unit,Central Peripheral Unit,Central Process Utility,Central Process Utility,A
TP,ALL,Jelaskan prinsip kerja transistor umum.,Explain the working principle.,,,,,,,,,,,
TP,ODD,Soal ini khusus NIM ganjil.,This is odd question.,,,,,,,,,,,
TP,EVEN,Soal ini khusus NIM genap.,This is even question.,,,,,,,,,,,`;

type Props = { open: boolean; onOpenChange: (open: boolean) => void };

export function BulkImportQuestionsDialog({ open, onOpenChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [moduleId, setModuleId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [result, setResult] = useState<BulkImportQuestionsResult | null>(null);

  const { data: modulesRes } = useStudentModules(1, 50);
  const modules = modulesRes?.data ?? [];

  const moduleOptions = useMemo(
    () => [
      { value: "", label: "Pilih modul..." },
      ...modules.map((m) => ({
        value: m.id,
        label: `Modul ${m.order} — ${m.title}`,
      })),
    ],
    [modules],
  );

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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
            <UploadCloud className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Impor Soal (CSV)
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Kolom wajib: type, content. Untuk soal TA, wajib juga optionA-E dan
            correctAnswer (A-E). Untuk soal TP, kolom tpVariant menentukan
            target: ALL, ODD (ganjil), atau EVEN (genap).
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={downloadTemplate}
          className="mt-4 inline-flex items-center gap-1.5 font-secondary text-xs font-medium tracking-tight text-primary hover:underline"
        >
          <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
          Unduh template CSV
        </button>

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
              Modul Tujuan
            </label>
            <FilterDropdown<string>
              value={moduleId}
              options={moduleOptions}
              onChange={setModuleId}
              widthClassName="w-full"
              hideCheckIcon={true}
            />
          </div>

          <div
            onClick={() => inputRef.current?.click()}
            className="cursor-pointer rounded-[24px] border border-dashed border-white/60 bg-white/40 p-5 text-center shadow-sm backdrop-blur-md transition-all hover:border-primary/50 hover:bg-white/60"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            />
            <p className="font-secondary text-sm font-medium tracking-tight text-grey-700">
              {file ? file.name : "Klik untuk pilih file CSV"}
            </p>
          </div>

          {error && (
            <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
              {error}
            </div>
          )}

          {result && (
            <div className="space-y-2">
              <div className="rounded-2xl border border-success/15 bg-success/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-success backdrop-blur-md">
                {result.importedCount} soal berhasil diimpor.
              </div>
              {result.failedRows.length > 0 && (
                <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 backdrop-blur-md">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-warning-700"
                      strokeWidth={1.5}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-secondary text-sm font-medium tracking-tight text-warning-700">
                        {result.failedRows.length} baris gagal
                      </p>
                      <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto custom-scrollbar">
                        {result.failedRows.map((r) => (
                          <li
                            key={r.row}
                            className="font-secondary text-xs tracking-tight text-warning-700/90"
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
              className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
            >
              Tutup
            </Button>
          </DialogClose>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
          >
            {isPending ? "Mengimpor..." : "Impor Soal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
