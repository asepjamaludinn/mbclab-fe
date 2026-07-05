"use client";

import { Suspense } from "react";
import { useProfile } from "@/features/auth";
import { useAdminDashboardSummary } from "../hooks/use-admin-dashboard";
import { Users, Layers, CalendarDays, Activity } from "lucide-react";
import { DashboardHeader } from "./DashboardHeader";
import { StatCard } from "./StatCard";
import { NeedsAttentionTable } from "./NeedsAttentionTable";
import { ActivityChart } from "./ActivityChart";
import { BlockedAlertCard } from "./BlockedAlertCard";
import { LiveClockCard } from "./LiveClockCard";
import { ModuleInsightCard } from "./ModuleInsightCard";
import { ForcePasswordChangeDialog } from "./ForcePasswordChangeDialog";
import { StuckAttemptsCard } from "@/features/admin-exam-attempts";

export function AdminDashboardFeature() {
  const { data: user, isLoading: isUserLoading } = useProfile("ADMIN");
  const {
    data: summary,
    isLoading: isSummaryLoading,
    refetch,
    isRefetching,
  } = useAdminDashboardSummary();

  const isLoading = isUserLoading || isSummaryLoading;

  if (isLoading) {
    return (
      <div className="w-full h-screen animate-pulse bg-grey-100 rounded-3xl" />
    );
  }

  const { overview, needsAttention, activeModule, weeklyActivity } =
    summary || {
      overview: {
        totalStudents: 0,
        totalGroups: 0,
        todaySessionsCount: 0,
        ongoingAttempts: 0,
        blockedAttemptsCount: 0,
        activeModulesCount: 0,
        totalModulesCount: 0,
        averageTpScore: null,
        averageTaScore: null,
        tpSubmittedTodayCount: 0,
      },
      activeModule: null,
      weeklyActivity: [],
      needsAttention: [],
    };

  return (
    <div className="flex w-full flex-col gap-6 font-primary">
      <Suspense fallback={null}>
        <ForcePasswordChangeDialog />
      </Suspense>

      <DashboardHeader
        userName={user?.name || "Asisten"}
        isRefetching={isRefetching}
        onRefresh={() => refetch()}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Praktikan"
          value={overview.totalStudents}
          trendText="Terdaftar"
          trendIcon={Users}
          variant="primary"
        />
        <StatCard
          title="Total Kelompok"
          value={overview.totalGroups}
          trendText="Kelompok aktif"
          trendIcon={Layers}
        />
        <StatCard
          title="Sesi Hari Ini"
          value={overview.todaySessionsCount}
          trendText="Jadwal hari ini"
          trendIcon={CalendarDays}
          trendColor={overview.todaySessionsCount > 0 ? "success" : "default"}
        />
        <StatCard
          title="Sedang Ujian"
          value={overview.ongoingAttempts}
          trendText="Mengerjakan TA"
          trendIcon={Activity}
          trendColor={overview.ongoingAttempts > 0 ? "warning" : "default"}
        />
        <LiveClockCard />
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActivityChart data={weeklyActivity} />
        </div>
        <div className="lg:col-span-1">
          <ModuleInsightCard
            activeModule={activeModule}
            totalModulesCount={overview.totalModulesCount}
            activeModulesCount={overview.activeModulesCount}
            averageTpScore={overview.averageTpScore}
            averageTaScore={overview.averageTaScore}
            tpSubmittedTodayCount={overview.tpSubmittedTodayCount}
          />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <BlockedAlertCard count={overview.blockedAttemptsCount} />
        </div>
        <div className="lg:col-span-2">
          <NeedsAttentionTable data={needsAttention} />
        </div>
      </div>

      <StuckAttemptsCard />
    </div>
  );
}
