import type {
  DayOfWeekValue,
  WeekTypeValue,
  ShiftValue,
} from "@/shared/utils/schedule";

export type GroupMember = {
  id?: string;
  name?: string;
  nim?: string;
};

export type GroupWithMembers = {
  name?: string;
  members?: GroupMember[];
  day?: DayOfWeekValue | null;
  weekType?: WeekTypeValue | null;
  shift?: ShiftValue | null;
  nextScheduleAt?: string | null;
};
