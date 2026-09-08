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
import { useDeleteGroup } from "../hooks/use-admin-groups";
import { AdminGroup } from "../types/admin-group.type";

type DeleteGroupDialogProps = {
  group: AdminGroup | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteGroupDialog({
  group,
  onOpenChange,
}: DeleteGroupDialogProps) {
  const { mutateAsync: deleteGroup, isPending } = useDeleteGroup();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!group) return;
    setError("");
    try {
      await deleteGroup(group.id);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal menghapus kelompok."
          : "Gagal menghapus kelompok.",
      );
    }
  };

  return (
    <Dialog open={!!group} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/90 text-white shadow-xl shadow-error/20 backdrop-blur-md">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Hapus Kelompok?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Kelompok{" "}
            <span className="font-medium text-grey-700">{group?.name}</span>{" "}
            akan dihapus. Anggota kelompok tidak akan terhapus, hanya keluar
            dari kelompok ini.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
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
              Batal
            </Button>
          </DialogClose>
          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isPending}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
