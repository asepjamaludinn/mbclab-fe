import { api } from "@/shared/lib/api";
import { LoginResponse, User, ChangePasswordPayload } from "../types/auth.type";
import { LoginFormData } from "../schemas/auth.schema";

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<User>("/auth/profile");
    return response.data;
  },

  changePassword: async (data: ChangePasswordPayload) => {
    const response = await api.patch("/auth/change-password", data);
    return response.data;
  },
  getSessions: async (): Promise<UserSession[]> => {
    const res = await api.get<UserSession[]>("/auth/sessions");
    return res.data;
  },
  revokeSession: async (id: string) => {
    const res = await api.delete(`/auth/sessions/${id}`);
    return res.data;
  },
  revokeOtherSessions: async () => {
    const res = await api.delete("/auth/sessions");
    return res.data;
  },
};
