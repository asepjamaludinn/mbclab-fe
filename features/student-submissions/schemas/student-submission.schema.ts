import { z } from "zod";

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024;

export const tpSubmissionSchema = z
  .any()
  .refine(
    (file) => typeof window !== "undefined" && file instanceof File,
    "Silakan pilih file PDF terlebih dahulu.",
  )
  .refine(
    (file) => file instanceof File && file.type === "application/pdf",
    "File harus berformat PDF.",
  )
  .refine(
    (file) => file instanceof File && file.size <= MAX_FILE_SIZE,
    `Ukuran file maksimal ${MAX_FILE_SIZE_MB} MB.`,
  );
