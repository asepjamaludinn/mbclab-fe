"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import axios from "axios";
import {
  editStudentSchema,
  EditStudentFormData,
} from "../schemas/admin-student.schema";
import { useUpdateStudent } from "../hooks/use-admin-students";
import { AdminStudent } from "../types/admin-student.type";
import { AdminGroup } from "@/features/admin-groups";
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

type EditStudentDialogProps = {
  student: AdminStudent | null;
  groups: AdminGroup[];
  onOpenChange: (open: boolean) => void;
};

export function EditStudentDialog({
  student,
  groups,
  onOpenChange,
}: EditStudentDialogProps) {
  const { mutateAsync: updateStudent, isPending } = useUpdateStudent();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
  });

  useEffect(() => {
    if (student) {
      reset({ name: student.name, groupId: student.group?.id ?? "" });
    }
  }, [student, reset]);

  const onSubmit = async (data: EditStudentFormData) => {
    if (!student) return;
    try {
      await updateStudent({
        id: student.id,
        payload: { name: data.name, groupId: data.groupId || null },
      });
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal memperbarui data praktikan."
        : "Gagal memperbarui data praktikan.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={!!student} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <Pencil className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Ubah Data Praktikan</DialogTitle>
            <DialogDescription>
              NIM <strong>{student?.nim}</strong> tidak dapat diubah dari sini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nama Lengkap
              </label>
              <Input {...register("name")} placeholder="Nama praktikan" />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Kelompok
              </label>
              <select
                {...register("groupId")}
                className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
              >
                <option value="">Tanpa Kelompok</option>
                {groups.map((group) => (
                  <option key={group.id} value={group.id}>
                    {group.name}
                  </option>
                ))}
              </select>
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
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );    
}
