import { api } from "@/shared/lib/api";
import {
  AdminQuestion,
  AdminQuestionsResponse,
  CreateQuestionPayload,
  QuestionType,
  UpdateQuestionPayload,
} from "../types/admin-question.type";

export type QuestionsQueryParams = {
  page?: number;
  limit?: number;
  moduleId?: string;
  type?: QuestionType;
};

export const adminQuestionService = {
  getQuestions: async (
    params: QuestionsQueryParams,
  ): Promise<AdminQuestionsResponse> => {
    const res = await api.get<AdminQuestionsResponse>("/questions", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        moduleId: params.moduleId || undefined,
        type: params.type || undefined,
      },
    });
    return res.data;
  },

  createQuestion: async (
    payload: CreateQuestionPayload,
  ): Promise<AdminQuestion> => {
    const res = await api.post<AdminQuestion>("/questions", payload);
    return res.data;
  },

  updateQuestion: async (
    id: string,
    payload: UpdateQuestionPayload,
  ): Promise<AdminQuestion> => {
    const res = await api.patch<AdminQuestion>(`/questions/${id}`, payload);
    return res.data;
  },

  deleteQuestion: async (id: string) => {
    const res = await api.delete(`/questions/${id}`);
    return res.data;
  },
};
