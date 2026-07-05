import { api } from "@/shared/lib/api";
import {
  AdminAssistantProfile,
  CreateAssistantProfilePayload,
  UpdateAssistantProfilePayload,
} from "../types/admin-assistant.type";

export const adminAssistantService = {
  getAssistants: async (): Promise<AdminAssistantProfile[]> => {
    const res = await api.get<AdminAssistantProfile[]>("/assistant-profiles");
    return res.data;
  },
  createAssistant: async (
    payload: CreateAssistantProfilePayload,
  ): Promise<AdminAssistantProfile> => {
    const res = await api.post<AdminAssistantProfile>(
      "/assistant-profiles",
      payload,
    );
    return res.data;
  },
  updateAssistant: async (
    id: string,
    payload: UpdateAssistantProfilePayload,
  ): Promise<AdminAssistantProfile> => {
    const res = await api.patch<AdminAssistantProfile>(
      `/assistant-profiles/${id}`,
      payload,
    );
    return res.data;
  },
  deleteAssistant: async (id: string) => {
    const res = await api.delete(`/assistant-profiles/${id}`);
    return res.data;
  },
  uploadPhoto: async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post<{ message: string; fileUrl: string }>(
      "/upload/assistant-photo",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );

    return response.data.fileUrl;
  },
};
