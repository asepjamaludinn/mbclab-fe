import { z } from "zod";

export const groupFormSchema = z.object({
  name: z.string().min(1, "Nama kelompok wajib diisi"),
});
export type GroupFormData = z.infer<typeof groupFormSchema>;

export const assignStudentsSchema = z.object({
  nims: z
    .array(
      z.object({
        value: z.string(),
      }),
    )
    .min(1),
});
export type AssignStudentsFormData = z.infer<typeof assignStudentsSchema>;
