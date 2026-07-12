import { z } from "zod";

const DAY_VALUES = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;
const WEEK_TYPE_VALUES = ["WEEK_1", "WEEK_2"] as const;
const SHIFT_VALUES = ["SHIFT_1", "SHIFT_2", "SHIFT_3", "SHIFT_4"] as const;

export const groupFormSchema = z
  .object({
    name: z.string().min(1, "Nama kelompok wajib diisi"),
    day: z.union([z.enum(DAY_VALUES), z.literal("")]),
    weekType: z.union([z.enum(WEEK_TYPE_VALUES), z.literal("")]),
    shift: z.union([z.enum(SHIFT_VALUES), z.literal("")]),
  })
  .refine(
    (data) => {
      const values = [data.day, data.weekType, data.shift];
      const filledCount = values.filter((v) => v !== "").length;
      return filledCount === 0 || filledCount === 3;
    },
    {
      message:
        "Hari, Minggu, dan Shift jadwal harus diisi semua atau dikosongkan semua",
      path: ["shift"],
    },
  );

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
