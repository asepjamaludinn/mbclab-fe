"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
  const { mutateAsync: bulkDeleteGroups, isPending } = useBulkDeleteGroups();
  const [error, setError] = useState("");
  const [failedGroups, setFailedGroups] = useState<
    | {
        id: string;
        name: string;
        reason: string;
      }[]
    | null
  >(null);

  const previewNames = groups.slice(0, PREVIEW_LIMIT).map((g) => g.name);
  const remainingCount = groups.length - previewNames.length;

  const handleDelete = async () => {
    if (groups.length === 0) return;
    setError("");
    setFailedGroups(null);

    try {
      const result = await bulkDeleteGroups({
        groupIds: groups.map((g) => g.id),
      });

      onDeleted();

      if (result.failedCount > 0) {
        setFailedGroups(result.failedGroups);
        return;
      }

      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message ||
              "Gagal menghapus kelompok yang dipilih."
          : "Gagal menghapus kelompok yang dipilih.",
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        onOpenChange(o);
        if (!o) {
          setError("");
          setFailedGroups(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/90 text-white shadow-xl shadow-error/20 backdrop-blur-md">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Hapus {groups.length} Kelompok?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Anggota di setiap kelompok tidak akan terhapus, hanya keluar dari
            kelompoknya masing-masing.
          </DialogDescription>
        </DialogHeader>

        {previewNames.length > 0 && !failedGroups && (
          <ul className="mt-4 max-h-40 space-y-1.5 overflow-y-auto rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md p-3 shadow-sm custom-scrollbar">
            {previewNames.map((name, idx) => (
              <li
                key={idx}
                className="truncate font-secondary text-xs font-medium tracking-tight text-grey-700"
              >
                {name}
              </li>
            ))}
            {remainingCount > 0 && (
              <li className="font-secondary text-xs font-medium tracking-tight text-grey-400">
                +{remainingCount} kelompok lainnya
              </li>
            )}
          </ul>
        )}

        {failedGroups && failedGroups.length > 0 && (
          <div className="mt-4 rounded-2xl border border-warning/20 bg-warning/5 p-4 backdrop-blur-md">
            <div className="flex items-start gap-2.5">
              <AlertTriangle
                className="mt-0.5 h-4 w-4 shrink-0 text-warning-700"
                strokeWidth={1.5}
              />
              <div className="min-w-0 flex-1">
                <p className="font-secondary text-sm font-medium tracking-tight text-warning-700">
                  {failedGroups.length} kelompok gagal dihapus
                </p>
                <ul className="mt-3 space-y-1.5 custom-scrollbar">
                  {failedGroups.map((g) => (
                    <li
                      key={g.id}
                      className="rounded-xl border border-white/40 bg-white/50 backdrop-blur-md px-3 py-2 font-secondary text-xs"
                    >
                      <span className="font-medium tracking-tight text-grey-900">
                        {g.name}
                      </span>
                      <p className="mt-0.5 text-warning-700/90">{g.reason}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
            {error}
          </div>
        )}

        <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
            >
              {failedGroups ? "Tutup" : "Batal"}
            </Button>
          </DialogClose>
          {!failedGroups && (
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={isPending || groups.length === 0}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
            >
              {isPending
                ? "Menghapus..."
                : `Ya, Hapus ${groups.length} Kelompok`}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
