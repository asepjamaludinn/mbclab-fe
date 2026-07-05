export type GroupStudent = {
  id: string;
  nim: string;
  name: string;
  groupId: string | null;
};

export type AdminGroup = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  _count?: { students: number };
};

export type AdminGroupDetail = AdminGroup & {
  students: GroupStudent[];
};

export type AdminGroupsResponse = {
  data: AdminGroup[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type AssignStudentsConflict = {
  nim: string;
  name: string;
  currentGroupName: string;
};

export type AssignStudentsResult = {
  message: string;
  assignedCount: number;
  failedCount: number;
  failedNims: string[] | null;
  requiresConfirmation?: boolean;
  conflicts?: AssignStudentsConflict[] | null;
};

export type UnassignedStudent = {
  id: string;
  nim: string;
  name: string;
};
