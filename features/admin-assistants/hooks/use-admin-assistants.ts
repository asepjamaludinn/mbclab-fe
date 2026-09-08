"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminAssistantService } from "../services/admin-assistant.service";
import {
  CreateAssistantProfilePayload,
  UpdateAssistantProfilePayload,
} from "../types/admin-assistant.type";

export const useAdminAssistants = () => {
  return useQuery({
    queryKey: ["admin-assistants"],
    queryFn: adminAssistantService.getAssistants,
  });
};

const invalidateAssistants = (qc: ReturnType<typeof useQueryClient>) => {
  qc.invalidateQueries({ queryKey: ["admin-assistants"] });
  qc.invalidateQueries({ queryKey: ["public-assistants"] });
};

export const useCreateAssistant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateAssistantProfilePayload) =>
      adminAssistantService.createAssistant(payload),
    onSuccess: () => invalidateAssistants(qc),
  });
};

export const useUpdateAssistant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateAssistantProfilePayload;
    }) => adminAssistantService.updateAssistant(id, payload),
    onSuccess: () => invalidateAssistants(qc),
  });
};

export const useDeleteAssistant = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminAssistantService.deleteAssistant(id),
    onSuccess: () => invalidateAssistants(qc),
  });
};

export const useUploadAssistantPhoto = () => {
  return useMutation({
    mutationFn: (file: File) => adminAssistantService.uploadPhoto(file),
  });
};

export const useBulkDeleteAssistants = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (ids: string[]) =>
      adminAssistantService.bulkDeleteAssistants(ids),
    onSuccess: () => invalidateAssistants(qc),
  });
};
