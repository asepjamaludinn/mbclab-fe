"use client";

import { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  FileCheck,
  Loader2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { AdminSubmission } from "../types/admin-submission.type";
import { resolveAssetUrl } from "@/shared/utils/asset-url";

type PreviewSubmissionDialogProps = {
  submission: AdminSubmission | null;
  onOpenChange: (open: boolean) => void;
};

export function PreviewSubmissionDialog({
  submission,
  onOpenChange,
}: PreviewSubmissionDialogProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const fileUrl = submission ? resolveAssetUrl(submission.fileUrl) : "";
  const fileName = submission
    ? `${submission.student.nim}_${submission.student.name.replace(/\s+/g, "_")}.pdf`
    : "Tugas_Pendahuluan.pdf";

  const handleDownloadPdf = async () => {
    if (!fileUrl) return;
    setIsDownloading(true);

    try {
      const response = await fetch(fileUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = fileName;

      document.body.appendChild(anchor);
      anchor.click();

      document.body.removeChild(anchor);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Gagal mengunduh berkas PDF:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Dialog open={!!submission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
            <FileText className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>
            {submission?.module.title} — {submission?.student.name}
          </DialogTitle>
          <DialogDescription>
            {submission?.student.nim} •{" "}
            {submission?.student.group?.name ?? "Belum ada kelompok"}
            {submission?.isLate && (
              <span className="ml-2 inline-flex items-center rounded-full bg-error/10 px-2 py-0.5 font-secondary text-[10px] font-bold text-error">
                Terlambat
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col items-center justify-center rounded-[24px] border border-grey-200 bg-grey-50/50 p-6 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-info/10 text-info">
            <FileCheck className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <div className="w-full px-2">
            <p
              className="truncate font-secondary text-sm font-bold text-grey-900"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="mt-1 font-secondary text-xs text-grey-500">
              Dokumen siap ditinjau.
            </p>
          </div>

          <div className="mt-5 inline-flex items-center rounded-full border border-grey-200 bg-white px-3.5 py-1.5 font-secondary text-[11px] font-medium text-grey-500 shadow-sm">
            Dikumpulkan:{" "}
            <span className="ml-1 font-bold text-grey-700">
              {submission
                ? new Date(submission.createdAt).toLocaleString("id-ID", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })
                : "-"}
            </span>
          </div>
        </div>

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
              disabled={isDownloading}
            >
              Tutup
            </Button>
          </DialogClose>

          {fileUrl && (
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isDownloading}
                >
                  <ExternalLink className="mr-2 h-4 w-4" strokeWidth={2} />
                  Buka Dokumen
                </Button>
              </a>

              <Button
                type="button"
                className="w-full sm:w-auto"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Mengunduh...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" strokeWidth={2} />
                    Unduh PDF
                  </>
                )}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
