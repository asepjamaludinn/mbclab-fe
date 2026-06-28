export type PracticumModule = {
  id: string;
  title: string;
  order: number;
  description: string | null;
  isActive: boolean;
  fileUrl: string | null;
  tpDeadline: string | null;
};

export type PracticumModulesResponse = {
  data: PracticumModule[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};
