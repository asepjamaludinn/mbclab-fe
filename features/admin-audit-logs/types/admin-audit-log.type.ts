export type AuditLogUser = {
  id: string;
  nim: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  division: "COORDINATOR" | "ACADEMIC" | "PRACTICUM" | null;
};

export type AuditLog = {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details: Record<string, unknown> | null;
  createdAt: string;
  user: AuditLogUser;
};

export type AuditLogsResponse = {
  data: AuditLog[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};
