"use client";

import { FileText, Download, ExternalLink } from "lucide-react";
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
  const fileUrl = submission ? resolveAssetUrl(submission.fileUrl) : "";

  return (
    <Dialog open={!!submission} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
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

        <div className="mt-4 overflow-hidden rounded-2xl border border-grey-200 bg-grey-50">
          {fileUrl ? (
            <iframe
              src={fileUrl}
              title="Preview TP"
              className="h-[65vh] w-full"
            />
          ) : (
            <div className="flex h-64 items-center justify-center text-sm text-grey-500">
              File tidak tersedia.
            </div>
          )}
        </div>

        <p className="mt-2 font-secondary text-xs text-grey-500">
          Dikumpulkan pada{" "}
          {submission
            ? new Date(submission.createdAt).toLocaleString("id-ID", {
                dateStyle: "medium",
                timeStyle: "short",
              })
            : "-"}
        </p>

        <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Tutup
            </Button>
          </DialogClose>

          {fileUrl && (
            <>
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button type="button" variant="outline" className="w-full">
                  <ExternalLink className="mr-2 h-4 w-4" strokeWidth={2} />
                  Buka di Tab Baru
                </Button>
              </a>
              <a href={fileUrl} download className="w-full sm:w-auto">
                <Button type="button" className="w-full">
                  <Download className="mr-2 h-4 w-4" strokeWidth={2} />
                  Unduh PDF
                </Button>
              </a>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
