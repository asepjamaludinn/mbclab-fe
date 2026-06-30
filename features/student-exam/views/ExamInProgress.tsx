import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Question } from "../../types/student-exam.type";
import { AnswerOption } from "../../hooks/use-exam-session";

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

  return (
    <main className="min-h-screen bg-grey-50 pb-24 select-none">
      <header className="sticky top-0 z-40 border-b border-grey-200 bg-white px-5 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 rounded-full bg-error/10 px-4 py-2 text-error">
            <Clock className="h-4 w-4 shrink-0" />
            <span className="font-secondary text-sm font-bold tabular-nums">
              {timeLeft}
            </span>
          </div>
          <Button
            onClick={onManualSubmit}
            disabled={isSubmitting}
            variant="outline"
            size="sm"
            className="border-error text-error hover:bg-error/10"
          >
            {isSubmitting ? "Loading..." : "Akhiri Ujian"}
          </Button>
        </div>
        <div className="mt-4 flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full ${i <= currentIdx ? "bg-primary" : "bg-grey-200"}`}
            />
          ))}
        </div>
      </header>

      <section className="px-5 pt-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-primary/10 px-3 py-1 font-secondary text-xs font-bold text-primary">
          Soal {currentIdx + 1} dari {questions.length}
        </div>
        <h2 className="text-lg font-bold leading-relaxed text-grey-900">
          {currentQuestion?.content}
        </h2>

        <div className="mt-6 space-y-3">
          {(["A", "B", "C", "D", "E"] as AnswerOption[]).map((opt) => {
            const optionText =
              currentQuestion?.[`option${opt}` as keyof Question];
            if (!optionText) return null;
            const isSelected = answers[currentQuestion.id] === opt;

            return (
              <button
                key={opt}
                onClick={() => onSelectAnswer(currentQuestion.id, opt)}
                className={`flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-all ${isSelected ? "border-primary bg-primary/5 shadow-sm shadow-primary/10" : "border-grey-200 bg-white hover:border-primary/30"}`}
              >
                <div
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${isSelected ? "border-primary bg-primary text-white" : "border-grey-300 text-grey-500"}`}
                >
                  {opt}
                </div>
                <p
                  className={`font-secondary text-sm leading-relaxed ${isSelected ? "font-semibold text-primary" : "text-grey-700"}`}
                >
                  {optionText}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      <div className="fixed bottom-0 left-0 right-0 border-t border-grey-200 bg-white p-4">
        <div className="mx-auto flex max-w-[480px] items-center justify-between">
          <Button
            variant="outline"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx((p) => p - 1)}
            className="w-[120px]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Prev
          </Button>
          {currentIdx === questions.length - 1 ? (
            <Button
              onClick={onManualSubmit}
              disabled={isSubmitting}
              className="w-[120px]"
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentIdx((p) => p + 1)}
              className="w-[120px]"
            >
              Next <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
