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
import { useBulkDeleteAdminAccounts } from "../hooks/use-admin-accounts";
import { AdminAccount } from "../types/admin-account.type";
import { toast } from "sonner";

type Props = {
  admins: AdminAccount[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function BulkDeleteAdminAccountsDialog({
  admins,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const { mutateAsync: bulkDelete, isPending } = useBulkDeleteAdminAccounts();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (admins.length === 0) return;
    setError("");
    try {
      await bulkDelete(admins.map((a) => a.id));
      toast.success(`${admins.length} akun asisten berhasil dihapus.`);
      onDeleted();
      onOpenChange(false);
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal menghapus akun."
        : "Gagal menghapus akun.";
      setError(errMsg);
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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/90 text-white shadow-xl shadow-error/20 backdrop-blur-md">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Hapus {admins.length} Akun Asisten?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Akun asisten yang dipilih akan dihapus permanen dari sistem. Aksi
            ini tidak dapat dibatalkan.
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
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg bg-error hover:bg-error/90 text-white border-transparent transition-all duration-300 hover:shadow-xl hover:shadow-error/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            {isPending ? "Menghapus..." : `Ya, Hapus ${admins.length} Akun`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
