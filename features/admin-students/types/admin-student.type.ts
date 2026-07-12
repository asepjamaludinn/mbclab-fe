export type StudentGroup = {
  id: string;
  name: string;
};

export type AdminStudent = {
  id: string;
  nim: string;
  name: string;
  isDeleted: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  group: StudentGroup | null;
  isInternational: boolean;
  _count?: {
    examAttempts: number;
    submissions: number;
    grades: number;
  };
};

export type AdminStudentsResponse = {
  data: AdminStudent[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type CreateStudentPayload = {
  nim: string;
  name: string;
};

export type UpdateStudentPayload = {
  name?: string;
  groupId?: string | null;
};

export type FailedStudentAction = {
  id: string;
  name: string;
  nim: string;
  reason: string;
};

export type BulkStudentActionResult = {
  message: string;
  processedCount: number;
  failedCount: number;
  failedStudents: FailedStudentAction[];
};

export type StudentStatusFilter = "active" | "inactive" | "all";
