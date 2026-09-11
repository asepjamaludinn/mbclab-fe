"use client";

import { useEffect, useState, useMemo } from "react";
import { useForm, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HelpCircle, AlertTriangle, Wand2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import {
  questionFormSchema,
  QuestionFormData,
} from "../schemas/admin-question.schema";
import {
  useCreateQuestion,
  useUpdateQuestion,
  useBulkCreateQuestionsManual,
} from "../hooks/use-admin-questions";
import {
  AdminQuestion,
  AnswerOption,
  QuestionType,
  TpVariant,
} from "../types/admin-question.type";
import { useStudentModules } from "@/features/student-modules";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { FilterDropdown } from "@/shared/components/ui/filter-dropdown";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { detectMultipleQuestions } from "../utils/question-splitter";

type QuestionFormDialogProps = {
  question: AdminQuestion | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultModuleId?: string;
};

const ANSWER_OPTIONS: AnswerOption[] = ["A", "B", "C", "D", "E"];
const TYPE_OPTIONS = [
  { value: "TA", label: "Tes Awal (TA)" },
  { value: "TP", label: "Tugas Pendahuluan (TP)" },
];

const TP_VARIANT_OPTIONS = [
  { value: "ALL", label: "Semua Praktikan" },
  { value: "ODD", label: "Ganjil (NIM ganjil)" },
  { value: "EVEN", label: "Genap (NIM genap)" },
];

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

  const moduleOptions = useMemo(
    () => [
      { value: "", label: "Pilih modul..." },
      ...modules.map((m) => ({
        value: m.id,
        label: `Modul ${m.order} — ${m.title}`,
      })),
    ],
    [modules],
  );

  const correctAnswerOptions = useMemo(
    () => [
      { value: "", label: "Pilih jawaban benar..." },
      ...ANSWER_OPTIONS.map((opt) => ({ value: opt, label: opt })),
    ],
    [],
  );

  const { mutateAsync: createQuestion, isPending: isCreating } =
    useCreateQuestion();
  const { mutateAsync: updateQuestion, isPending: isUpdating } =
    useUpdateQuestion();
  const { mutateAsync: bulkCreateManual, isPending: isBulkCreating } =
    useBulkCreateQuestionsManual();
  const isPending = isCreating || isUpdating;

  const {
    register,
    handleSubmit,
    control,
    watch,
    getValues,
    reset,
    setError,
    formState: { errors },
  } = useForm<QuestionFormData>({
    resolver: zodResolver(questionFormSchema) as any,
    defaultValues: { type: "TA", tpVariant: "ALL" },
  });

  const selectedType = watch("type");
  const watchedContent = watch("content");
  const watchedContentEn = watch("contentEn");
  const hasValidationErrors =
    Object.keys(errors).filter((k) => k !== "root").length > 0;

  const splitID = useMemo(
    () => detectMultipleQuestions(watchedContent || ""),
    [watchedContent],
  );
  const splitEN = useMemo(
    () => detectMultipleQuestions(watchedContentEn || ""),
    [watchedContentEn],
  );

  const isMultipleDetected = !isEditing && !!splitID && splitID.length >= 2;

  const canAutoSplit = isMultipleDetected && selectedType === "TP";

  useEffect(() => {
    if (!open) return;
    setLangTab("ID");

    if (question) {
      reset({
        moduleId: question.moduleId,
        type: question.type,
        tpVariant: question.tpVariant ?? "ALL",
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
        tpVariant: "ALL",
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

  const onInvalid = (validationErrors: FieldErrors<QuestionFormData>) => {
    if (
      validationErrors.content ||
      validationErrors.optionA ||
      validationErrors.optionB ||
      validationErrors.optionC ||
      validationErrors.optionD ||
      validationErrors.optionE ||
      validationErrors.correctAnswer
    ) {
      setLangTab("ID");
    } else if (
      validationErrors.contentEn ||
      validationErrors.optionAEn ||
      validationErrors.optionBEn ||
      validationErrors.optionCEn ||
      validationErrors.optionDEn ||
      validationErrors.optionEEn
    ) {
      setLangTab("EN");
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    const correctAnswer =
      data.correctAnswer === "" ? undefined : data.correctAnswer;

    const payload =
      data.type === "TA"
        ? { ...data, correctAnswer }
        : {
            moduleId: data.moduleId,
            type: data.type,
            tpVariant: data.tpVariant ?? "ALL",
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

  const handleAutoSplit = async () => {
    if (!splitID || splitID.length < 2) return;

    const moduleIdValue = getValues("moduleId");
    if (!moduleIdValue) {
      setError("root.serverError", {
        type: "server",
        message:
          "Pilih modul terlebih dahulu sebelum memisahkan soal secara otomatis.",
      });
      return;
    }

    const tpVariantValue = (getValues("tpVariant") as TpVariant) || "ALL";
    const useEnglishSplit = !!splitEN && splitEN.length === splitID.length;

    const payload = splitID.map((item, idx) => ({
      moduleId: moduleIdValue,
      type: "TP" as QuestionType,
      tpVariant: tpVariantValue,
      content: item.text,
      contentEn: useEnglishSplit ? splitEN![idx].text : undefined,
    }));

    try {
      const res = await bulkCreateManual({ questions: payload });
      toast.success(res.message);
      if (res.failedCount > 0) {
        toast.warning(
          `${res.failedCount} dari ${payload.length} soal gagal disimpan. Periksa kembali daftar soal (kemungkinan duplikat atau kuota TP variasi ini sudah penuh).`,
        );
      }
      onOpenChange(false);
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message ||
          "Gagal memisahkan dan menyimpan soal."
        : "Gagal memisahkan dan menyimpan soal.";
      setError("root.serverError", {
        type: "server",
        message: Array.isArray(message) ? message[0] : message,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl w-[calc(100%-2rem)] rounded-[32px] border border-white/50 bg-white/70 p-6 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.1)] backdrop-blur-3xl">
        <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/90 text-white shadow-xl shadow-primary/20 backdrop-blur-md">
              <HelpCircle className="h-7 w-7" strokeWidth={1.5} />
            </div>
            <DialogTitle className="text-xl font-medium tracking-tighter text-grey-900">
              {isEditing ? "Ubah Soal" : "Tambah Soal"}
            </DialogTitle>
            <DialogDescription className="font-secondary text-sm leading-relaxed tracking-tight text-grey-500">
              Soal TP tidak memerlukan pilihan jawaban. Soal TA wajib memiliki 5
              pilihan dan satu jawaban benar. Setiap formulir hanya untuk{" "}
              <strong>satu soal</strong> — jangan gabungkan beberapa soal
              bernomor dalam satu kolom pertanyaan.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 max-h-[60vh] space-y-4 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Modul Praktikum
                </label>
                <Controller
                  control={control}
                  name="moduleId"
                  render={({ field }) => (
                    <FilterDropdown<string>
                      value={field.value}
                      options={moduleOptions}
                      onChange={field.onChange}
                      widthClassName="w-full"
                      hideCheckIcon={true}
                    />
                  )}
                />
                {errors.moduleId && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.moduleId.message}
                  </p>
                )}
              </div>

              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Jenis Soal
                </label>
                <Controller
                  control={control}
                  name="type"
                  render={({ field }) => (
                    <FilterDropdown<QuestionType>
                      value={field.value as QuestionType}
                      options={TYPE_OPTIONS as any}
                      onChange={field.onChange}
                      widthClassName="w-full"
                      hideCheckIcon={true}
                    />
                  )}
                />
              </div>
              {selectedType === "TP" && (
                <div>
                  <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                    Variasi Soal TP
                  </label>
                  <Controller
                    control={control}
                    name="tpVariant"
                    render={({ field }) => (
                      <FilterDropdown<string>
                        value={field.value || "ALL"}
                        options={TP_VARIANT_OPTIONS}
                        onChange={field.onChange}
                        widthClassName="w-full"
                        hideCheckIcon={true}
                      />
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex w-full rounded-2xl bg-white/40 border border-white/50 p-1 mb-2 backdrop-blur-md shadow-sm">
              <button
                type="button"
                onClick={() => setLangTab("ID")}
                className={`flex-1 rounded-xl py-2 font-secondary text-xs font-medium tracking-tight transition-all ${
                  langTab === "ID"
                    ? "bg-white/80 text-primary shadow-sm"
                    : "text-grey-500 hover:text-grey-700 hover:bg-white/30"
                }`}
              >
                🇮🇩 Indonesia
              </button>
              <button
                type="button"
                onClick={() => setLangTab("EN")}
                className={`flex-1 rounded-xl py-2 font-secondary text-xs font-medium tracking-tight transition-all ${
                  langTab === "EN"
                    ? "bg-white/80 text-primary shadow-sm"
                    : "text-grey-500 hover:text-grey-700 hover:bg-white/30"
                }`}
              >
                🇬🇧 English (Opsional)
              </button>
            </div>

            {isMultipleDetected && (
              <div className="rounded-2xl border border-warning/20 bg-warning/5 p-4 backdrop-blur-md">
                <div className="flex items-start gap-2.5">
                  <AlertTriangle
                    className="mt-0.5 h-4 w-4 shrink-0 text-warning-700"
                    strokeWidth={1.5}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-secondary text-sm font-medium tracking-tight text-warning-700">
                      Terdeteksi kemungkinan {splitID!.length} soal bernomor
                      dalam satu kolom pertanyaan.
                    </p>
                    <p className="mt-1 font-secondary text-xs leading-relaxed tracking-tight text-warning-700/90">
                      Setiap soal sebaiknya diunggah satu per satu agar
                      tersimpan sebagai entri terpisah di bank soal.
                      {selectedType === "TA" &&
                        " Untuk soal TA, silakan pisahkan secara manual karena masing-masing soal butuh pilihan jawaban yang berbeda."}
                    </p>

                    {canAutoSplit && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAutoSplit}
                        disabled={isBulkCreating}
                        className="mt-3 h-8 rounded-lg px-3 text-xs font-medium tracking-tight"
                      >
                        <Wand2
                          className="mr-1.5 h-3.5 w-3.5"
                          strokeWidth={1.5}
                        />
                        {isBulkCreating
                          ? "Memisahkan..."
                          : `Pisahkan Otomatis Menjadi ${splitID!.length} Soal`}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB BAHASA INDONESIA */}
            <div className={langTab === "ID" ? "block space-y-4" : "hidden"}>
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Pertanyaan (ID)
                </label>
                <Textarea
                  {...register("content")}
                  rows={3}
                  placeholder="Tuliskan satu pertanyaan saja dalam bahasa Indonesia..."
                  className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
                />
                {errors.content && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.content.message}
                  </p>
                )}
              </div>

              {selectedType === "TA" && (
                <div className="space-y-3 rounded-2xl border border-white/50 bg-white/30 backdrop-blur-md shadow-sm p-4">
                  {ANSWER_OPTIONS.map((opt) => (
                    <div key={opt}>
                      <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                        Pilihan {opt} (ID)
                      </label>
                      <Input
                        {...register(`option${opt}` as const)}
                        placeholder={`Teks pilihan ${opt} (ID)`}
                        className="bg-white/60 backdrop-blur-md border-white/50 font-medium tracking-tight"
                      />
                      {errors[`option${opt}` as keyof QuestionFormData] && (
                        <p className="mt-1 text-xs font-medium tracking-tight text-error">
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
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Pertanyaan (EN)
                </label>
                <Textarea
                  {...register("contentEn")}
                  rows={3}
                  placeholder="Write only one question in English..."
                  className="bg-white/50 backdrop-blur-md border-white/40 font-medium tracking-tight"
                />
              </div>

              {selectedType === "TA" && (
                <div className="space-y-3 rounded-2xl border border-white/50 bg-white/30 backdrop-blur-md shadow-sm p-4">
                  {ANSWER_OPTIONS.map((opt) => (
                    <div key={`${opt}En`}>
                      <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                        Pilihan {opt} (EN)
                      </label>
                      <Input
                        {...register(`option${opt}En` as const)}
                        placeholder={`Teks pilihan ${opt} (EN)`}
                        className="bg-white/60 backdrop-blur-md border-white/50 font-medium tracking-tight"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {selectedType === "TA" && (
              <div>
                <label className="mb-1.5 block font-secondary text-xs font-medium tracking-tight text-grey-700">
                  Jawaban Benar
                </label>
                <Controller
                  control={control}
                  name="correctAnswer"
                  render={({ field }) => (
                    <FilterDropdown<string>
                      value={field.value || ""}
                      options={correctAnswerOptions}
                      onChange={field.onChange}
                      widthClassName="w-full"
                      hideCheckIcon={true}
                    />
                  )}
                />
                {errors.correctAnswer && (
                  <p className="mt-1 text-xs font-medium tracking-tight text-error">
                    {errors.correctAnswer.message}
                  </p>
                )}
              </div>
            )}

            {/* Indikator Validasi Error UI Baru */}
            {hasValidationErrors && (
              <div className="rounded-2xl border border-warning/15 bg-warning/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-warning-700 backdrop-blur-md">
                Ada isian yang masih kosong atau belum sesuai. Silakan periksa
                kembali tanda merah pada form.
              </div>
            )}

            {errors.root?.serverError && (
              <div className="rounded-2xl border border-error/15 bg-error/5 px-4 py-3 font-secondary text-sm font-medium tracking-tight text-error backdrop-blur-md">
                {errors.root.serverError.message}
              </div>
            )}
          </div>

          <DialogFooter className="mt-7 flex-col-reverse gap-3 sm:flex-row">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full sm:w-auto font-medium tracking-tight border-white/60 bg-white/50 backdrop-blur-md hover:bg-white/80"
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending || isBulkCreating}
              className="w-full sm:w-auto font-medium tracking-tight rounded-xl shadow-lg"
            >
              {isPending ? "Menyimpan..." : "Simpan Soal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
