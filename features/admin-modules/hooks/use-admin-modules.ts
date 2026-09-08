"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminModuleService } from "../services/admin-module.service";
import {
  CreateModulePayload,
  UpdateModulePayload,
} from "../types/admin-module.type";

export const useAdminModules = (page = 1, limit = 20) => {
  return useQuery({
    queryKey: ["admin-modules", page, limit],
    queryFn: () => adminModuleService.getModules(page, limit),
  });
};

export const useCreateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateModulePayload) =>
      adminModuleService.createModule(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-modules"] }),
  });
};

export const useUpdateModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateModulePayload;
    }) => adminModuleService.updateModule(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-modules"] }),
  });
};

export const useDeleteModule = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminModuleService.deleteModule(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-modules"] }),
  });
};

export const useUploadModuleCover = () => {
  return useMutation({
    mutationFn: (file: File) => adminModuleService.uploadCover(file),
  });
};
