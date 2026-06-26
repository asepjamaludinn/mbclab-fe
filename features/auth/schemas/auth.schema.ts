import { z } from "zod";

export const loginSchema = z.object({
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
