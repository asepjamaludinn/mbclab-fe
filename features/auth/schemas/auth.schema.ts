import { z } from "zod";

export const loginSchema = z.object({
  nim: z.string().min(1, "NIM tidak boleh kosong"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 64;

const newPasswordSchema = z
  .string()
  .min(1, "Password baru tidak boleh kosong")
  .min(
    PASSWORD_MIN_LENGTH,
    `Password baru minimal ${PASSWORD_MIN_LENGTH} karakter`,
  )
  .max(
    PASSWORD_MAX_LENGTH,
    `Password baru maksimal ${PASSWORD_MAX_LENGTH} karakter`,
  )
  .refine((val) => /[a-z]/.test(val), {
    message: "Password baru harus mengandung huruf kecil (a-z)",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password baru harus mengandung huruf besar (A-Z)",
  })
  .refine((val) => /[0-9]/.test(val), {
    message: "Password baru harus mengandung angka (0-9)",
  })
  .refine((val) => /[^A-Za-z0-9]/.test(val), {
    message: "Password baru harus mengandung simbol (misal: !@#$%^&*)",
  });

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Password lama tidak boleh kosong"),
    newPassword: newPasswordSchema,
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

export const PASSWORD_POLICY_HINT = `Minimal ${PASSWORD_MIN_LENGTH} karakter, kombinasi huruf besar, huruf kecil, angka, dan simbol.`;
