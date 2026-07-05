export type Shift = "SHIFT_1" | "SHIFT_2" | "SHIFT_3" | "SHIFT_4";

export type AdminExamSession = {
  id: string;
  moduleId: string;
  groupId: string;
  date: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
  module?: { title: string; order: number };
  group?: { name: string };
  _count?: { attempts: number };
};

export type AdminExamSessionsResponse = {
  data: AdminExamSession[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type CreateExamSessionPayload = {
  moduleId: string;
  groupId: string;
  date: string;
  shift: Shift;
  startTime: string;
  endTime: string;
  accessCode: string;
};

export type UpdateExamSessionPayload = Partial<CreateExamSessionPayload>;
