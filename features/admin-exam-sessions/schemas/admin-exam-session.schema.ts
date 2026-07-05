import { z } from "zod";

export const examSessionFormSchema = z
  .object({
    moduleId: z.string().min(1, "Modul wajib dipilih"),
    groupId: z.string().min(1, "Kelompok wajib dipilih"),
    date: z.string().min(1, "Tanggal wajib diisi"),
    shift: z.enum(["SHIFT_1", "SHIFT_2", "SHIFT_3", "SHIFT_4"]),
    startTime: z.string().min(1, "Waktu mulai wajib diisi"),
    endTime: z.string().min(1, "Waktu selesai wajib diisi"),
    accessCode: z.string().min(4, "Kode akses minimal 4 karakter"),
  })
  .refine((data) => data.startTime < data.endTime, {
    message: "Waktu mulai harus lebih awal dari waktu selesai",
    path: ["endTime"],
  });

export type ExamSessionFormData = z.infer<typeof examSessionFormSchema>;
