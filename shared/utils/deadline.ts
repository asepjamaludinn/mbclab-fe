export function isDeadlinePassed(deadline: string | null | undefined): boolean {
  if (!deadline) return false;
  return new Date() > new Date(deadline);
}

export function isDeadlineStrictlyPassed(
  deadline: string | null | undefined,
  graceMinutes = 15,
): boolean {
  if (!deadline) return false;
  const deadlineTime = new Date(deadline).getTime();
  const graceTime = deadlineTime + graceMinutes * 60 * 1000;
  return Date.now() > graceTime;
}

export function isInGracePeriod(
  deadline: string | null | undefined,
  graceMinutes = 15,
): boolean {
  if (!deadline) return false;
  const now = Date.now();
  const deadlineTime = new Date(deadline).getTime();
  const graceTime = deadlineTime + graceMinutes * 60 * 1000;
  return now > deadlineTime && now <= graceTime;
}

export function getDeadlineCountdownLabel(deadline: string): string {
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "Sudah lewat";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);

  if (days >= 1) return `${days} hari lagi`;
  if (hours >= 1) return `${hours} jam lagi`;

  const minutes = Math.floor(diffMs / (1000 * 60));
  return `${Math.max(minutes, 1)} menit lagi`;
}

export function formatDeadline(deadline: string): string {
  return new Date(deadline).toLocaleString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function isDeadlineNear(deadline: string, thresholdHours = 24): boolean {
  const diffMs = new Date(deadline).getTime() - Date.now();
  return diffMs > 0 && diffMs <= thresholdHours * 60 * 60 * 1000;
}
