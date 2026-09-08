"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BookOpenCheck, X, ImageOff, Trash2 } from "lucide-react";
import Image from "next/image";
import axios from "axios";
import {
  moduleFormSchema,
  ModuleFormData,
} from "../schemas/admin-module.schema";
import { AdminModule } from "../types/admin-module.type";
import {
  useCreateModule,
  useUpdateModule,
  useUploadModuleCover,
} from "../hooks/use-admin-modules";
import { resolveAssetUrl } from "@/shared/utils/asset-url";
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

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [coverError, setCoverError] = useState("");

  const { mutateAsync: uploadCover, isPending: isUploadingCover } =
    useUploadModuleCover();
  const { mutateAsync: createModule, isPending: isCreating } =
    useCreateModule();
  const { mutateAsync: updateModule, isPending: isUpdating } =
    useUpdateModule();

  const isSaving = isCreating || isUpdating || isUploadingCover;

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
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: "",
      order: 1,
      description: "",
      isActive: true,
      tpDeadline: "",
      fileUrlRegular: "",
      fileUrlInternational: "",
      coverUrl: "",
    },
  });

  const tpDeadline = watch("tpDeadline");

  useEffect(() => {
    if (!open) return;

    setSelectedFile(null);
    setCoverError("");

    if (module) {
      reset({
        title: module.title,
        order: module.order,
        description: module.description ?? "",
        isActive: module.isActive,
        tpDeadline: toDatetimeLocal(module.tpDeadline),
        fileUrlRegular: module.fileUrlRegular ?? "",
        fileUrlInternational: module.fileUrlInternational ?? "",
        coverUrl: module.coverUrl ?? "",
      });
      setPreviewUrl(resolveAssetUrl(module.coverUrl));
    } else {
      reset({
        title: "",
        order: 1,
        description: "",
        isActive: true,
        tpDeadline: "",
        fileUrlRegular: "",
        fileUrlInternational: "",
        coverUrl: "",
      });
      setPreviewUrl("");
    }
  }, [open, module, reset]);

  const validateAndSetFile = (file: File | undefined | null) => {
    setCoverError("");
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setCoverError("Format cover harus JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setCoverError("Ukuran cover maksimal 2 MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  };

  const handleRemoveCover = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(
      isEditing && module?.coverUrl ? resolveAssetUrl(module.coverUrl) : "",
    );
    setCoverError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const applyPreset = (hours: number) => {
    const target = new Date(Date.now() + hours * 60 * 60 * 1000);
    setValue("tpDeadline", toDatetimeLocal(target.toISOString()), {
      shouldDirty: true,
    });
  };

  const onSubmit = async (data: ModuleFormData) => {
    try {
      let finalCoverUrl = module?.coverUrl || undefined;

      if (selectedFile) {
        finalCoverUrl = await uploadCover(selectedFile);
      } else if (!previewUrl) {
        finalCoverUrl = "";
      }

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
        coverUrl: finalCoverUrl,
      };

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
      <DialogContent className="sm:max-w-xl w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
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
                ? "Perbarui informasi dan dokumen modul praktikum ini."
                : "Lengkapi data untuk membuat modul praktikum baru."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[60vh] space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                Cover Modul (Opsional)
              </label>
              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 backdrop-blur-md transition-all ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-white/60 bg-white/40 hover:border-primary/40 hover:bg-white/60 shadow-sm"
                } cursor-pointer`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex h-20 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-white/60 bg-white shadow-sm">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={56}
                      height={80}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageOff
                      className="h-6 w-6 text-grey-300"
                      strokeWidth={1.5}
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-secondary text-xs font-medium tracking-tight text-grey-700">
                    <span className="text-primary font-semibold">
                      Klik untuk pilih
                    </span>{" "}
                    atau drag & drop gambar
                  </p>
                  <p className="mt-1 font-secondary text-[10px] tracking-tight text-grey-500">
                    Proporsi buku (potret) sangat disarankan · JPG/PNG/WEBP ·
                    Maks 2MB
                  </p>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveCover}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error/10 text-error transition-all hover:bg-error hover:text-white"
                    aria-label="Hapus cover"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              {coverError && (
                <p className="mt-1.5 text-xs font-medium tracking-tight text-error">
                  {coverError}
                </p>
              )}
            </div>

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
                    <X className="h-3 w-3" strokeWidth={1.5} /> Hapus deadline
                  </button>
                )}
              </div>
              <p className="mt-1 font-secondary text-[11px] leading-relaxed tracking-tight text-grey-500">
                Setelah waktu ini terlewati, praktikan{" "}
                <span className="font-medium text-grey-700">
                  otomatis tidak bisa lagi mengunggah
                </span>{" "}
                TP.
              </p>
              <div className="mt-3">
                <Input
                  type="datetime-local"
                  lang="en-GB"
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
                  Link Modul (Intl)
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
              {isUploadingCover
                ? "Upload Cover..."
                : isSaving
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
