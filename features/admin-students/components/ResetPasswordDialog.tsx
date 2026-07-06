"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
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
import { useResetStudentPassword } from "../hooks/use-admin-students";
import { AdminStudent } from "../types/admin-student.type";

type ResetPasswordDialogProps = {
  student: AdminStudent | null;
  onOpenChange: (open: boolean) => void;
};

export function ResetPasswordDialog({
  student,
  onOpenChange,
}: ResetPasswordDialogProps) {
  const { mutateAsync: resetPassword, isPending } = useResetStudentPassword();
  const [error, setError] = useState("");

  const handleReset = async () => {
    if (!student) return;
    setError("");
    try {
      await resetPassword(student.nim);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal mereset password."
          : "Gagal mereset password.",
      );
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning text-white shadow-[0_12px_28px_-14px_rgba(217,119,6,0.5)]">
            <KeyRound className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Reset Password?</DialogTitle>
          <DialogDescription>
            Password <strong>{student?.name}</strong> ({student?.nim}) akan
            dikembalikan ke NIM, dan praktikan wajib menggantinya saat login
            berikutnya.
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
            onClick={handleReset}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? "Memproses..." : "Ya, Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
