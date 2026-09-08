import { z } from "zod";

const AnswerEnum = z.enum(["A", "B", "C", "D", "E"]);

export const questionFormSchema = z
  .object({
    moduleId: z.string().min(1, "Modul wajib dipilih"),
    type: z.enum(["TP", "TA"]),
    tpVariant: z.enum(["ALL", "EVEN", "ODD"]).optional().default("ALL"),
    content: z.string().min(1, "Pertanyaan wajib diisi"),
    contentEn: z.string().optional(),
    optionA: z.string().optional(),
    optionB: z.string().optional(),
    optionC: z.string().optional(),
    optionD: z.string().optional(),
    optionE: z.string().optional(),
    optionAEn: z.string().optional(),
    optionBEn: z.string().optional(),
    optionCEn: z.string().optional(),
    optionDEn: z.string().optional(),
    optionEEn: z.string().optional(),

    correctAnswer: z.union([AnswerEnum, z.literal("")]).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type !== "TA") return;

    (["optionA", "optionB", "optionC", "optionD", "optionE"] as const).forEach(
      (field) => {
        if (!data[field] || !data[field]?.trim()) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Wajib diisi untuk soal TA",
            path: [field],
          });
        }
      },
    );

    if (!data.correctAnswer) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Jawaban benar wajib dipilih untuk soal TA",
        path: ["correctAnswer"],
      });
    }
  });

export type QuestionFormData = z.infer<typeof questionFormSchema>;
