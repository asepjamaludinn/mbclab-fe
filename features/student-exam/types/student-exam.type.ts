export type Question = {
  id: string;
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

export type MyExamSession = {
  id: string;
  moduleId: string;
  date: string;
  shift: string;
  startTime: string;
  endTime: string;
  module: {
    title: string;
    order: number;
  };
  attempts?: { status: string }[];
};

export type ReportCheatResponse = {
  message: string;
  disqualified: boolean;
  attempt: {
    id: string;
    cheatCount: number;
    status: ExamAttempt["status"];
    score?: number;
  };
};

export type MyExamAttemptHistory = {
  id: string;
  status: ExamAttempt["status"];
  score: number;
  startedAt: string | null;
  submittedAt: string | null;
  cheatCount: number;
  session: {
    date: string;
    shift: string;
    module: {
      title: string;
      order: number;
    };
  };
};

export type UnblockResponse = {
  message: string;
  attempt: ExamAttempt;
  questions: Question[];
};
