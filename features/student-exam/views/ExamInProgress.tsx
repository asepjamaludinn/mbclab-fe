// features\student-exam\views\ExamInProgress.tsx

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  LayoutGrid,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import { Question } from "../types/student-exam.type";
import { AnswerOption, SaveStatus } from "../hooks/use-exam-session";

type Props = {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, AnswerOption>;
  timeLeft: string;
  isSubmitting: boolean;
  saveStatus: SaveStatus;
  setCurrentIdx: (idx: number | ((prev: number) => number)) => void;
  onSelectAnswer: (questionId: string, option: AnswerOption) => void;
  onManualSubmit: () => void;
};

export function ExamInProgress({
  questions,
  currentIdx,
  answers,
  timeLeft,
  isSubmitting,
  saveStatus,
  setCurrentIdx,
  onSelectAnswer,
  onManualSubmit,
}: Props) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showPalette, setShowPalette] = useState(false); // Default tertutup

  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const isTimeCritical =
    timeLeft.startsWith("00:") || timeLeft.startsWith("01:");

  const handleConfirmSubmit = () => {
    setConfirmOpen(false);
    onManualSubmit();
  };

  const answeredCount = Object.keys(answers).length;

  return (
    <main className="min-h-screen bg-slate-50 pb-36 font-primary selection:bg-primary/20 relative">
      {/* Toast Alert Auto-Save */}
      <div className="pointer-events-none fixed left-0 right-0 top-20 z-50 flex justify-center">
        {saveStatus === "saving" && (
          <div className="flex animate-pulse items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 font-secondary text-[11px] font-bold text-primary shadow-sm backdrop-blur-md">
            Menyimpan jawaban...
          </div>
        )}
        {saveStatus === "error" && (
          <div className="flex items-center gap-2 rounded-full border border-error/20 bg-error/10 px-4 py-1.5 font-secondary text-[11px] font-bold text-error shadow-sm backdrop-blur-md">
            <AlertCircle className="h-3.5 w-3.5" /> Gagal menyimpan, coba pilih
            ulang.
          </div>
        )}
      </div>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-md items-center justify-between">
          {/* Timer */}
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${isTimeCritical ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}
          >
            <Clock
              className={`h-4.5 w-4.5 shrink-0 ${isTimeCritical && "animate-pulse"}`}
              strokeWidth={2}
            />
            <span className="tabular-nums font-secondary text-[15px] font-extrabold tracking-wide">
              {timeLeft}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol & Wrapper Floating Palette */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPalette(!showPalette)}
                className={`h-9 w-9 rounded-full p-0 border-slate-200 transition-colors ${
                  showPalette
                    ? "bg-primary/10 text-primary border-primary/20"
                    : "bg-white text-slate-600"
                }`}
                title="Lihat Semua Nomor"
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>

              {/* FLOATING PALETTE */}
              {showPalette && (
                <>
                  {/* Backdrop tak terlihat untuk menutup popover ketika area luar diklik */}
                  <div
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px]"
                    onClick={() => setShowPalette(false)}
                  />

                  {/* Kontainer Grid Nomor (Absolute) */}
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-[280px] origin-top-right rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 sm:w-[320px]">
                    <div className="mb-3 flex items-center justify-between border-b border-slate-100 pb-3">
                      <p className="font-secondary text-xs font-bold uppercase tracking-wider text-slate-500">
                        Navigasi Soal
                      </p>
                      <p className="font-secondary text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {answeredCount} / {questions.length} Dijawab
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {questions.map((q, i) => {
                        const isCurrent = i === currentIdx;
                        const isAnswered = !!answers[q.id];

                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => {
                              setCurrentIdx(i);
                              setShowPalette(false); // Tutup otomatis setelah loncat soal
                            }}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl font-secondary text-sm font-bold transition-all duration-150 active:scale-95 ${
                              isCurrent
                                ? "bg-primary text-white shadow-md ring-2 ring-primary/20 ring-offset-2"
                                : isAnswered
                                  ? "bg-success/15 border border-success/30 text-success-700 hover:bg-success/25"
                                  : "bg-slate-100 border border-transparent text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={isSubmitting}
              variant="outline"
              className="h-9 rounded-full border-error/30 px-4 text-xs font-bold text-error hover:bg-error/10 hover:text-error-700"
            >
              {isSubmitting ? "Menyimpan..." : "Akhiri"}
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-4 flex w-full max-w-md gap-1">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === currentIdx
                    ? "bg-primary"
                    : isAnswered
                      ? "bg-success/60"
                      : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </header>

      <section className="mx-auto w-full max-w-md px-5 pt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-slate-200/60 px-3 py-1 font-secondary text-xs font-extrabold uppercase tracking-wider text-slate-600">
          Soal {currentIdx + 1} dari {questions.length}
        </div>

        <h2 className="text-[19px] font-extrabold leading-relaxed text-slate-900 selection:bg-primary/20">
          {currentQuestion?.content}
        </h2>

        <div className="mt-8 space-y-3">
          {(["A", "B", "C", "D", "E"] as AnswerOption[]).map((opt) => {
            const optionText =
              currentQuestion?.[`option${opt}` as keyof Question];
            if (!optionText) return null;

            const isSelected = answers[currentQuestion.id] === opt;

            return (
              <button
                key={opt}
                onClick={() => onSelectAnswer(currentQuestion.id, opt)}
                className={`group flex w-full items-start gap-4 rounded-[20px] border-2 p-4 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm shadow-primary/5"
                    : "border-slate-200 bg-white hover:border-primary/40 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-extrabold transition-colors ${
                    isSelected
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 text-slate-500 group-hover:border-primary/40 group-hover:text-primary"
                  }`}
                >
                  {opt}
                </div>
                <p
                  className={`pt-0.5 font-secondary text-[15px] leading-relaxed ${
                    isSelected
                      ? "font-semibold text-slate-900"
                      : "text-slate-700"
                  }`}
                >
                  {optionText}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Navigasi Bawah */}
      <div className="pb-safe fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-slate-200 bg-white/90 p-4 backdrop-blur-lg">
        <div className="flex w-full items-center justify-between px-1">
          <Button
            variant="outline"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => (p as number) - 1)}
            className="h-11 rounded-[16px] border-slate-300 px-5 font-bold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Prev
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={() => setConfirmOpen(true)}
              disabled={isSubmitting}
              className="h-11 rounded-[16px] px-6 font-bold shadow-md shadow-primary/20"
            >
              Selesai <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => (p as number) + 1)}
              className="h-11 rounded-[16px] px-6 font-bold shadow-md shadow-primary/20"
            >
              Next <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Dialog Konfirmasi Submit */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-sm w-[calc(100%-2rem)] rounded-[28px] border border-grey-200 bg-white p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.18)]">
          <DialogHeader className="text-left">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-14px_rgba(0,101,176,0.65)]">
              <CheckCircle2 className="h-7 w-7" strokeWidth={1.8} />
            </div>
            <DialogTitle>Akhiri Ujian?</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menyelesaikan ujian ini? Jawaban tidak
              dapat diubah lagi setelah disubmit.
            </DialogDescription>
          </DialogHeader>

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
              type="button"
              onClick={handleConfirmSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "Memproses..." : "Ya, Akhiri Ujian"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
