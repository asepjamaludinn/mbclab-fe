export type QuestionType = "TP" | "TA";
export type AnswerOption = "A" | "B" | "C" | "D" | "E";

export type AdminQuestion = {
  id: string;
  moduleId: string;
  type: QuestionType;
  content: string;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  optionE: string | null;
  correctAnswer: AnswerOption | null;
  createdAt: string;
  updatedAt: string;
  module?: {
    title: string;
    order: number;
  };
};

export type AdminQuestionsResponse = {
  data: AdminQuestion[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateQuestionPayload = {
  moduleId: string;
  type: QuestionType;
  content: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  correctAnswer?: AnswerOption;
};

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;
