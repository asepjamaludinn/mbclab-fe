import { z } from "zod";

export const createStudentSchema = z.object({
  nim: z
    .string()
    .min(10, "NIM minimal 10 karakter")
    .max(15, "NIM maksimal 15 karakter"),
  name: z.string().min(1, "Nama wajib diisi"),
});
export type CreateStudentFormData = z.infer<typeof createStudentSchema>;

export const editStudentSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  groupId: z.string(),
});
export type EditStudentFormData = z.infer<typeof editStudentSchema>;
