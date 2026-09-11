import { api } from "@/shared/lib/api";
import { AdminExamReview } from "../types/admin-exam-review.type";

export const adminExamReviewService = {
  getReview: async (
    moduleId: string,
    studentId: string,
  ): Promise<AdminExamReview> => {
    const res = await api.get<AdminExamReview>(
      `/exam-attempts/review/module/${moduleId}/student/${studentId}`,
    );
    return res.data;
  },
};
