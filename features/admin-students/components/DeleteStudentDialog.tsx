"use client";

import { useState, useEffect } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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
import { useDeleteStudent } from "../hooks/use-admin-students";
import { AdminStudent } from "../types/admin-student.type";

type DeleteStudentDialogProps = {
  student: AdminStudent | null;
  onOpenChange: (open: boolean) => void;
};

export function DeleteStudentDialog({
  student,
  onOpenChange,
}: DeleteStudentDialogProps) {
  const { mutateAsync: deleteStudent, isPending } = useDeleteStudent();
  const [error, setError] = useState("");

  useEffect(() => {
    if (student) setError("");
  }, [student]);

  const hasHistoryData =
    (student?._count?.examAttempts ?? 0) > 0 ||
    (student?._count?.submissions ?? 0) > 0 ||
    (student?._count?.grades ?? 0) > 0;

  const handleDelete = async () => {
    if (!student || hasHistoryData) return;
    setError("");
    try {
      await deleteStudent(student.id);
      onOpenChange(false);
    } catch (err: unknown) {
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Gagal menghapus praktikan."
          : "Gagal menghapus praktikan.",
      );
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error/90 text-white shadow-xl shadow-error/20 backdrop-blur-md">
            <Trash2 className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
            Hapus Praktikan?
          </DialogTitle>
          <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
            Akun praktikan{" "}
            <strong className="font-medium text-grey-800">
              {student?.name}
            </strong>{" "}
            ({student?.nim}) akan dihapus dari sistem.
          </DialogDescription>
        </DialogHeader>

        {hasHistoryData ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 font-secondary text-xs text-warning-700 backdrop-blur-md">
            <AlertTriangle
              className="mt-0.5 h-5 w-5 shrink-0 text-warning-700"
              strokeWidth={1.5}
            />
            <div className="space-y-1">
              <p className="font-medium tracking-tight">
                Penghapusan Permanen Dikunci
              </p>
              <p className="leading-relaxed opacity-90">
                Praktikan ini sudah memiliki riwayat ujian, pengumpulan TP, atau
                nilai di dalam basis data lab. Sistem mengunci fitur hapus demi
                menjaga integritas data nilai akademik.
              </p>
              <p className="font-medium mt-2 text-grey-700">
                💡 Solusi: Tutup dialog ini dan gunakan tombol{" "}
                <span className="font-bold text-grey-900">
                  Nonaktifkan Akun
                </span>{" "}
                pada baris tabel praktikan.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 font-secondary text-xs leading-relaxed tracking-tight text-grey-500">
            Tindakan ini bersifat permanen. Anda hanya dapat menghapus praktikan
            yang belum memiliki aktivitas praktikum sama sekali.
          </p>
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
              {hasHistoryData ? "Kembali" : "Batal"}
            </Button>
          </DialogClose>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isPending || hasHistoryData}
            className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 bg-error hover:bg-error/90 hover:shadow-error/20 text-white disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Permanen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
