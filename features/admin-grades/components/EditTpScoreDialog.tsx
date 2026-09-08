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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <GraduationCap className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              Ubah Nilai TP
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              <strong className="font-medium text-grey-800">
                {grade?.student.name}
              </strong>{" "}
              ({grade?.student.nim}) — {grade?.module.title}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Nilai Tugas Pendahuluan (TP)
              </label>
              <Input
                type="number"
                min={0}
                max={100}
                step="0.1"
                {...register("tpScore", { valueAsNumber: true })}
                placeholder="0 - 100"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.tpScore && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.tpScore.message}
                </p>
              )}
            </div>

            {/* Nilai TA hanya diisi otomatis dari hasil ujian, jadi tidak
                disediakan input edit di sini — cukup ditampilkan sebagai
                info agar admin tetap punya konteks lengkap. */}
            <div className="rounded-2xl border border-white/50 bg-white/30 px-4 py-3 backdrop-blur-md shadow-sm">
              <p className="font-secondary text-xs font-medium tracking-tight text-grey-500">
                Nilai Tes Awal (TA)
              </p>
              <p className="mt-1 text-sm font-medium tracking-tighter text-grey-900">
                {grade?.taScore ?? "Belum ada nilai"}
              </p>
              <p className="mt-1 font-secondary text-[11px] tracking-tight text-grey-500">
                Nilai TA terisi otomatis dari hasil ujian dan tidak dapat diubah
                manual.
              </p>
            </div>

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

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
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
            >
              {isPending ? "Menyimpan..." : "Simpan Nilai"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
