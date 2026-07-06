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
import { useDeleteExamSession } from "../hooks/use-admin-exam-sessions";
import { AdminExamSession } from "../types/admin-exam-session.type";

type DeleteExamSessionDialogProps = {
  session: AdminExamSession | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteExamSessionDialog({
  session,
  onOpenChange,
}: DeleteExamSessionDialogProps) {
  const { mutateAsync: deleteSession, isPending } = useDeleteExamSession();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (!session) return;
    setError("");
    try {
      await deleteSession(session.id);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal menghapus sesi ujian."
          : "Gagal menghapus sesi ujian.",
      );
    }
  };

  return (
    <Dialog open={!!session} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <AlertTriangle className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus Sesi Ujian?</DialogTitle>
          <DialogDescription>
            Sesi <strong>{session?.module?.title}</strong> untuk kelompok{" "}
            <strong>{session?.group?.name}</strong> akan dihapus. Sesi yang
            sudah memiliki peserta ujian tidak dapat dihapus.
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
            {isPending ? "Menghapus..." : "Ya, Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
    