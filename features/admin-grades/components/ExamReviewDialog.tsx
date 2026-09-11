"use client";

import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MinusCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useAdminExamReview } from "../hooks/use-admin-exam-review";
import { AdminExamReviewQuestion } from "../types/admin-exam-review.type";

type ExamReviewDialogProps = {
  moduleId: string | null;
  studentId: string | null;
  studentName?: string;
  onOpenChange: (open: boolean) => void;
};

const ANSWER_OPTIONS: ("A" | "B" | "C" | "D" | "E")[] = [
  "A",
  "B",
  "C",
  "D",
  "E",
];

function QuestionRow({ q }: { q: AdminExamReviewQuestion }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        !q.isAnswered
          ? "border-grey-200 bg-grey-50/60"
          : q.isCorrect
            ? "border-success/20 bg-success/5"
            : "border-error/20 bg-error/5"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-secondary text-xs font-bold uppercase tracking-wider text-grey-400">
          Soal #{q.order}
        </p>

        {!q.isAnswered ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-grey-200 px-2.5 py-1 font-secondary text-[10px] font-bold text-grey-600">
            <MinusCircle className="h-3 w-3" /> Tidak Dijawab
          </span>
        ) : q.isCorrect ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-1 font-secondary text-[10px] font-bold text-success-700">
            <CheckCircle2 className="h-3 w-3" /> Benar
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-error/15 px-2.5 py-1 font-secondary text-[10px] font-bold text-error">
            <XCircle className="h-3 w-3" /> Salah
          </span>
        )}
      </div>

      <p className="mt-2 text-sm font-medium leading-relaxed text-grey-900">
        {q.content}
      </p>

      <div className="mt-3 space-y-1.5">
        {ANSWER_OPTIONS.map((opt) => {
          const text = q[`option${opt}` as keyof AdminExamReviewQuestion] as
            | string
            | null;
          if (!text) return null;

          const isCorrectAnswer = q.correctAnswer === opt;
          const isSelected = q.selectedOption === opt;

          return (
            <div
              key={opt}
              className={`flex items-center gap-2 rounded-xl border px-3 py-2 font-secondary text-xs ${
                isCorrectAnswer
                  ? "border-success/30 bg-success/10 font-semibold text-success-700"
                  : isSelected
                    ? "border-error/30 bg-error/10 font-semibold text-error"
                    : "border-grey-100 bg-white text-grey-600"
              }`}
            >
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-current text-[10px] font-bold">
                {opt}
              </span>
              <span className="flex-1">{text}</span>
              {isCorrectAnswer && (
                <span className="text-[10px] font-bold">Kunci Jawaban</span>
              )}
              {isSelected && !isCorrectAnswer && (
                <span className="text-[10px] font-bold">Dipilih Mahasiswa</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ExamReviewDialog({
  moduleId,
  studentId,
  studentName,
  onOpenChange,
}: ExamReviewDialogProps) {
  const isOpen = !!moduleId && !!studentId;
  const { data, isLoading, isError, error } = useAdminExamReview(
    moduleId,
    studentId,
  );

  const errMessage = (error as any)?.response?.data?.message as
    | string
    | undefined;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto custom-scrollbar rounded-[32px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
        <DialogHeader className="text-left">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
            <ClipboardCheck className="h-7 w-7" strokeWidth={1.8} />
          </div>
          <DialogTitle>Detail Jawaban Tes Awal (TA)</DialogTitle>
          <DialogDescription>
            {studentName ? `${studentName} — ` : ""}
            Rincian jawaban benar/salah per nomor soal.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 w-full animate-pulse rounded-2xl bg-grey-100"
                />
              ))}
            </div>
          ) : isError ? (
            <div className="flex items-start gap-3 rounded-2xl border border-warning/20 bg-warning/5 p-4">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warning-700" />
              <p className="font-secondary text-sm font-medium text-warning-700">
                {errMessage ||
                  "Gagal memuat detail jawaban. Praktikan mungkin belum mengerjakan TA untuk modul ini."}
              </p>
            </div>
          ) : data ? (
            <>
              <div className="mb-5 grid grid-cols-3 gap-3">
                <div className="rounded-2xl border border-grey-100 bg-grey-50/60 p-3 text-center">
                  <p className="text-2xl font-bold text-grey-900">
                    {data.summary.totalQuestions}
                  </p>
                  <p className="font-secondary text-[11px] font-medium text-grey-500">
                    Total Soal
                  </p>
                </div>
                <div className="rounded-2xl border border-success/15 bg-success/5 p-3 text-center">
                  <p className="text-2xl font-bold text-success-700">
                    {data.summary.correctCount}
                  </p>
                  <p className="font-secondary text-[11px] font-medium text-success-700">
                    Benar
                  </p>
                </div>
                <div className="rounded-2xl border border-error/15 bg-error/5 p-3 text-center">
                  <p className="text-2xl font-bold text-error">
                    {data.summary.wrongCount}
                  </p>
                  <p className="font-secondary text-[11px] font-medium text-error">
                    Salah / Kosong
                  </p>
                </div>
              </div>

              {data.attempt.cheatCount > 0 && (
                <div className="mb-4 flex items-center gap-2 rounded-2xl border border-warning/20 bg-warning/5 px-4 py-2.5">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-warning-700" />
                  <p className="font-secondary text-xs font-medium text-warning-700">
                    Tercatat {data.attempt.cheatCount}x indikasi meninggalkan
                    halaman ujian selama pengerjaan.
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {data.questions.map((q) => (
                  <QuestionRow key={q.questionId} q={q} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
