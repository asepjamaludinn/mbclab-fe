export interface UserGroup {
  id?: string;
  name: string;
}

export interface User {
  id: string;
  nim: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  division: "COORDINATOR" | "ACADEMIC" | "PRACTICUM" | null;
  mustChangePassword: boolean;
  group?: UserGroup | null;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
