"use client";

import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import axios from "axios";
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
import { useDeleteSubmission } from "../hooks/use-student-submissions";
import { showToast } from "@/shared/lib/toast";

type DeleteSubmissionDialogProps = {
  moduleId: string | null;
  fileName: string;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function DeleteSubmissionDialog({
  moduleId,
  fileName,
  onOpenChange,
  onDeleted,
}: DeleteSubmissionDialogProps) {
  const { mutateAsync: deleteSubmission, isPending } = useDeleteSubmission();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!moduleId) return;
    setError("");
    try {
      await deleteSubmission(moduleId);
      showToast.success(
        "File berhasil dihapus",
        "Silakan unggah file Tugas Pendahuluan yang baru.",
      );
      onDeleted();
      onOpenChange(false);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal menghapus file."
        : "Gagal menghapus file.";
      setError(message);
      showToast.error("Gagal menghapus", message);
    }
  };

  return (
    <Dialog open={!!moduleId} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <Trash2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle className="text-xl font-extrabold text-grey-900">
            Hapus File TP?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed text-grey-500">
            File <span className="font-semibold text-grey-700">{fileName}</span>{" "}
            akan dihapus secara permanen dari sistem. Anda dapat mengunggah file
            baru setelahnya.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-warning/20 bg-warning/5 p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-700" />
          <p className="font-secondary text-xs leading-relaxed text-warning-700">
            Jika batas waktu (termasuk masa tenggang) sudah berakhir, Anda tidak
            akan bisa mengunggah file pengganti.
          </p>
        </div>

        {error && (
          <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium text-error">
            {error}
          </div>
        )}

        <DialogFooter className="mt-6 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus File"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
