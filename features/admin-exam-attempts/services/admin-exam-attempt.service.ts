import { api } from "@/shared/lib/api";
import { StuckAttempt } from "../types/admin-exam-attempt.type";

export const adminExamAttemptService = {
  getStuckAttempts: async (): Promise<StuckAttempt[]> => {
    const res = await api.get<StuckAttempt[]>("/exam-attempts/stuck");
    return res.data;
  },
  forceSubmit: async (attemptId: string) => {
    const res = await api.patch(`/exam-attempts/${attemptId}/force-submit`);
    return res.data;
  },
};
