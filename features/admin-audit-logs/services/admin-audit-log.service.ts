import { api } from "@/shared/lib/api";
import { AuditLogsResponse } from "../types/admin-audit-log.type";

export type AuditLogsQueryParams = {
  action?: string;
  page?: number;
  limit?: number;
};

export const adminAuditLogService = {
  getAuditLogs: async (
    params: AuditLogsQueryParams,
  ): Promise<AuditLogsResponse> => {
    const res = await api.get<AuditLogsResponse>("/audit-logs", {
      params: {
        action: params.action || undefined,
        page: params.page ?? 1,
        limit: params.limit ?? 15,
      },
    });
    return res.data;
  },
};
