import { api } from "@/shared/lib/api";
import {
  JoinExamResponse,
  MyExamSession,
  ReportCheatResponse,
  SaveAnswerPayload,
  UnblockPayload,
  MyExamAttemptHistory,
  UnblockResponse,
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

  getMySessions: async (): Promise<MyExamSession[]> => {
    const response = await api.get<MyExamSession[]>("/exam-sessions/me");
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

  reportCheat: async (sessionId: string): Promise<ReportCheatResponse> => {
    const response = await api.patch<ReportCheatResponse>(
      `/exam-attempts/${sessionId}/cheat`,
    );
    return response.data;
  },

  reportCheatKeepAlive: (sessionId: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl || typeof window === "undefined") return;

    fetch(`${apiUrl}/exam-attempts/${sessionId}/cheat`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      keepalive: true,
      credentials: "include",
    }).catch(() => {});
  },

  getMyAttempts: async (): Promise<MyExamAttemptHistory[]> => {
    const response = await api.get<MyExamAttemptHistory[]>("/exam-attempts/me");
    return response.data;
  },

  unblockAttempt: async ({ sessionId, code }: UnblockPayload) => {
    const response = await api.patch<UnblockResponse>(
      `/exam-attempts/${sessionId}/unblock`,
      { code },
    );
    return response.data;
  },

  syncAnswers: async ({
    sessionId,
    answers,
  }: {
    sessionId: string;
    answers: { questionId: string; selectedOption: string }[];
  }) => {
    const response = await api.patch(
      `/exam-attempts/${sessionId}/sync-answers`,
      { answers },
    );
    return response.data;
  },
};
