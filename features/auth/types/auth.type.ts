import type {
  DayOfWeekValue,
  WeekTypeValue,
  ShiftValue,
} from "@/shared/utils/schedule";

export interface UserGroup {
  id?: string;
  name: string;
  day?: DayOfWeekValue | null;
  weekType?: WeekTypeValue | null;
  shift?: ShiftValue | null;
  nextScheduleAt?: string | null;
}

export interface User {
  id: string;
  nim: string;
  name: string;
  role: "STUDENT" | "ADMIN";
  division: "COORDINATOR" | "ACADEMIC" | "PRACTICUM" | null;
  mustChangePassword: boolean;
  isInternational: boolean;
  group?: UserGroup | null;
}

export interface LoginResponse {
  user: User;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export type UserSession = {
  id: string;
  userAgent: string | null;
  ipAddress: string | null;
  createdAt: string;
  lastUsedAt: string;
  expiresAt: string;
  isCurrent: boolean;
};
