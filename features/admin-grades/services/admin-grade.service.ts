import { api } from "@/shared/lib/api";
import {
  AdminGrade,
  AdminGradesResponse,
  UpdateTpScorePayload,
} from "../types/admin-grade.type";

export type GradesQueryParams = {
  moduleId?: string;
  groupId?: string;
  nim?: string;
  page?: number;
  limit?: number;
};

export const adminGradeService = {
  getGrades: async (
    params: GradesQueryParams = {},
  ): Promise<AdminGradesResponse> => {
    const res = await api.get<AdminGradesResponse>("/grades", {
      params: {
        moduleId: params.moduleId || undefined,
        groupId: params.groupId || undefined,
        nim: params.nim || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 10,
      },
    });
    return res.data;
  },

  updateTpScore: async (
    moduleId: string,
    studentId: string,
    payload: UpdateTpScorePayload,
  ): Promise<AdminGrade> => {
    const res = await api.patch<AdminGrade>(
      `/grades/${moduleId}/student/${studentId}`,
      payload,
    );
    return res.data;
  },

  exportCsvUrl: (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}/grades/export/csv`;
  },
};
