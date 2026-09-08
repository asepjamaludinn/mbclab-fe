"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Switch } from "@/shared/components/ui/switch";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
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
    control,
    setError,
    formState: { errors },
  } = useForm<EditStudentFormData>({
    resolver: zodResolver(editStudentSchema),
  });

  const groupOptions = useMemo(
    () => [
      { value: "", label: "Tanpa Kelompok" },
      ...groups.map((group) => ({ value: group.id, label: group.name })),
    ],
    [groups],
  );

  useEffect(() => {
    if (student) {
      reset({
        name: student.name,
        groupId: student.group?.id ?? "",
        isInternational: student.isInternational,
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: EditStudentFormData) => {
    if (!student) return;
    try {
      await updateStudent({
        id: student.id,
        payload: {
          name: data.name,
          groupId: data.groupId || null,
          isInternational: data.isInternational,
        },
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
      <DialogContent className="sm:max-w-md w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <Pencil className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              Ubah Data Praktikan
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              NIM{" "}
              <strong className="font-medium text-grey-800">
                {student?.nim}
              </strong>{" "}
              tidak dapat diubah dari sini.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Nama Lengkap
              </label>
              <Input
                {...register("name")}
                placeholder="Nama praktikan"
                className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium tracking-tight text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Kelompok
              </label>
              <Controller
                control={control}
                name="groupId"
                render={({ field }) => (
                  <FilterDropdown<string>
                    value={field.value || ""}
                    options={groupOptions}
                    onChange={field.onChange}
                    widthClassName="w-full"
                    hideCheckIcon={true}
                  />
                )}
              />
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 px-4 py-3 backdrop-blur-md shadow-sm">
              <div>
                <p className="text-sm font-medium tracking-tight text-grey-900">
                  Kelas Internasional
                </p>
                <p className="mt-0.5 font-secondary text-[11px] leading-relaxed tracking-tight text-grey-500">
                  Praktikan menerima soal ujian (TA/TP) dalam bahasa Inggris.
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
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
