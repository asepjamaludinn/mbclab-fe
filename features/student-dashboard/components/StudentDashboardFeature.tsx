"use client";

import { useProfile } from "@/features/auth";
import { useStudentModules } from "@/features/student-modules";
import { useMySubmissions } from "@/features/student-submissions";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardQuickAccess } from "./DashboardQuickAccess";
import { DashboardProgressSummary } from "./DashboardProgressSummary";
import { DashboardModuleProgress } from "./DashboardModuleProgress";
import { DashboardInfo } from "./DashboardInfo";

export function StudentDashboardFeature() {
  const { data: user, isLoading: isUserLoading } = useProfile("STUDENT");
  const { data: modulesRes, isLoading: isModulesLoading } = useStudentModules();
  const { data: submissions = [], isLoading: isSubmissionsLoading } =
    useMySubmissions();

  const isLoading = isUserLoading || isModulesLoading || isSubmissionsLoading;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.16),transparent_34%),linear-gradient(180deg,#f8f9fa_0%,#eef6ff_45%,#f8f9fa_100%)] pb-28">
        <section className="px-5 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-12 animate-pulse rounded-full bg-grey-200" />
              <div className="mt-3 h-6 w-40 animate-pulse rounded-xl bg-grey-200" />
              <div className="mt-2 h-3 w-24 animate-pulse rounded-full bg-grey-200" />
            </div>
            <div className="h-12 w-12 animate-pulse rounded-2xl bg-grey-200" />
          </div>
        </section>

        <section className="mt-6 px-5">
          <div className="h-60 animate-pulse rounded-[36px] bg-primary/20" />
        </section>

        <section className="mt-6 space-y-4 px-5">
          <div className="h-36 animate-pulse rounded-[32px] bg-white" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-28 animate-pulse rounded-[28px] bg-white" />
            <div className="h-28 animate-pulse rounded-[28px] bg-white" />
          </div>
          <div className="h-48 animate-pulse rounded-[32px] bg-white" />
        </section>
      </main>
    );
  }

  const modules = modulesRes?.data || [];

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <DashboardHeader userName={user?.name} nim={user?.nim} />

      <section className="mt-6 space-y-8 px-5">
        <DashboardProgressSummary modules={modules} submissions={submissions} />

        <DashboardQuickAccess />

        <DashboardModuleProgress modules={modules} submissions={submissions} />

        <DashboardInfo />
      </section>
    </main>
  );
}
