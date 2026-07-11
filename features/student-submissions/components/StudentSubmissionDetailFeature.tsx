"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  LockKeyhole,
  UploadCloud,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { usePublicModules } from "@/features/public-home";
import { useUploadFile, useSubmitTp } from "../hooks/use-student-submissions";
import axios from "axios";
import {
  tpSubmissionSchema,
  MAX_FILE_SIZE_MB,
} from "../schemas/student-submission.schema";
import { isDeadlinePassed, formatDeadline } from "@/shared/utils/deadline";

type StudentSubmissionDetailFeatureProps = {
  moduleId: string;
};

export function StudentSubmissionDetailFeature({
  moduleId,
}: StudentSubmissionDetailFeatureProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [validationError, setValidationError] = useState("");
  const [apiError, setApiError] = useState("");

  const { data: modules = [], isLoading: isLoadingModules } =
    usePublicModules();
  const moduleInfo = modules.find((m) => m.id === moduleId);
  const moduleTitle = moduleInfo ? moduleInfo.title : `Modul ${moduleId}`;

  const tpDeadline = (moduleInfo as { tpDeadline?: string | null })?.tpDeadline;
  const deadlineClosed = isDeadlinePassed(tpDeadline ?? null);

  const { mutateAsync: uploadFile, isPending: isUploadingFile } =
    useUploadFile();
  const { mutateAsync: submitTp, isPending: isSubmitting } = useSubmitTp();

  const isProcessing = isUploadingFile || isSubmitting;

  const validateFile = (file: File | undefined | null) => {
    setSuccessMessage("");
    setApiError("");
    setValidationError("");

    const result = tpSubmissionSchema.safeParse(file);

    if (!result.success) {
      const errorMessage =
        result.error.issues[0]?.message || "Format file tidak valid.";
      setValidationError(errorMessage);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file as File);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    validateFile(file);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files?.[0];
    validateFile(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setValidationError("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (deadlineClosed) return;

    setSuccessMessage("");
    setApiError("");
    setValidationError("");

    const result = tpSubmissionSchema.safeParse(selectedFile);
    if (!result.success) {
      const errorMessage =
        result.error.issues[0]?.message || "Format file tidak valid.";
      setValidationError(errorMessage);
      return;
    }

    try {
      const fileUrl = await uploadFile(selectedFile as File);
      await submitTp({ moduleId, fileUrl });

      setSuccessMessage("Tugas Pendahuluan berhasil dikumpulkan.");
      setSelectedFile(null);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setApiError(
          error.response?.data?.message ||
            "Gagal mengunggah TP. Silakan coba lagi.",
        );
      } else {
        setApiError("Gagal mengunggah TP. Silakan coba lagi.");
      }
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-10 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <div className="relative z-10">
        <section className="px-5 pt-8 text-white">
          <Link
            href="/student/submissions"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20 active:scale-[0.96]"
          >
            <ArrowLeft className="h-4 w-4" />
            Batal
          </Link>

          <h1 className="mt-1 text-[32px] font-extrabold leading-tight tracking-tight drop-shadow-sm">
            {moduleTitle}
          </h1>

          {tpDeadline && (
            <p className="mt-2 font-secondary text-sm text-white/80">
              Batas pengumpulan: {formatDeadline(tpDeadline)} WIB
            </p>
          )}
        </section>

        <section className="mt-8 px-5">
          {isLoadingModules ? (
            <div className="h-64 w-full animate-pulse rounded-[32px] bg-white/40 backdrop-blur-xl" />
          ) : deadlineClosed ? (
            // --- Layar terkunci: deadline sudah lewat ---
            <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/80 px-6 py-10 text-center shadow-[0_24px_60px_-38px_rgba(0,101,176,0.3)] backdrop-blur-2xl">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-error/10 text-error">
                <LockKeyhole className="h-8 w-8" strokeWidth={1.8} />
              </div>

              <h2 className="text-xl font-extrabold text-slate-900">
                Pengumpulan TP Sudah Ditutup
              </h2>

              <p className="mx-auto mt-3 max-w-sm font-secondary text-sm leading-relaxed text-slate-600">
                Batas waktu pengumpulan Tugas Pendahuluan untuk modul ini telah
                berakhir pada{" "}
                <strong>
                  {tpDeadline ? formatDeadline(tpDeadline) : "-"} WIB
                </strong>
                . Anda tidak dapat mengunggah file lagi. Silakan hubungi asisten
                praktikum jika ada kendala.
              </p>

              <Link
                href="/student/submissions"
                className="mt-6 inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-6 font-secondary text-sm font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-secondary active:scale-[0.98]"
              >
                Kembali ke Daftar TP
              </Link>
            </div>
          ) : (
            // --- Form upload normal ---
            <div className="relative overflow-hidden rounded-[32px] border border-white/50 bg-white/40 px-5 pb-6 pt-5 text-slate-900 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.25)] backdrop-blur-2xl">
              <div className="relative z-10">
                <div
                  onClick={() => !selectedFile && inputRef.current?.click()}
                  onDragOver={(event) => {
                    event.preventDefault();
                    if (!selectedFile) setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(event) => {
                    if (!selectedFile) handleDrop(event);
                  }}
                  className={`relative rounded-[24px] border-2 p-6 transition-all duration-300 backdrop-blur-xl ${
                    selectedFile
                      ? "border-primary/20 bg-white/80 shadow-sm"
                      : isDragging
                        ? "cursor-pointer border-dashed border-primary bg-primary/10"
                        : "cursor-pointer border-dashed border-slate-300 bg-white/50 text-center hover:border-primary/40 hover:bg-white/80"
                  }`}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-info/10 text-info">
                          <FileText className="h-6 w-6" strokeWidth={1.8} />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-extrabold text-slate-900">
                            {selectedFile.name}
                          </p>
                          <p className="font-secondary text-xs font-medium text-slate-500">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-error/10 text-error transition hover:bg-error hover:text-white"
                        aria-label="Hapus file"
                      >
                        <Trash2 className="h-5 w-5" strokeWidth={1.8} />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-white text-primary shadow-sm backdrop-blur-xl transition-transform group-hover:-translate-y-1">
                        <UploadCloud className="h-8 w-8" strokeWidth={1.8} />
                      </div>

                      <p className="mx-auto max-w-[220px] font-secondary text-[13px] font-medium leading-relaxed text-slate-600">
                        <strong className="font-bold text-slate-900">
                          Klik untuk memilih
                        </strong>{" "}
                        atau drag & drop file PDF ke sini.
                      </p>

                      <p className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 font-secondary text-[11px] font-bold text-primary">
                        Maksimal {MAX_FILE_SIZE_MB} MB
                      </p>
                    </div>
                  )}
                </div>

                {validationError && (
                  <span className="mt-3 block font-secondary text-sm font-semibold text-error">
                    {validationError}
                  </span>
                )}

                {apiError && (
                  <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-error/10 bg-error/10 p-4 font-secondary text-sm font-semibold text-error-700">
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-error" />
                    <span>{apiError}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mt-4 flex items-start gap-3 rounded-[20px] border border-success/10 bg-success/10 p-4 font-secondary text-sm font-semibold text-success-700">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!selectedFile || isProcessing}
                  className="mt-6 h-[52px] w-full rounded-2xl text-[15px] shadow-primary/25 disabled:opacity-50 disabled:shadow-none"
                >
                  {isProcessing ? "Mengunggah..." : "Kumpulkan TP"}
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
