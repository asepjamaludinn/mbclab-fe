export type GradeGroup = {
  name: string;
};

export type GradeStudent = {
  nim: string;
  name: string;
  group: GradeGroup | null;
};

export type GradeModule = {
  title: string;
};

export type AdminGrade = {
  id: string;
  studentId: string;
  moduleId: string;
  tpScore: number | null;
  taScore: number | null;
  reportScore: number | null;
  totalScore: number | null;
  createdAt: string;
  updatedAt: string;
  student: GradeStudent;
  module: GradeModule;
};

export type AdminGradesResponse = {
  data: AdminGrade[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type UpdateTpScorePayload = {
  tpScore?: number;
};
