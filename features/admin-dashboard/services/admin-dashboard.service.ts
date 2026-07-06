import { api } from "@/shared/lib/api";
import { DashboardSummary } from "../types/admin-dashboard.type";

export const adminDashboardService = {
  getSummary: async (): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummary>("/dashboard/summary");
    return response.data;
  },
};
