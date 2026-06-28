import { z } from "zod";

export const loginSchema = z.object({
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama tidak boleh kosong"),
    newPassword: z
      .string()
      .min(1, "Password baru tidak boleh kosong")
      .min(6, "Password baru minimal 6 karakter"),
    confirmPassword: z
      .string()
      .min(1, "Konfirmasi password tidak boleh kosong"),
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Password baru tidak boleh sama dengan password lama",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
