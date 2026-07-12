export type DayOfWeekValue =
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY"
  | "SUNDAY";

export type WeekTypeValue = "WEEK_1" | "WEEK_2";

export type ShiftValue = "SHIFT_1" | "SHIFT_2" | "SHIFT_3" | "SHIFT_4";

const DAY_LABELS_ID: Record<DayOfWeekValue, string> = {
  MONDAY: "Senin",
  TUESDAY: "Selasa",
  WEDNESDAY: "Rabu",
  THURSDAY: "Kamis",
  FRIDAY: "Jumat",
  SATURDAY: "Sabtu",
  SUNDAY: "Minggu",
};

const WEEK_TYPE_LABELS: Record<WeekTypeValue, string> = {
  WEEK_1: "Minggu 1",
  WEEK_2: "Minggu 2",
};

const SHIFT_TIME_LABELS: Record<ShiftValue, string> = {
  SHIFT_1: "06:30 - 09:30 WIB",
  SHIFT_2: "09:30 - 12:30 WIB",
  SHIFT_3: "12:30 - 15:30 WIB",
  SHIFT_4: "15:30 - 18:30 WIB",
};

export function getDayLabel(day?: DayOfWeekValue | null): string {
  if (!day) return "-";
  return DAY_LABELS_ID[day] ?? day;
}

export function getWeekTypeLabel(weekType?: WeekTypeValue | null): string {
  if (!weekType) return "-";
  return WEEK_TYPE_LABELS[weekType] ?? weekType;
}

export function getShiftTimeRangeLabel(shift?: ShiftValue | null): string {
  if (!shift) return "-";
  return SHIFT_TIME_LABELS[shift] ?? "-";
}

export function getShiftLabel(shift?: ShiftValue | null): string {
  if (!shift) return "-";
  return shift.replace("_", " ");
}

export const DAY_OF_WEEK_OPTIONS: { value: DayOfWeekValue; label: string }[] = [
  { value: "MONDAY", label: "Senin" },
  { value: "TUESDAY", label: "Selasa" },
  { value: "WEDNESDAY", label: "Rabu" },
  { value: "THURSDAY", label: "Kamis" },
  { value: "FRIDAY", label: "Jumat" },
  { value: "SATURDAY", label: "Sabtu" },
  { value: "SUNDAY", label: "Minggu" },
];

export const WEEK_TYPE_OPTIONS: { value: WeekTypeValue; label: string }[] = [
  { value: "WEEK_1", label: "Minggu 1 (Ganjil)" },
  { value: "WEEK_2", label: "Minggu 2 (Genap)" },
];

export const SHIFT_SCHEDULE_OPTIONS: { value: ShiftValue; label: string }[] = [
  { value: "SHIFT_1", label: "Shift 1 (06:30 - 09:30)" },
  { value: "SHIFT_2", label: "Shift 2 (09:30 - 12:30)" },
  { value: "SHIFT_3", label: "Shift 3 (12:30 - 15:30)" },
  { value: "SHIFT_4", label: "Shift 4 (15:30 - 18:30)" },
];
