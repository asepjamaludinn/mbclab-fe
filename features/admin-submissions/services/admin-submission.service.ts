import { api } from "@/shared/lib/api";
import { AdminSubmissionsResponse } from "../types/admin-submission.type";

export type SubmissionsQueryParams = {
  moduleId?: string;
  groupId?: string;
  nim?: string;
  page?: number;
  limit?: number;
};

export const adminSubmissionService = {
  getSubmissions: async (
    params: SubmissionsQueryParams = {},
  ): Promise<AdminSubmissionsResponse> => {
    const res = await api.get<AdminSubmissionsResponse>("/submissions", {
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
};
