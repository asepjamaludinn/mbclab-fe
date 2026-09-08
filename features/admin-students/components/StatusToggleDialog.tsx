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
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div
            className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full text-white shadow-xl backdrop-blur-md ${
              isDeactivateAction
                ? "bg-error/90 shadow-error/20"
                : "bg-success/90 shadow-success/20"
            }`}
          >
            {isDeactivateAction ? (
              <ShieldOff className="h-7 w-7" strokeWidth={1.5} />
            ) : (
              <ShieldCheck className="h-7 w-7" strokeWidth={1.5} />
            )}
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            {isDeactivateAction
              ? "Nonaktifkan Akun?"
              : "Aktifkan Kembali Akun?"}
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            {isDeactivateAction ? (
              <>
                <strong className="font-medium text-grey-800">
                  {student?.name}
                </strong>{" "}
                ({student?.nim}) tidak akan bisa login sampai akunnya diaktifkan
                kembali.
              </>
            ) : (
              <>
                <strong className="font-medium text-grey-800">
                  {student?.name}
                </strong>{" "}
                ({student?.nim}) akan dapat login kembali seperti biasa.
              </>
            )}
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
            variant={isDeactivateAction ? "danger" : "default"}
            onClick={handleConfirm}
            disabled={isPending}
            className={`w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 ${
              isDeactivateAction
                ? "bg-error hover:bg-error/90 text-white shadow-error/20"
                : ""
            }`}
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
