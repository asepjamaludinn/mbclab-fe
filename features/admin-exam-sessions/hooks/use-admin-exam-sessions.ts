"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminExamSessionService } from "../services/admin-exam-session.service";
import {
  CreateExamSessionPayload,
  UpdateExamSessionPayload,
} from "../types/admin-exam-session.type";

export const useAdminExamSessions = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["admin-exam-sessions", page, limit],
    queryFn: () => adminExamSessionService.getSessions(page, limit),
  });
};

export const useCreateExamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateExamSessionPayload) =>
      adminExamSessionService.createSession(payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-exam-sessions"] }),
  });
};

export const useUpdateExamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateExamSessionPayload;
    }) => adminExamSessionService.updateSession(id, payload),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-exam-sessions"] }),
  });
};

export const useDeleteExamSession = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminExamSessionService.deleteSession(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["admin-exam-sessions"] }),
  });
};
