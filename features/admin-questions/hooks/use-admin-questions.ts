"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminQuestionService,
  QuestionsQueryParams,
} from "../services/admin-question.service";
import {
  CreateQuestionPayload,
  UpdateQuestionPayload,
} from "../types/admin-question.type";

export const useAdminQuestions = (params: QuestionsQueryParams) => {
  return useQuery({
    queryKey: ["admin-questions", params],
    queryFn: () => adminQuestionService.getQuestions(params),
  });
};

export const useCreateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateQuestionPayload) =>
      adminQuestionService.createQuestion(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-questions"] }),
  });
};

export const useUpdateQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateQuestionPayload;
    }) => adminQuestionService.updateQuestion(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-questions"] }),
  });
};

export const useDeleteQuestion = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminQuestionService.deleteQuestion(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-questions"] }),
  });
};

export const useBulkImportQuestions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ moduleId, file }: { moduleId: string; file: File }) =>
      adminQuestionService.bulkImportCsv(moduleId, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-questions"] }),
  });
};

export const useBulkDeleteQuestions = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      adminQuestionService.bulkDeleteQuestions(ids),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-questions"] }),
  });
};
