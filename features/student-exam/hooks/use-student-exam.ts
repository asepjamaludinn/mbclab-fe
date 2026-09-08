"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { examService } from "../services/student-exam.service";

export const useJoinExam = () => {
  return useMutation({ mutationFn: examService.joinExam });
};

export const useSaveAnswer = () => {
  return useMutation({ mutationFn: examService.saveAnswer });
};

export const useSubmitExam = () => {
  return useMutation({ mutationFn: examService.submitExam });
};

export const useReportCheat = () => {
  return useMutation({ mutationFn: examService.reportCheat });
};

export const useUnblockAttempt = () => {
  return useMutation({ mutationFn: examService.unblockAttempt });
};

export const useMyExamSessions = () => {
  return useQuery({
    queryKey: ["my-exam-sessions"],
    queryFn: examService.getMySessions,
  });
};

export const useMyExamAttempts = () => {
  return useQuery({
    queryKey: ["my-exam-attempts"],
    queryFn: examService.getMyAttempts,
  });
};

export const useSyncAnswers = () => {
  return useMutation({
    mutationFn: (payload: {
      sessionId: string;
      answers: { questionId: string; selectedOption: string }[];
    }) =>
      api.patch(`/exam-attempts/${payload.sessionId}/sync-answers`, {
        answers: payload.answers,
      }),
  });
};
