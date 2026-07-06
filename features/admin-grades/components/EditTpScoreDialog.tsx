"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { GraduationCap } from "lucide-react";
import axios from "axios";
import {
  updateTpScoreSchema,
  UpdateTpScoreFormData,
} from "../schemas/admin-grade.schema";
import { useUpdateTpScore } from "../hooks/use-admin-grades";
import { AdminGrade } from "../types/admin-grade.type";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";

type EditTpScoreDialogProps = {
  grade: AdminGrade | null;
  onOpenChange: (open: boolean) => void;
};

export function EditTpScoreDialog({
  grade,
  onOpenChange,
}: EditTpScoreDialogProps) {
  const { mutateAsync: updateTpScore, isPending } = useUpdateTpScore();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<UpdateTpScoreFormData>({
    resolver: zodResolver(updateTpScoreSchema),
  });

  useEffect(() => {
    if (grade) {
      reset({ tpScore: grade.tpScore ?? 0 });
    }
  }, [grade, reset]);

  const onSubmit = async (data: UpdateTpScoreFormData) => {
    if (!grade) return;
    try {
      await updateTpScore({
        moduleId: grade.moduleId,
        studentId: grade.studentId,
        payload: { tpScore: data.tpScore },
      });
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menyimpan nilai TP."
        : "Gagal menyimpan nilai TP.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={!!grade} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <GraduationCap className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Ubah Nilai TP</DialogTitle>
            <DialogDescription>
              <strong>{grade?.student.name}</strong> ({grade?.student.nim}) —{" "}
              {grade?.module.title}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nilai Tugas Pendahuluan (TP)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.1"
                {...register("tpScore", { valueAsNumber: true })}
                placeholder="0 - 100"
              />
              {errors.tpScore && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.tpScore.message}
                </p>
              )}
            </div>

            {/* Nilai TA hanya diisi otomatis dari hasil ujian, jadi tidak
                disediakan input edit di sini — cukup ditampilkan sebagai
                info agar admin tetap punya konteks lengkap. */}
            <div className="rounded-2xl border border-grey-100 bg-grey-50/60 px-4 py-3">
              <p className="font-secondary text-xs font-bold text-grey-500">
                Nilai Tes Awal (TA)
              </p>
              <p className="mt-1 text-sm font-semibold text-grey-900">
                {grade?.taScore ?? "Belum ada nilai"}
              </p>
              <p className="mt-1 font-secondary text-[11px] text-grey-500">
                Nilai TA terisi otomatis dari hasil ujian dan tidak dapat diubah
                manual.
              </p>
            </div>

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

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
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Menyimpan..." : "Simpan Nilai"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
