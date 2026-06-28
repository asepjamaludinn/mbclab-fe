export type Question = {
  id: string;
  content: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  optionE: string | null;
};

export type ExamAttempt = {
  id: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "SUBMITTED";
  startedAt: string;
  submittedAt: string | null;
  expiredAt: string;
  cheatCount: number;
};

export type JoinExamResponse = {
  message: string;
  attempt: ExamAttempt;
  questions: Question[];
};

export type SaveAnswerPayload = {
  sessionId: string;
  questionId: string;
  selectedOption: "A" | "B" | "C" | "D" | "E";
};

export type UnblockPayload = {
  sessionId: string;
  code: string;
};

export type TodayExamSession = {
  id: string;
  moduleId: string;
  startTime: string;
  endTime: string;
  module: {
    title: string;
    order: number;
  };
};
