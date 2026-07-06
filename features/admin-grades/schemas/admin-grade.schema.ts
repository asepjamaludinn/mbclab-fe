import { z } from "zod";

export const updateTpScoreSchema = z.object({
  tpScore: z
    .number({ message: "Nilai TP wajib diisi dan harus berupa angka" })
    .min(0, "Nilai TP minimal 0")
    .max(100, "Nilai TP maksimal 100"),
});

export type UpdateTpScoreFormData = z.infer<typeof updateTpScoreSchema>;
