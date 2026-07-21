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
      <DialogContent className="sm:max-w-lg w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <BookOpenCheck className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              {isEditing ? "Edit Modul" : "Tambah Modul"}
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              {isEditing
                ? "Perbarui informasi modul praktikum ini."
                : "Lengkapi data untuk membuat modul praktikum baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[65vh] space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Judul Modul
                </label>
                <Input
                  {...register("title")}
                  placeholder="cth. Pengenalan Jaringan"
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.title && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Urutan
                </label>
                <Controller
                  control={control}
                  name="order"
                  render={({ field }) => (
                    <FilterDropdown<number>
                      value={field.value}
                      options={[
                        { value: 1, label: "Modul 1" },
                        { value: 2, label: "Modul 2" },
                        { value: 3, label: "Modul 3" },
                      ]}
                      onChange={(val) => field.onChange(val)}
                      widthClassName="w-full"
                      hideCheckIcon={true}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Deskripsi
              </label>
              <Textarea
                rows={3}
                {...register("description")}
                placeholder="Ringkasan materi modul (opsional)"
                className="bg-white/50 backdrop-blur-md border-white/40"
              />
            </div>

            {/* --- Bagian Deadline TP (auto closed) --- */}
            <div className="rounded-2xl border border-primary/15 bg-primary/5 p-4 backdrop-blur-md">
              <div className="flex items-center justify-between">
                <label className="block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Deadline Pengumpulan TP
                </label>
                {tpDeadline && (
                  <button
                    type="button"
                    onClick={() =>
                      setValue("tpDeadline", "", { shouldDirty: true })
                    }
                    className="inline-flex items-center gap-1 font-secondary text-[11px] font-medium tracking-tight text-error hover:underline"
                  >
                    <X className="h-3 w-3" strokeWidth={1.5} />
                    Hapus deadline
                  </button>
                )}
              </div>

              <p className="mt-1 font-secondary text-[11px] leading-relaxed tracking-tight text-grey-500">
                Setelah waktu ini terlewati, praktikan{" "}
                <span className="font-medium text-grey-700">
                  otomatis tidak bisa lagi mengunggah
                </span>{" "}
                TP untuk modul ini. Kosongkan jika TP tidak memiliki batas
                waktu.
              </p>

              <div className="mt-3">
                <Input
                  type="datetime-local"
                  {...register("tpDeadline")}
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
              </div>

              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {DEADLINE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset.hours)}
                    className="rounded-full border border-primary/20 bg-white/60 backdrop-blur-md px-3 py-1 font-secondary text-[11px] font-medium tracking-tight text-primary transition hover:bg-primary/90 hover:text-white"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Link Modul (Reguler)
                </label>
                <Input
                  {...register("fileUrlRegular")}
                  placeholder="https://..."
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.fileUrlRegular && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.fileUrlRegular.message}
                  </p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Link Modul (Internasional)
                </label>
                <Input
                  {...register("fileUrlInternational")}
                  placeholder="https://..."
                  className="bg-white/50 backdrop-blur-md border-white/40"
                />
                {errors.fileUrlInternational && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.fileUrlInternational.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-2xl border border-white/50 bg-white/40 backdrop-blur-md px-4 py-3">
              <div>
                <p className="text-sm font-medium tracking-tight text-grey-900">
                  Status Modul
                </p>
                <p className="mt-0.5 font-secondary text-xs tracking-tight text-grey-500">
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
              disabled={isSaving}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
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
