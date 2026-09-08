"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminExamAttemptService } from "../services/admin-exam-attempt.service";

export const useStuckAttempts = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ["stuck-exam-attempts"],
    queryFn: adminExamAttemptService.getStuckAttempts,
    refetchInterval: 30 * 1000,
    enabled,
  });
};

export const useForceSubmitAttempt = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) =>
      adminExamAttemptService.forceSubmit(attemptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });
      qc.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
    },
  });
};

export const useRegenerateUnblockCode = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (attemptId: string) =>
      adminExamAttemptService.regenerateUnblockCode(attemptId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-dashboard-summary"] });
      qc.invalidateQueries({ queryKey: ["stuck-exam-attempts"] });
    },
  });
};
