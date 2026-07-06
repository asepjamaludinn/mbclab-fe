import { api } from "@/shared/lib/api";
import {
  AdminExamSession,
  AdminExamSessionsResponse,
  CreateExamSessionPayload,
  UpdateExamSessionPayload,
} from "../types/admin-exam-session.type";

export const adminExamSessionService = {
  getSessions: async (
    page = 1,
    limit = 10,
  ): Promise<AdminExamSessionsResponse> => {
    const res = await api.get<AdminExamSessionsResponse>("/exam-sessions", {
      params: { page, limit },
    });
    return res.data;
  },

  createSession: async (
    payload: CreateExamSessionPayload,
  ): Promise<AdminExamSession> => {
    const res = await api.post<AdminExamSession>("/exam-sessions", payload);
    return res.data;
  },

  updateSession: async (
    id: string,
    payload: UpdateExamSessionPayload,
  ): Promise<AdminExamSession> => {
    const res = await api.patch<AdminExamSession>(
      `/exam-sessions/${id}`,
      payload,
    );
    return res.data;
  },

  deleteSession: async (id: string) => {
    const res = await api.delete(`/exam-sessions/${id}`);
    return res.data;
  },
};
