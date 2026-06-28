export type Submission = {
  id: string;
  studentId: string;
  moduleId: string;
  fileUrl: string;
  isLate: boolean;
  createdAt: string;
  updatedAt: string;
  module: {
    title: string;
    order: number;
    tpDeadline: string | null;
  };
};

export type SubmitTpPayload = {
  moduleId: string;
  fileUrl: string;
};
