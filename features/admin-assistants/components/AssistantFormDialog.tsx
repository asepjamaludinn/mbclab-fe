"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRoundCheck, Trash2, ImageOff } from "lucide-react";
import axios from "axios";
import {
  assistantFormSchema,
  AssistantFormData,
  MAX_PHOTO_SIZE,
  MAX_PHOTO_SIZE_MB,
  ACCEPTED_PHOTO_TYPES,
} from "../schemas/admin-assistant.schema";
import {
  useCreateAssistant,
  useUpdateAssistant,
  useUploadAssistantPhoto,
} from "../hooks/use-admin-assistants";
import { AdminAssistantProfile } from "../types/admin-assistant.type";
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

type AssistantFormDialogProps = {
  assistant: AdminAssistantProfile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

function resolvePhotoUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${apiUrl}${path}`;
}

export function AssistantFormDialog({
  assistant,
  open,
  onOpenChange,
}: AssistantFormDialogProps) {
  const isEditing = !!assistant;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isDragging, setIsDragging] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const { mutateAsync: uploadPhoto, isPending: isUploadingPhoto } =
    useUploadAssistantPhoto();
  const { mutateAsync: createAssistant, isPending: isCreating } =
    useCreateAssistant();
  const { mutateAsync: updateAssistant, isPending: isUpdating } =
    useUpdateAssistant();
  const isPending = isCreating || isUpdating || isUploadingPhoto;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<AssistantFormData>({
    resolver: zodResolver(assistantFormSchema) as any,
    defaultValues: { order: 0, isActive: true },
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (!open) return;

    setSelectedFile(null);
    setPhotoError("");

    if (assistant) {
      reset({
        name: assistant.name,
        position: assistant.position,
        order: assistant.order,
        isActive: assistant.isActive,
      });
      setPreviewUrl(resolvePhotoUrl(assistant.photoUrl));
    } else {
      reset({ name: "", position: "", order: 0, isActive: true });
      setPreviewUrl("");
    }
  }, [open, assistant, reset]);

  const validateAndSetFile = (file: File | undefined | null) => {
    setPhotoError("");

    if (!file) return;

    if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
      setPhotoError("Format foto harus JPG, PNG, atau WEBP.");
      return;
    }
    if (file.size > MAX_PHOTO_SIZE) {
      setPhotoError(`Ukuran foto maksimal ${MAX_PHOTO_SIZE_MB} MB.`);
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

  const handleRemovePhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(isEditing ? resolvePhotoUrl(assistant!.photoUrl) : "");
    setPhotoError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const onSubmit = async (data: AssistantFormData) => {
    if (!isEditing && !selectedFile) {
      setPhotoError("Foto profil wajib diunggah.");
      return;
    }

    try {
      let photoUrl = assistant?.photoUrl;

      if (selectedFile) {
        photoUrl = await uploadPhoto(selectedFile);
      }

      const payload = { ...data, photoUrl: photoUrl! };

      if (isEditing) {
        await updateAssistant({ id: assistant!.id, payload });
      } else {
        await createAssistant(payload);
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menyimpan data asisten."
        : "Gagal menyimpan data asisten.";
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
              <UserRoundCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>
              {isEditing ? "Ubah Profil Asisten" : "Tambah Profil Asisten"}
            </DialogTitle>
            <DialogDescription>
              Foto akan otomatis dipangkas menjadi bentuk lingkaran di halaman
              publik.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 space-y-4">
            {/* Photo picker */}
            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Foto Profil
              </label>

              <div
                onClick={() => inputRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative flex items-center gap-4 rounded-2xl border-2 border-dashed p-4 transition ${
                  isDragging
                    ? "border-primary bg-primary/5"
                    : "border-grey-200 hover:border-primary/40 hover:bg-grey-50"
                } cursor-pointer`}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-grey-200 bg-white">
                  {previewUrl ? (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={64}
                      height={64}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <ImageOff className="h-6 w-6 text-grey-300" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="font-secondary text-xs font-semibold text-grey-700">
                    <span className="text-primary">Klik untuk pilih</span> atau
                    drag & drop foto
                  </p>
                  <p className="mt-1 font-secondary text-[11px] text-grey-500">
                    JPG, PNG, WEBP · maks {MAX_PHOTO_SIZE_MB} MB
                  </p>
                </div>

                {previewUrl && (
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-error/10 text-error transition hover:bg-error hover:text-white"
                    aria-label="Hapus foto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {photoError && (
                <p className="mt-1.5 text-xs font-medium text-error">
                  {photoError}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Nama
              </label>
              <Input {...register("name")} placeholder="cth. Budi Santoso" />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                Posisi / Jabatan
              </label>
              <Input
                {...register("position")}
                placeholder="cth. Asisten Praktikum"
              />
              {errors.position && (
                <p className="mt-1 text-xs font-medium text-error">
                  {errors.position.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Urutan Tampil
                </label>
                <Input
                  type="number"
                  min={0}
                  {...register("order", { valueAsNumber: true })}
                />
                {errors.order && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.order.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Status
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-xl border border-grey-200 bg-grey-50 px-3.5">
                  <Switch
                    checked={isActive}
                    onCheckedChange={(v) => setValue("isActive", v)}
                  />
                  <span className="font-secondary text-sm font-semibold text-grey-700">
                    {isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>
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
              {isUploadingPhoto
                ? "Mengunggah foto..."
                : isPending
                  ? "Menyimpan..."
                  : "Simpan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
