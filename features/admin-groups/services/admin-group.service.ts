import { api } from "@/shared/lib/api";
import {
  AdminGroup,
  AdminGroupDetail,
  AdminGroupsResponse,
  AssignStudentsResult,
  UnassignedStudent,
} from "../types/admin-group.type";

export const adminGroupService = {
  getGroups: async (page = 1, limit = 50): Promise<AdminGroupsResponse> => {
    const res = await api.get<AdminGroupsResponse>("/groups", {
      params: { page, limit },
    });
    return res.data;
  },
  getGroup: async (id: string): Promise<AdminGroupDetail> => {
    const res = await api.get<AdminGroupDetail>(`/groups/${id}`);
    return res.data;
  },
  createGroup: async (name: string): Promise<AdminGroup> => {
    const res = await api.post<AdminGroup>("/groups", { name });
    return res.data;
  },
  updateGroup: async (id: string, name: string): Promise<AdminGroup> => {
    const res = await api.patch<AdminGroup>(`/groups/${id}`, { name });
    return res.data;
  },
  deleteGroup: async (id: string) => {
    const res = await api.delete(`/groups/${id}`);
    return res.data;
  },

  bulkDeleteGroups: async (groupIds: string[]) => {
    const res = await api.post("/groups/bulk-delete", { groupIds });
    return res.data;
  },

  assignStudents: async (
    id: string,
    studentNims: string[],
    force = false,
  ): Promise<AssignStudentsResult> => {
    const res = await api.patch<AssignStudentsResult>(`/groups/${id}/assign`, {
      studentNims,
      force,
    });
    return res.data;
  },
  removeStudent: async (id: string, nim: string) => {
    const res = await api.patch(`/groups/${id}/remove-student/${nim}`);
    return res.data;
  },
  getUnassignedStudents: async (
    search: string,
  ): Promise<UnassignedStudent[]> => {
    const res = await api.get<UnassignedStudent[]>(
      "/groups/students/unassigned",
      { params: { search } },
    );
    return res.data;
  },
  exportCsvUrl: (): string => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    return `${apiUrl}/groups/export/csv`;
  },
};
