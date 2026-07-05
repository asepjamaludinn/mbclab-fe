export interface BlockedAttempt {
  id: string;
  unblockCode: string | null;
  unblockCodeExpiresAt: string | null;
  cheatCount: number;
  blockedAt: string | null;
  student: {
    nim: string;
    name: string;
  };
  session: {
    shift: string;
    module: {
      title: string;
    };
  };
}

export interface ActiveModuleSummary {
  id: string;
  title: string;
  order: number;
  tpDeadline: string | null;
}

export interface WeeklyActivityPoint {
  day: string;
  value: number;
}

export interface DashboardSummary {
  overview: {
    totalStudents: number;
    totalGroups: number;
    todaySessionsCount: number;
    ongoingAttempts: number;
    blockedAttemptsCount: number;
    activeModulesCount: number;
    totalModulesCount: number;
    averageTpScore: number | null;
    averageTaScore: number | null;
    tpSubmittedTodayCount: number;
  };
  activeModule: ActiveModuleSummary | null;
  weeklyActivity: WeeklyActivityPoint[];
  needsAttention: BlockedAttempt[];
}
