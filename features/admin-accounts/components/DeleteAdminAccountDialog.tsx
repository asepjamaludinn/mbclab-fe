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
import { useDeleteAdminAccount } from "../hooks/use-admin-accounts";
import { AdminAccount } from "../types/admin-account.type";
import { toast } from "sonner";

type DeleteAdminAccountDialogProps = {
  admin: AdminAccount | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteAdminAccountDialog({
  admin,
  onOpenChange,
}: DeleteAdminAccountDialogProps) {
  const { mutateAsync: deleteAdmin, isPending } = useDeleteAdminAccount();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!admin) return;
    setError("");
    try {
      await deleteAdmin(admin.id);
      toast.success("Akun asisten berhasil dihapus.");
      onOpenChange(false);
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal menghapus akun asisten."
        : "Gagal menghapus akun asisten.";
      setError(errMsg);
      toast.error("Gagal menghapus akun asisten.");
    }
  };

  return (
    <Dialog open={!!admin} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus Akun Asisten?</DialogTitle>
          <DialogDescription>
            Akun asisten <strong>{admin?.name}</strong> ({admin?.nim}) akan
            dihapus permanen dari sistem. Aksi ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mt-2 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
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
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Permanen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
