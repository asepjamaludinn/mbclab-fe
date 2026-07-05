import { z } from "zod";

export const MAX_PHOTO_SIZE_MB = 2;
export const MAX_PHOTO_SIZE = MAX_PHOTO_SIZE_MB * 1024 * 1024;
export const ACCEPTED_PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const assistantFormSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  position: z.string().min(1, "Posisi/jabatan wajib diisi"),
  order: z.coerce
    .number({ message: "Urutan harus berupa angka" })
    .int("Urutan harus bilangan bulat")
    .min(0, "Urutan minimal 0"),
  isActive: z.boolean(),
});

export type AssistantFormData = z.infer<typeof assistantFormSchema>;
