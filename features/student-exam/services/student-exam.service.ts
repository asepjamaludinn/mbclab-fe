import { api } from "@/shared/lib/api";
import {
  JoinExamResponse,
  SaveAnswerPayload,
  TodayExamSession,
  UnblockPayload,
} from "../types/student-exam.type";

export const examService = {
  joinExam: async (payload: {
    sessionId: string;
    accessCode: string;
  }): Promise<JoinExamResponse> => {
    const response = await api.post<JoinExamResponse>(
      "/exam-attempts/join",
      payload,
    );
    return response.data;
  },

  getTodaySessions: async (): Promise<TodayExamSession[]> => {
    const response = await api.get<TodayExamSession[]>(
      "/exam-sessions/today/me",
    );
    return response.data;
  },

  saveAnswer: async ({ sessionId, ...data }: SaveAnswerPayload) => {
    const response = await api.patch(
      `/exam-attempts/${sessionId}/answer`,
      data,
    );
    return response.data;
  },

  submitExam: async (sessionId: string) => {
    const response = await api.post(`/exam-attempts/${sessionId}/submit`);
    return response.data;
  },

  reportCheat: async (sessionId: string) => {
    const response = await api.patch<{ message: string; attempt: any }>(
      `/exam-attempts/${sessionId}/cheat`,
    );
    return response.data;
  },

  unblockAttempt: async ({ sessionId, code }: UnblockPayload) => {
    const response = await api.patch<{ message: string; attempt: any }>(
      `/exam-attempts/${sessionId}/unblock`,
      { code },
    );
    return response.data;
  },
};
