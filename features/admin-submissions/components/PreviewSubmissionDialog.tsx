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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
            <FileText className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            {submission?.module.title} — {submission?.student.name}
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm tracking-tight text-grey-500">
            {submission?.student.nim} •{" "}
            {submission?.student.group?.name ?? "Belum ada kelompok"}
            {submission?.isLate && (
              <span className="ml-2 inline-flex items-center rounded-full bg-error/10 px-2 py-0.5 font-secondary text-[10px] font-medium text-error border border-error/10">
                Terlambat
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex flex-col items-center justify-center rounded-[24px] border border-white/50 bg-white/40 p-6 text-center backdrop-blur-md shadow-sm">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-[20px] bg-info/10 text-info border border-info/10 backdrop-blur-md">
            <FileCheck className="h-8 w-8" strokeWidth={1.5} />
          </div>

          <div className="w-full px-2">
            <p
              className="truncate font-secondary text-sm font-medium tracking-tight text-grey-900"
              title={fileName}
            >
              {fileName}
            </p>
            <p className="mt-1 font-secondary text-xs tracking-tight text-grey-500">
              Dokumen siap ditinjau.
            </p>
          </div>

          <div className="mt-5 inline-flex items-center rounded-full border border-white/50 bg-white/60 px-3.5 py-1.5 font-secondary text-[11px] font-medium tracking-tight text-grey-500 shadow-sm backdrop-blur-md">
            Dikumpulkan:{" "}
            <span className="ml-1 font-medium text-grey-700">
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
              className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
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
                  className="w-full font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
                  disabled={isDownloading}
                >
                  <ExternalLink className="mr-2 h-4 w-4" strokeWidth={1.5} />
                  Buka Dokumen
                </Button>
              </a>

              <Button
                type="button"
                className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
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
                    <Download className="mr-2 h-4 w-4" strokeWidth={1.5} />
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
