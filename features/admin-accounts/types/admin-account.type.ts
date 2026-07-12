export type AdminAccount = {
  id: string;
  nim: string;
  name: string;
  role: "ADMIN";
  division: "COORDINATOR" | "ACADEMIC" | "PRACTICUM";
  isDeleted: boolean;
  createdAt: string;
};

export type AdminAccountsResponse = {
  data: AdminAccount[];
  meta: { total: number; page: number; limit: number; totalPages: number };
};

export type CreateAdminPayload = {
  nim: string;
  name: string;
  role: "ADMIN";
  division: "COORDINATOR" | "ACADEMIC" | "PRACTICUM";
};
