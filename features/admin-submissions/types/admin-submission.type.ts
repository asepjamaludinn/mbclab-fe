export type SubmissionGroup = {
  name: string;
};

export type SubmissionStudent = {
  nim: string;
  name: string;
  group: SubmissionGroup | null;
};

export type SubmissionModule = {
  title: string;
};

export type AdminSubmission = {
  id: string;
  studentId: string;
  moduleId: string;
  fileUrl: string;
  isLate: boolean;
  createdAt: string;
  updatedAt: string;
  student: SubmissionStudent;
  module: SubmissionModule;
};

export type AdminSubmissionsResponse = {
  data: AdminSubmission[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
