"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle } from "lucide-react";
import axios from "axios";
import {
  questionFormSchema,
  QuestionFormData,
} from "../schemas/admin-question.schema";
import {
  useCreateQuestion,
  useUpdateQuestion,
} from "../hooks/use-admin-questions";
import { AdminQuestion, AnswerOption } from "../types/admin-question.type";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";

type QuestionFormDialogProps = {
  question: AdminQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultModuleId?: string;
};

const ANSWER_OPTIONS: AnswerOption[] = ["A", "B", "C", "D", "E"];

export function QuestionFormDialog({
  question,
  open,
  onOpenChange,
  defaultModuleId,
}: QuestionFormDialogProps) {
  const isEditing = !!question;
  const [langTab, setLangTab] = useState<"ID" | "EN">("ID");

  const { data: modulesRes } = useStudentModules(1, 50);
  const modules = modulesRes?.data ?? [];

  const { mutateAsync: createQuestion, isPending: isCreating } =
    useCreateQuestion();
  const { mutateAsync: updateQuestion, isPending: isUpdating } =
    useUpdateQuestion();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: { type: "TA" },
  });

  const selectedType = watch("type");

  useEffect(() => {
    if (!open) return;
    setLangTab("ID");

    if (question) {
      reset({
        moduleId: question.moduleId,
        type: question.type,
        content: question.content,
        contentEn: question.contentEn ?? "",
        optionA: question.optionA ?? "",
        optionB: question.optionB ?? "",
        optionC: question.optionC ?? "",
        optionD: question.optionD ?? "",
        optionE: question.optionE ?? "",
        optionAEn: question.optionAEn ?? "",
        optionBEn: question.optionBEn ?? "",
        optionCEn: question.optionCEn ?? "",
        optionDEn: question.optionDEn ?? "",
        optionEEn: question.optionEEn ?? "",
        correctAnswer: question.correctAnswer ?? undefined,
      });
    } else {
      reset({
        moduleId: defaultModuleId ?? "",
        type: "TA",
        content: "",
        contentEn: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        optionE: "",
        optionAEn: "",
        optionBEn: "",
        optionCEn: "",
        optionDEn: "",
        optionEEn: "",
        correctAnswer: undefined,
      });
    }
  }, [open, question, defaultModuleId, reset]);

  const onSubmit = async (data: QuestionFormData) => {
    const payload =
      data.type === "TA"
        ? data
        : {
            moduleId: data.moduleId,
            type: data.type,
            content: data.content,
            contentEn: data.contentEn,
          };

    try {
      if (isEditing) {
        await updateQuestion({ id: question!.id, payload });
      } else {
        await createQuestion(payload);
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Gagal menyimpan soal."
        : "Gagal menyimpan soal.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <HelpCircle className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>{isEditing ? "Ubah Soal" : "Tambah Soal"}</DialogTitle>
            <DialogDescription>
              Soal TP tidak memerlukan pilihan jawaban. Soal TA wajib memiliki 5
              pilihan dan satu jawaban benar.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Modul Praktikum
                </label>
                <select
                  {...register("moduleId")}
                  className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Pilih modul...</option>
                  {modules.map((m) => (
                    <option key={m.id} value={m.id}>
                      Modul {m.order} — {m.title}
                    </option>
                  ))}
                </select>
                {errors.moduleId && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.moduleId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Jenis Soal
                </label>
                <select
                  {...register("type")}
                  className="h-11 w-full rounded-xl border border-grey-200 bg-grey-50 px-3.5 text-sm text-grey-900 focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="TA">Tes Awal (TA)</option>
                  <option value="TP">Tugas Pendahuluan (TP)</option>
                </select>
              </div>
            </div>

            <div className="flex w-full rounded-xl bg-grey-100 p-1 mb-2">
              <button
                type="button"
                onClick={() => setLangTab("ID")}
                className={`flex-1 rounded-lg py-1.5 font-secondary text-xs font-bold transition ${
                  langTab === "ID"
                    ? "bg-white text-primary shadow-sm"
                    : "text-grey-500 hover:text-grey-700"
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => setLangTab("EN")}
                className={`flex-1 rounded-lg py-1.5 font-secondary text-xs font-bold transition ${
                  langTab === "EN"
                    ? "bg-white text-primary shadow-sm"
                    : "text-grey-500 hover:text-grey-700"
                }`}
              >
                🇬🇧 English (Opsional)
              </button>
            </div>

            {/* TAB BAHASA INDONESIA */}
            <div className={langTab === "ID" ? "block space-y-4" : "hidden"}>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Pertanyaan (ID)
                </label>
                <Textarea
                  {...register("content")}
                  rows={3}
                  placeholder="Tuliskan pertanyaan dalam bahasa Indonesia..."
                />
                {errors.content && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {selectedType === "TA" && (
                <div className="space-y-3 rounded-2xl border border-grey-100 bg-grey-50/60 p-4">
                  {ANSWER_OPTIONS.map((opt) => (
                    <div key={opt}>
                      <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                        Pilihan {opt} (ID)
                      </label>
                      <Input
                        {...register(`option${opt}` as const)}
                        placeholder={`Teks pilihan ${opt} (ID)`}
                      />
                      {errors[`option${opt}` as keyof QuestionFormData] && (
                        <p className="mt-1 text-xs font-medium text-error">
                          {
                            (
                              errors[
                                `option${opt}` as keyof QuestionFormData
                              ] as any
                            )?.message
                          }
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TAB ENGLISH */}
            <div className={langTab === "EN" ? "block space-y-4" : "hidden"}>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Pertanyaan (EN)
                </label>
                <Textarea
                  {...register("contentEn")}
                  rows={3}
                  placeholder="Write the question in English..."
                />
              </div>

              {selectedType === "TA" && (
                <div className="space-y-3 rounded-2xl border border-grey-100 bg-grey-50/60 p-4">
                  {ANSWER_OPTIONS.map((opt) => (
                    <div key={`${opt}En`}>
                      <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                        Pilihan {opt} (EN)
                      </label>
                      <Input
                        {...register(`option${opt}En` as const)}
                        placeholder={`Teks pilihan ${opt} (EN)`}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedType === "TA" && (
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-bold text-grey-700">
                  Jawaban Benar
                </label>
                <select
                  {...register("correctAnswer")}
                  className="h-11 w-full rounded-xl border border-grey-200 bg-white px-3.5 text-sm text-grey-900 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                >
                  <option value="">Pilih jawaban benar...</option>
                  {ANSWER_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                {errors.correctAnswer && (
                  <p className="mt-1 text-xs font-medium text-error">
                    {errors.correctAnswer.message}
                  </p>
                )}
              </div>
            )}

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm text-error">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

          <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto"
            >
              {isPending ? "Menyimpan..." : "Simpan Soal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
