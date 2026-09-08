"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/shared/components/ui/switch";
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
    control,
    setError,
    formState: { errors },
  } = useForm<CreateStudentFormData>({
    resolver: zodResolver(createStudentSchema),
    defaultValues: { isInternational: false },
  });

  useEffect(() => {
    if (open) reset({ nim: "", name: "", isInternational: false });
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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <UserPlus className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              Tambah Praktikan
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              Password awal akun akan sama dengan NIM. Praktikan wajib mengganti
              password saat login pertama.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                NIM
              </label>
              <Input
                {...register("nim")}
                placeholder="cth. 1101210001"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.nim && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.nim.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Nama Lengkap
              </label>
              <Input
                {...register("name")}
                placeholder="cth. Budi Santoso"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-4 py-3 backdrop-blur-md shadow-sm">
              <div>
                <p className="text-sm font-medium tracking-tight text-grey-900">
                  Kelas Internasional
                </p>
                <p className="mt-0.5 font-secondary text-[11px] leading-relaxed tracking-tight text-grey-500">
                  Praktikan akan menerima soal ujian (TA/TP) dalam bahasa
                  Inggris.
                </p>
              </div>
              <Controller
                control={control}
                name="isInternational"
                render={({ field }) => (
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
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
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
            >
              {isPending ? "Menyimpan..." : "Tambah Praktikan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
