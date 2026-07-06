"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserPlus } from "lucide-react";
import axios from "axios";
import {
  createStudentSchema,
  CreateStudentFormData,
} from "../schemas/admin-student.schema";
import { useCreateStudent } from "../hooks/use-admin-students";
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

type StudentFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function StudentFormDialog({
  open,
  onOpenChange,
}: StudentFormDialogProps) {
  const { mutateAsync: createStudent, isPending } = useCreateStudent();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
  });

  useEffect(() => {
    if (open) reset({ nim: "", name: "" });
  }, [open, reset]);

  const onSubmit = async (data: CreateStudentFormData) => {
    try {
      await createStudent(data);
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menambahkan praktikan."
        : "Gagal menambahkan praktikan.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <UserPlus className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Tambah Praktikan</DialogTitle>
            <DialogDescription>
              Password awal akun akan sama dengan NIM, dan praktikan akan
              diminta mengganti password saat login pertama.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                NIM
              </label>
              <Input {...register("nim")} placeholder="cth. 1101210001" />
              {errors.nim && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.nim.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nama Lengkap
              </label>
              <Input {...register("name")} placeholder="cth. Budi Santoso" />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.name.message}
                </p>
              )}
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
              {isPending ? "Menyimpan..." : "Tambah Praktikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
