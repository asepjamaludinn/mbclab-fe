import { Shift } from "../types/admin-exam-session.type";

export const SHIFT_OPTIONS: { value: Shift; label: string }[] = [
  { value: "SHIFT_1", label: "Shift 1 (06:30)" },
  { value: "SHIFT_2", label: "Shift 2 (09:30)" },
  { value: "SHIFT_3", label: "Shift 3 (12:30)" },
  { value: "SHIFT_4", label: "Shift 4 (15:30)" },
];

export function getShiftLabel(shift: Shift): string {
  return SHIFT_OPTIONS.find((s) => s.value === shift)?.label ?? shift;
}
