import { ArrowLeft, ArrowRight, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Question } from "../types/student-exam.type";
import { AnswerOption } from "../hooks/use-exam-session";

type Props = {
  questions: Question[];
  currentIdx: number;
  answers: Record<string, AnswerOption>;
  timeLeft: string;
  isSubmitting: boolean;
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
  setCurrentIdx,
  onSelectAnswer,
  onManualSubmit,
}: Props) {
  const currentQuestion = questions[currentIdx];
  const isLastQuestion = currentIdx === questions.length - 1;
  const isTimeCritical =
    timeLeft.startsWith("00:") || timeLeft.startsWith("01:"); // Kurang dari 2 menit

  return (
    <main className="min-h-screen bg-slate-50 pb-24 font-primary selection:bg-primary/20">
      {/* Top Navigation & Timer */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-5 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <div
            className={`flex items-center gap-2 rounded-full px-4 py-2 transition-colors ${isTimeCritical ? "bg-error/10 text-error" : "bg-primary/10 text-primary"}`}
          >
            <Clock
              className={`h-4.5 w-4.5 shrink-0 ${isTimeCritical && "animate-pulse"}`}
              strokeWidth={2}
            />
            <span className="font-secondary text-[15px] font-extrabold tabular-nums tracking-wide">
              {timeLeft}
            </span>
          </div>

          <Button
            onClick={onManualSubmit}
            disabled={isSubmitting}
            variant="outline"
            className="border-error/30 text-error hover:bg-error/10 hover:text-error-700 h-9 rounded-full px-4 text-xs font-bold"
          >
            {isSubmitting ? "Menyimpan..." : "Akhiri Ujian"}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto max-w-2xl mt-4 flex gap-1">
          {questions.map((q, i) => {
            const isAnswered = !!answers[q.id];
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === currentIdx
                    ? "bg-primary"
                    : isAnswered
                      ? "bg-primary/40"
                      : "bg-slate-200"
                }`}
              />
            );
          })}
        </div>
      </header>

      {/* Question Content */}
      <section className="mx-auto max-w-2xl px-5 pt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-slate-200/60 px-3 py-1 font-secondary text-xs font-extrabold text-slate-600 uppercase tracking-wider">
          Soal {currentIdx + 1} dari {questions.length}
        </div>

        <h2 className="text-[19px] font-extrabold leading-relaxed text-slate-900 selection:bg-primary/20">
          {currentQuestion?.content}
        </h2>

        {/* Options */}
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
                  className={`font-secondary text-[15px] leading-relaxed pt-0.5 ${
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

      {/* Bottom Navigation Control */}
      <div className="fixed bottom-0 left-0 right-0 border-t border-slate-200 bg-white/90 backdrop-blur-lg p-4 pb-safe">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4">
          <Button
            variant="outline"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="h-12 flex-1 rounded-2xl border-slate-300 font-bold text-slate-700 hover:bg-slate-100"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Prev
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={onManualSubmit}
              disabled={isSubmitting}
              className="h-12 flex-1 rounded-2xl font-bold shadow-primary/25"
            >
              Selesai <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="h-12 flex-1 rounded-2xl font-bold shadow-primary/25"
            >
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
