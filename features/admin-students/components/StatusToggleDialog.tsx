"use client";

import { useState } from "react";
import { ShieldOff, ShieldCheck } from "lucide-react";
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
import {
  useDeactivateStudent,
  useReactivateStudent,
} from "../hooks/use-admin-students";
import { AdminStudent } from "../types/admin-student.type";

type StatusToggleDialogProps = {
  student: AdminStudent | null;
  onOpenChange: (open: boolean) => void;
};

export function StatusToggleDialog({
  student,
  onOpenChange,
}: StatusToggleDialogProps) {
  const { mutateAsync: deactivate, isPending: isDeactivating } =
    useDeactivateStudent();
  const { mutateAsync: reactivate, isPending: isReactivating } =
    useReactivateStudent();
  const [error, setError] = useState("");

  const isDeactivateAction = !student?.isDeleted;
  const isPending = isDeactivating || isReactivating;

  const handleConfirm = async () => {
    if (!student) return;
    setError("");
    try {
      if (isDeactivateAction) {
        await deactivate(student.id);
      } else {
        await reactivate(student.id);
      }
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal memperbarui status akun."
          : "Gagal memperbarui status akun.",
      );
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_12px_28px_-14px_rgba(0,0,0,0.3)] ${
              isDeactivateAction ? "bg-error" : "bg-success"
            }`}
          >
            {isDeactivateAction ? (
              <ShieldOff className="h-7 w-7" strokeWidth={1.8} />
            ) : (
              <ShieldCheck className="h-7 w-7" strokeWidth={1.8} />
            )}
          </div>
          <DialogTitle>
            {isDeactivateAction
              ? "Nonaktifkan Akun?"
              : "Aktifkan Kembali Akun?"}
          </DialogTitle>
          <DialogDescription>
            {isDeactivateAction ? (
              <>
                <strong>{student?.name}</strong> ({student?.nim}) tidak akan
                bisa login sampai akunnya diaktifkan kembali.
              </>
            ) : (
              <>
                <strong>{student?.name}</strong> ({student?.nim}) akan dapat
                login kembali seperti biasa.
              </>
            )}
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
            variant={isDeactivateAction ? "danger" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending
              ? "Memproses..."
              : isDeactivateAction
                ? "Ya, Nonaktifkan"
                : "Ya, Aktifkan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
