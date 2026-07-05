"use client";

import { useQuery } from "@tanstack/react-query";
import {
  adminAuditLogService,
  AuditLogsQueryParams,
} from "../services/admin-audit-log.service";

export const useAdminAuditLogs = (params: AuditLogsQueryParams) => {
  return useQuery({
    queryKey: ["admin-audit-logs", params],
    queryFn: () => adminAuditLogService.getAuditLogs(params),
  });
};
