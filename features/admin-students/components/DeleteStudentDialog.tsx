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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error text-white shadow-[0_12px_28px_-14px_rgba(220,38,38,0.65)]">
            <Trash2 className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Hapus Praktikan?</DialogTitle>
          <DialogDescription>
            Akun praktikan <strong>{student?.name}</strong> ({student?.nim})
            akan dihapus dari sistem.
          </DialogDescription>
        </DialogHeader>

        {/* Jika terdeteksi punya data, kunci tombol dan tampilkan UI Notice khusus */}
        {hasHistoryData ? (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/10 p-4 font-secondary text-xs text-warning-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-700" />
            <div className="space-y-1">
              <p className="font-bold">Penghapusan Permanen Dikunci</p>
              <p className="leading-relaxed">
                Praktikan ini sudah memiliki riwayat ujian, pengumpulan TP, atau
                nilai di dalam basis data lab. Sistem mengunci fitur hapus demi
                menjaga integritas data nilai akademik.
              </p>
              <p className="font-medium mt-1 text-slate-700">
                💡 **Solusi:** Tutup dialog ini dan gunakan tombol **Nonaktifkan
                Akun** (ikon perisai) pada baris tabel praktikan.
              </p>
            </div>
          </div>
        ) : (
          <p className="mt-2 font-secondary text-xs leading-relaxed text-grey-500">
            Tindakan ini bersifat permanen. Anda hanya dapat menghapus praktikan
            yang belum memiliki aktivitas praktikum sama sekali.
          </p>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
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
              {hasHistoryData ? "Kembali" : "Batal"}
            </Button>
          </DialogClose>

          <Button
            variant="danger"
            onClick={handleDelete}
            disabled={isPending || hasHistoryData}
            className="w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? "Menghapus..." : "Ya, Hapus Permanen"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
