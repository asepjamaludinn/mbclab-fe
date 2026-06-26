import { api } from "@/shared/lib/api";
import {
  PublicAssistant,
  PublicAssistantApiResponse,
  PublicModule,
  PublicModuleApiResponse,
} from "../types/public-home.type";

export const publicHomeService = {
  getAssistants: async (): Promise<PublicAssistant[]> => {
    const response = await api.get<PublicAssistantApiResponse[]>(
      "/assistant-profiles/public",
    );

    return response.data.map((assistant) => ({
      id: assistant.id,
      name: assistant.name,
      role: assistant.position,
      photoUrl: assistant.photoUrl || undefined,
    }));
  },

  getModules: async (): Promise<PublicModule[]> => {
    const response = await api.get<PublicModuleApiResponse[]>(
      "/practicum-modules/public",
    );

    return response.data.map((module) => ({
      id: module.id,
      title: module.title,
      description: module.description || "Deskripsi modul belum tersedia.",
      isActive: module.isActive,
      fileUrl: module.fileUrl || "#",
    }));
  },
};
