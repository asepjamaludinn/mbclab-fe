"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { useBulkDeleteGroups } from "../hooks/use-admin-groups";
import { AdminGroup } from "../types/admin-group.type";

type BulkDeleteGroupsDialogProps = {
  groups: AdminGroup[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

const PREVIEW_LIMIT = 5;

export function BulkDeleteGroupsDialog({
  groups,
  open,
  onOpenChange,
  onDeleted,
}: BulkDeleteGroupsDialogProps) {
  const { mutateAsync: bulkDeleteGroups } = useBulkDeleteGroups();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const previewNames = groups.slice(0, PREVIEW_LIMIT).map((g) => g.name);
  const remainingCount = groups.length - previewNames.length;

  const handleDelete = async () => {
    if (groups.length === 0) return;
    setIsDeleting(true);
    setError("");

    try {
      const groupIds = groups.map((g) => g.id);

      const response = await bulkDeleteGroups({ groupIds });

      if (response && response.failedCount > 0) {
        setError(
          response.failedCount === groups.length
            ? "Semua kelompok yang dipilih gagal dihapus (mungkin ada ujian aktif)."
            : `${response.failedCount} dari ${groups.length} kelompok gagal dihapus, sisanya berhasil.`,
        );

        onDeleted();
        setIsDeleting(false);
        return;
      }

      onDeleted();
      onOpenChange(false);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Terjadi kesalahan saat menghapus kelompok.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) setError("");
      }}
    >
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus {groups.length} Kelompok?</DialogTitle>
          <DialogDescription>
            Anggota di setiap kelompok tidak akan terhapus, hanya keluar dari
            kelompoknya masing-masing.
          </DialogDescription>
        </DialogHeader>

        {previewNames.length > 0 && (
          <ul className="mt-4 max-h-40 space-y-1.5 overflow-y-auto rounded-2xl border border-grey-100 bg-grey-50/60 p-3">
            {previewNames.map((name, idx) => (
              <li
                key={idx}
                className="truncate font-secondary text-xs font-semibold text-grey-700"
              >
                {name}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="font-secondary text-xs font-semibold text-grey-400">
                +{remainingCount} kelompok lainnya
              </li>
            )}
          </ul>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
            {error}
          </div>
        )}

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
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
            disabled={isDeleting || groups.length === 0}
            className="w-full sm:w-auto"
          >
            {isDeleting
              ? "Menghapus..."
              : `Ya, Hapus ${groups.length} Kelompok`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
