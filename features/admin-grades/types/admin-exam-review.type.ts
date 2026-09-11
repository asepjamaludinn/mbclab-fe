export type AdminExamReviewQuestion = {
  order: number;
  questionId: string;
  content: string;
  contentEn: string | null;
  optionA: string | null;
  optionAEn: string | null;
  optionB: string | null;
  optionBEn: string | null;
  optionC: string | null;
  optionCEn: string | null;
  optionD: string | null;
  optionDEn: string | null;
  optionE: string | null;
  optionEEn: string | null;
  correctAnswer: "A" | "B" | "C" | "D" | "E" | null;
  selectedOption: "A" | "B" | "C" | "D" | "E" | null;
  isCorrect: boolean;
  isAnswered: boolean;
};

export type AdminExamReview = {
  attempt: {
    id: string;
    status: string;
    score: number | null;
    cheatCount: number;
    startedAt: string | null;
    submittedAt: string | null;
    blockedAt: string | null;
  };
  student: { id: string; nim: string; name: string };
  module: { id: string; title: string; order: number };
  summary: {
    totalQuestions: number;
    correctCount: number;
    wrongCount: number;
  };
  questions: AdminExamReviewQuestion[];
};
