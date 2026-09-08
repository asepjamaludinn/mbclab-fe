export type QuestionType = "TP" | "TA";
export type AnswerOption = "A" | "B" | "C" | "D" | "E";
export type TpVariant = "ALL" | "EVEN" | "ODD";

export type AdminQuestion = {
  id: string;
  moduleId: string;
  type: QuestionType;
  content: string;
  contentEn: string | null;
  optionA: string | null;
  optionB: string | null;
  optionC: string | null;
  optionD: string | null;
  optionE: string | null;
  optionAEn: string | null;
  optionBEn: string | null;
  optionCEn: string | null;
  optionDEn: string | null;
  optionEEn: string | null;
  correctAnswer: AnswerOption | null;
  createdAt: string;
  updatedAt: string;
  tpVariant: TpVariant;
  module?: {
    title: string;
    order: number;
  };
};

export type CreateQuestionPayload = {
  moduleId: string;
  type: QuestionType;
  tpVariant?: TpVariant;
  content: string;
  contentEn?: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  optionE?: string;
  optionAEn?: string;
  optionBEn?: string;
  optionCEn?: string;
  optionDEn?: string;
  optionEEn?: string;
  correctAnswer?: AnswerOption;
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

export type BulkImportQuestionsResult = {
  message: string;
  importedCount: number;
  failedCount: number;
  failedRows: { row: number; reason: string }[];
};

export type UpdateQuestionPayload = Partial<CreateQuestionPayload>;
