import { z } from "zod";

export const createAdminSchema = z.object({
  nim: z.string().min(5, "NIM/Username wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  division: z
    .enum(["COORDINATOR", "ACADEMIC", "PRACTICUM"])
    .optional()
    .nullable(),
});

export type CreateAdminFormData = z.infer<typeof createAdminSchema>;
