import { api } from "@/shared/lib/api";
import {
  AdminModule,
  AdminModulesResponse,
  CreateModulePayload,
  UpdateModulePayload,
} from "../types/admin-module.type";

export const adminModuleService = {
  getModules: async (page = 1, limit = 20): Promise<AdminModulesResponse> => {
    const res = await api.get<AdminModulesResponse>("/practicum-modules", {
      params: { page, limit },
    });
    return res.data;
  },
  createModule: async (payload: CreateModulePayload): Promise<AdminModule> => {
    const res = await api.post<AdminModule>("/practicum-modules", payload);
    return res.data;
  },
  updateModule: async (
    id: string,
    payload: UpdateModulePayload,
  ): Promise<AdminModule> => {
    const res = await api.patch<AdminModule>(
      `/practicum-modules/${id}`,
      payload,
    );
    return res.data;
  },
  deleteModule: async (id: string) => {
    const res = await api.delete(`/practicum-modules/${id}`);
    return res.data;
  },
  uploadCover: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ message: string; fileUrl: string }>(
      "/upload/module-cover",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data.fileUrl;
  },
};
