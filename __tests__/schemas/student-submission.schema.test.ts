import { tpSubmissionSchema } from "@/features/student-submissions/schemas/student-submission.schema";

describe("Student Submission Schema", () => {
  const createFile = (sizeInMB: number, type: string, name: string) => {
    const buffer = new ArrayBuffer(sizeInMB * 1024 * 1024);
    return new File([buffer], name, { type });
  };

  it("harus lolos validasi untuk file PDF di bawah 5MB", () => {
    const validPdf = createFile(2, "application/pdf", "tugas.pdf");
    const result = tpSubmissionSchema.safeParse(validPdf);
    expect(result.success).toBe(true);
  });

  it("harus gagal jika file bukan PDF (misal: gambar JPG)", () => {
    const invalidJpg = createFile(2, "image/jpeg", "tugas.jpg");
    const result = tpSubmissionSchema.safeParse(invalidJpg);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("berformat PDF");
    }
  });

  it("harus gagal jika ukuran file PDF melebihi 5MB", () => {
    const oversizedPdf = createFile(6, "application/pdf", "tugas_besar.pdf");
    const result = tpSubmissionSchema.safeParse(oversizedPdf);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toContain("maksimal 5 MB");
    }
  });

  it("harus gagal jika yang diunggah bukan instance dari File (misal null atau string)", () => {
    const resultNull = tpSubmissionSchema.safeParse(null);
    expect(resultNull.success).toBe(false);

    const resultString = tpSubmissionSchema.safeParse("file.pdf");
    expect(resultString.success).toBe(false);
  });
});
