import { api } from "@/shared/lib/api";
import { LoginResponse, User } from "../types/auth.type";
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
};
