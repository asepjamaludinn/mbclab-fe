"use client";

import { ChangeEvent, DragEvent, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  UploadCloud,
  Trash2,
  XCircle,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { usePublicModules } from "@/features/public-home";
import { useUploadFile, useSubmitTp } from "../hooks/use-student-submissions";
import axios from "axios";

// 1. Import Schema dan Konstanta dari file yang sudah kita pisah
import {
  tpSubmissionSchema,
  MAX_FILE_SIZE_MB,
} from "../schemas/student-submission.schema";

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

  const { data: modules = [] } = usePublicModules();
  const moduleInfo = modules.find((m) => m.id === moduleId);
  const moduleTitle = moduleInfo ? moduleInfo.title : `TP Modul ${moduleId}`;

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
      // 2. Perbaikan cara akses error Zod dengan properti .issues yang valid
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
    setSuccessMessage("");
    setApiError("");
    setValidationError("");

    // Validasi Zod saat tombol kumpul ditekan
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

      setSuccessMessage(`${moduleTitle} berhasil dikumpulkan.`);
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
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <section className="px-5 pt-6">
        <Link
          href="/student/submissions"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Tugas Pendahuluan
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          {moduleTitle}
        </h1>

        <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-grey-500">
          Upload file TP dalam format PDF sebelum deadline yang ditentukan.
        </p>
      </section>

      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 px-5 pb-5 pt-5 text-grey-900 shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/15 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[60px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-primary/10" />

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
              className={`relative rounded-[30px] border-2 p-6 transition backdrop-blur-xl ${
                selectedFile
                  ? "border-white/80 bg-white/60 shadow-sm"
                  : isDragging
                    ? "border-dashed border-primary bg-primary/10 cursor-pointer"
                    : "border-dashed border-white/80 bg-white/45 hover:border-primary/40 hover:bg-white/70 cursor-pointer text-center"
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
                      <FileText className="h-6 w-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-extrabold text-grey-900">
                        {selectedFile.name}
                      </p>
                      <p className="font-secondary text-xs text-grey-500">
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
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-primary shadow-sm backdrop-blur-xl">
                    <UploadCloud className="h-8 w-8" />
                  </div>

                  <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
                    Upload Area
                  </p>

                  <h2 className="mt-2 text-lg font-extrabold tracking-tight text-grey-900">
                    Upload file PDF
                  </h2>

                  <p className="mx-auto mt-2 max-w-[260px] font-secondary text-xs leading-relaxed text-grey-500">
                    Drag and drop file ke sini atau klik untuk memilih file dari
                    perangkat Anda.
                  </p>

                  <p className="mt-4 inline-flex rounded-full bg-primary/10 px-3 py-1 font-secondary text-[11px] font-bold text-primary">
                    PDF • Maksimal {MAX_FILE_SIZE_MB} MB
                  </p>
                </div>
              )}
            </div>

            {/* Error Validasi Zod */}
            {validationError && (
              <span className="mt-2 block font-secondary text-sm font-semibold text-error">
                {validationError}
              </span>
            )}

            {/* Global API Error */}
            {apiError && (
              <div className="mt-4 flex items-start gap-3 rounded-[24px] border border-error/10 bg-error/10 p-4 font-secondary text-sm font-semibold text-error">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mt-4 flex items-start gap-3 rounded-[24px] border border-success/10 bg-success/10 p-4 font-secondary text-sm font-semibold text-success">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isProcessing}
              className="mt-6 w-full"
            >
              {isProcessing ? "Mengunggah..." : "Kumpulkan TP"}
            </Button>
          </div>
        </div>
      </section>

      <StudentBottomNavigation />
    </main>
  );
}
