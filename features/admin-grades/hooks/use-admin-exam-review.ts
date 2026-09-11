"use client";

import { useQuery } from "@tanstack/react-query";
import { adminExamReviewService } from "../services/admin-exam-review.service";

export const useAdminExamReview = (
  moduleId: string | null,
  studentId: string | null,
) => {
  return useQuery({
    queryKey: ["admin-exam-review", moduleId, studentId],
    queryFn: () => adminExamReviewService.getReview(moduleId!, studentId!),
    enabled: !!moduleId && !!studentId,
    retry: false,
  });
};
