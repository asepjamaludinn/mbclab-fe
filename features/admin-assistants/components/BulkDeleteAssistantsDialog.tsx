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
import { useBulkDeleteAssistants } from "../hooks/use-admin-assistants";
import { AdminAssistantProfile } from "../types/admin-assistant.type";
import { toast } from "sonner";

type Props = {
  assistants: AdminAssistantProfile[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted: () => void;
};

export function BulkDeleteAssistantsDialog({
  assistants,
  open,
  onOpenChange,
  onDeleted,
}: Props) {
  const { mutateAsync: bulkDelete, isPending } = useBulkDeleteAssistants();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (assistants.length === 0) return;
    setError("");
    try {
      await bulkDelete(assistants.map((a) => a.id));
      toast.success(`${assistants.length} profil asisten berhasil dihapus.`);
      onDeleted();
      onOpenChange(false);
    } catch (err: unknown) {
      const errMsg = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal menghapus profil."
        : "Gagal menghapus profil.";
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
            Hapus {assistants.length} Profil Asisten?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Profil yang dipilih akan dihapus permanen dan langsung hilang dari
            halaman publik.
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
            {isPending
              ? "Menghapus..."
              : `Ya, Hapus ${assistants.length} Profil`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
