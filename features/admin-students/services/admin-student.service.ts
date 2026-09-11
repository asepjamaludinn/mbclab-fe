import { api } from "@/shared/lib/api";
import {
  AdminStudent,
  AdminStudentsResponse,
  BulkStudentActionResult,
  CreateStudentPayload,
  StudentStatusFilter,
  UpdateStudentPayload,
} from "../types/admin-student.type";

export type StudentsQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  groupId?: string;
  status?: StudentStatusFilter;
};

export const adminStudentService = {
  getStudents: async (
    params: StudentsQueryParams,
  ): Promise<AdminStudentsResponse> => {
    const res = await api.get<AdminStudentsResponse>("/users", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 10,
        search: params.search || undefined,
        groupId: params.groupId || undefined,
        status: params.status ?? "active",
      },
    });
    return res.data;
  },

  createStudent: async (
    payload: CreateStudentPayload,
  ): Promise<AdminStudent> => {
    const res = await api.post<AdminStudent>("/users", {
      ...payload,
      role: "STUDENT",
    });
    return res.data;
  },

  updateStudent: async (
    id: string,
    payload: UpdateStudentPayload,
  ): Promise<AdminStudent> => {
    const res = await api.patch<AdminStudent>(`/users/${id}`, payload);
    return res.data;
  },

  resetPassword: async (nim: string) => {
    const res = await api.patch(`/users/${nim}/reset-password`);
    return res.data;
  },

  deactivateStudent: async (id: string) => {
    const res = await api.patch(`/users/${id}/deactivate`);
    return res.data;
  },

  reactivateStudent: async (id: string) => {
    const res = await api.patch(`/users/${id}/reactivate`);
    return res.data;
  },

  deleteStudent: async (id: string) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  bulkDeactivateStudents: async (
    studentIds: string[],
  ): Promise<BulkStudentActionResult> => {
    const res = await api.post<BulkStudentActionResult>(
      "/users/bulk-deactivate",
      { studentIds },
    );
    return res.data;
  },

  bulkReactivateStudents: async (
    studentIds: string[],
  ): Promise<BulkStudentActionResult> => {
    const res = await api.post<BulkStudentActionResult>(
      "/users/bulk-reactivate",
      { studentIds },
    );
    return res.data;
  },

  bulkDeleteStudents: async (
    studentIds: string[],
  ): Promise<BulkStudentActionResult> => {
    const res = await api.post<BulkStudentActionResult>("/users/bulk-delete", {
      studentIds,
    });
    return res.data;
  },
};
