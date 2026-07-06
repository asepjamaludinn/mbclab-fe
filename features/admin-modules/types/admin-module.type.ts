export type AdminModule = {
  id: string;
  title: string;
  order: number;
  description: string | null;
  isActive: boolean;
  tpDeadline: string | null;
  fileUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type AdminModulesResponse = {
  data: AdminModule[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type CreateModulePayload = {
  title: string;
  order: number;
  description?: string;
  isActive?: boolean;
  tpDeadline?: string;
  fileUrl?: string;
};

export type UpdateModulePayload = Partial<CreateModulePayload>;
