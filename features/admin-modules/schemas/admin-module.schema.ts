import { z } from "zod";

export const moduleFormSchema = z.object({
  title: z.string().min(1, "Judul modul wajib diisi"),
  order: z.number().int().min(1, "Urutan 1-3").max(3, "Urutan 1-3"),
  description: z.string().optional(),
  isActive: z.boolean(),
  tpDeadline: z.string().optional(),
  coverUrl: z.string().optional(),
  fileUrlRegular: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\//.test(v),
      "URL harus valid (https://...)",
    ),
  fileUrlInternational: z
    .string()
    .optional()
    .refine(
      (v) => !v || /^https?:\/\//.test(v),
      "URL harus valid (https://...)",
    ),
});

export type ModuleFormData = z.infer<typeof moduleFormSchema>;
