export type TpQuestion = {
  id: string;
  content: string;
  contentEn: string | null;
};

export type PracticumModule = {
  id: string;
  title: string;
  order: number;
  description: string | null;
  isActive: boolean;
  fileUrlRegular: string | null;
  fileUrlInternational: string | null;
  tpDeadline: string | null;
};

export type PracticumModuleDetail = PracticumModule & {
  questions: TpQuestion[];
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
