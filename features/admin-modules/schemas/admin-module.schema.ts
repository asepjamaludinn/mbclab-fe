import { z } from "zod";

export const moduleFormSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  order: z.coerce.number().int().min(1, "Urutan 1-3").max(3, "Urutan 1-3"),
  description: z.string().optional(),
  isActive: z.boolean(),
  tpDeadline: z.string().optional(),
  fileUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\//.test(v),
      "URL harus valid (https://...)",
    ),
});

export type ModuleFormData = z.infer<typeof moduleFormSchema>;
