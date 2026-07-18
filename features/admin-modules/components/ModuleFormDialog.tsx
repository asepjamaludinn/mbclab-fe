"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, X } from "lucide-react";
import axios from "axios";
import {
  moduleFormSchema,
  ModuleFormData,
} from "../schemas/admin-module.schema";
import { AdminModule } from "../types/admin-module.type";
import { useCreateModule, useUpdateModule } from "../hooks/use-admin-modules";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
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

function toDatetimeLocal(value?: string | null) {
  if (!value) return "";
  const d = new Date(value);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

const DEADLINE_PRESETS = [
  { label: "+1 Hari", hours: 24 },
  { label: "+3 Hari", hours: 72 },
  { label: "+1 Minggu", hours: 168 },
];

type ModuleFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  module?: AdminModule | null;
};

export function ModuleFormDialog({
  open,
  onOpenChange,
  module,
}: ModuleFormDialogProps) {
  const isEditing = !!module;
  const { mutateAsync: createModule, isPending: isCreating } =
    useCreateModule();
  const { mutateAsync: updateModule, isPending: isUpdating } =
    useUpdateModule();
  const isSaving = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<ModuleFormData>({
    resolver: zodResolver(moduleFormSchema) as any,
    defaultValues: {
      title: "",
      order: 1,
      description: "",
      isActive: true,
      tpDeadline: "",
      fileUrlRegular: "",
      fileUrlInternational: "",
    },
  });

  const tpDeadline = watch("tpDeadline");

  useEffect(() => {
    if (open) {
      reset({
        title: module?.title ?? "",
        order: module?.order ?? 1,
        description: module?.description ?? "",
        isActive: module?.isActive ?? true,
        tpDeadline: toDatetimeLocal(module?.tpDeadline),
        fileUrlRegular: module?.fileUrlRegular ?? "",
        fileUrlInternational: module?.fileUrlInternational ?? "",
      });
    }
  }, [open, module, reset]);

  const applyPreset = (hours: number) => {
    const target = new Date(Date.now() + hours * 60 * 60 * 1000);
    setValue("tpDeadline", toDatetimeLocal(target.toISOString()), {
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: ModuleFormData) => {
    const payload = {
      title: data.title,
      order: data.order,
      description: data.description || undefined,
      isActive: data.isActive,
      tpDeadline: data.tpDeadline
        ? new Date(data.tpDeadline).toISOString()
        : undefined,
      fileUrlRegular: data.fileUrlRegular || undefined,
      fileUrlInternational: data.fileUrlInternational || undefined,
    };

    try {
      if (isEditing && module) {
        await updateModule({ id: module.id, payload });
      } else {
        await createModule(payload);
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menyimpan modul."
        : "Gagal menyimpan modul.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <BookOpenCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>
              {isEditing ? "Edit Modul" : "Tambah Modul"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Perbarui informasi modul praktikum ini."
                : "Lengkapi data untuk membuat modul praktikum baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Judul Modul
                </label>
                <Input
                  {...register("title")}
                  placeholder="cth. Pengenalan Jaringan"
                />
                {errors.title && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Urutan
                </label>
                <select
                  {...register("order", { valueAsNumber: true })}
                  className="w-full rounded-2xl border border-grey-200 bg-grey-50 px-3 py-3 font-secondary text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value={1}>Modul 1</option>
                  <option value={2}>Modul 2</option>
                  <option value={3}>Modul 3</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Deskripsi
              </label>
              <Textarea
                rows={3}
                {...register("description")}
                placeholder="Ringkasan materi modul (opsional)"
              />
            </div>

            {/* --- Bagian Deadline TP (auto closed) --- */}
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <div className="flex items-center justify-between">
                <label className="block font-secondary text-xs font-bold text-grey-700">
                  Deadline Pengumpulan TP
                </label>
                {tpDeadline && (
                  <button
                    type="button"
                    onClick={() =>
                      setValue("tpDeadline", "", { shouldDirty: true })
                    }
                    className="inline-flex items-center gap-1 font-secondary text-[11px] font-bold text-error hover:underline"
                  >
                    <X className="h-3 w-3" strokeWidth={2.5} />
                    Hapus deadline
                  </button>
                )}
              </div>

              <p className="mt-1 font-secondary text-[11px] leading-relaxed text-grey-500">
                Setelah waktu ini terlewati, praktikan{" "}
                <strong>otomatis tidak bisa lagi mengunggah</strong> TP untuk
                modul ini. Kosongkan jika TP tidak memiliki batas waktu.
              </p>

              <div className="mt-3">
                <Input type="datetime-local" {...register("tpDeadline")} />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {DEADLINE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.hours)}
                    className="rounded-full border border-primary/20 bg-white px-3 py-1 font-secondary text-[11px] font-bold text-primary transition hover:bg-primary hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Link Modul (Reguler)
                </label>
                <Input
                  {...register("fileUrlRegular")}
                  placeholder="https://..."
                />
                {errors.fileUrlRegular && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.fileUrlRegular.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Link Modul (Internasional)
                </label>
                <Input
                  {...register("fileUrlInternational")}
                  placeholder="https://..."
                />
                {errors.fileUrlInternational && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.fileUrlInternational.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-grey-100 bg-grey-50/60 px-4 py-3">
              <div>
                <p className="text-sm font-bold text-grey-900">Status Modul</p>
                <p className="mt-0.5 font-secondary text-xs text-grey-500">
                  Modul aktif akan tampil untuk praktikan
                </p>
              </div>
              <Controller
                control={control}
                name="isActive"
                render={({ field }) => (
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
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
              disabled={isSaving}
              className="w-full sm:w-auto"
            >
              {isSaving
                ? "Menyimpan..."
                : isEditing
                  ? "Simpan Perubahan"
                  : "Buat Modul"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
