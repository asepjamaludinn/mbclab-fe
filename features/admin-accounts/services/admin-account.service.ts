import { api } from "@/shared/lib/api";
import {
  AdminAccountsResponse,
  CreateAdminPayload,
} from "../types/admin-account.type";

export const adminAccountService = {
  getAdmins: async (
    page = 1,
    limit = 10,
    search?: string,
    division?: string,
  ): Promise<AdminAccountsResponse> => {
    const res = await api.get<AdminAccountsResponse>("/users/admins", {
      params: { page, limit, search, division },
    });
    return res.data;
  },
  createAdmin: async (payload: CreateAdminPayload) => {
    const res = await api.post("/users", payload);
    return res.data;
  },
  deleteAdmin: async (id: string) => {
    const res = await api.delete(`/users/admins/${id}`);
    return res.data;
  },
};
