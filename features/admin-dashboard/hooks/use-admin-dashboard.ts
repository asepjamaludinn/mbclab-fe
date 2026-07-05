"use client";

import { useQuery } from "@tanstack/react-query";
import { adminDashboardService } from "../services/admin-dashboard.service";

export const useAdminDashboardSummary = () => {
  return useQuery({
    queryKey: ["admin-dashboard-summary"],
    queryFn: adminDashboardService.getSummary,
    refetchInterval: 10 * 1000,
    refetchIntervalInBackground: false,
  });
};
