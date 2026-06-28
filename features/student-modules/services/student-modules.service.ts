import { api } from "@/shared/lib/api";
import { PracticumModulesResponse } from "../types/student-modules.type";

export const studentModulesService = {
  getModules: async (
    page = 1,
    limit = 50,
  ): Promise<PracticumModulesResponse> => {
    const response = await api.get<PracticumModulesResponse>(
      `/practicum-modules`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },
};
