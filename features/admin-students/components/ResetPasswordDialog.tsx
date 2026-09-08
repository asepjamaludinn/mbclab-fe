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
import { showToast } from "@/shared/lib/toast";

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

      showToast.success(
        "Password berhasil direset",
        `Password ${student.name} (${student.nim}) telah dikembalikan ke NIM.`,
      );

      onOpenChange(false);
    } catch (err: unknown) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message || "Gagal mereset password."
        : "Gagal mereset password.";

      setError(message);
      showToast.error("Gagal mereset password", message);
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-warning/90 text-white shadow-xl shadow-warning/20 backdrop-blur-md">
            <KeyRound className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Reset Password?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Password{" "}
            <strong className="font-medium text-grey-800">
              {student?.name}
            </strong>{" "}
            ({student?.nim}) akan dikembalikan ke NIM, dan praktikan wajib
            menggantinya saat login berikutnya.
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
            onClick={handleReset}
            disabled={isPending}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 bg-warning hover:bg-warning/90 hover:shadow-warning/20 text-white border-transparent"
          >
            {isPending ? "Memproses..." : "Ya, Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
