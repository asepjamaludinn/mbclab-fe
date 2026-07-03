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
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
        <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
        <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

        <section className="relative z-10 px-5 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-20 animate-pulse rounded-full bg-white/25" />
              <div className="mt-3 h-8 w-44 animate-pulse rounded-2xl bg-white/25" />
              <div className="mt-2 h-3 w-28 animate-pulse rounded-full bg-white/20" />
            </div>

            <div className="h-12 w-12 animate-pulse rounded-full bg-white/25" />
          </div>
        </section>

        <section className="relative z-10 mt-8 space-y-4 px-5">
          <div className="h-44 animate-pulse rounded-[34px] bg-white/70 shadow-sm backdrop-blur-xl" />
          <div className="grid grid-cols-2 gap-3">
            <div className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-sm backdrop-blur-xl" />
            <div className="h-32 animate-pulse rounded-[28px] bg-white/70 shadow-sm backdrop-blur-xl" />
          </div>
          <div className="h-52 animate-pulse rounded-[34px] bg-white/70 shadow-sm backdrop-blur-xl" />
        </section>
      </main>
    );
  }

  const modules = modulesRes?.data || [];

  const activeModule =
    modules.find((module) => module.isActive) || modules[0] || null;

  const isTpSubmitted = activeModule
    ? submissions.some((sub) => sub.moduleId === activeModule.id)
    : false;

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <div className="relative z-10">
        <DashboardHeader userName={user?.name} nim={user?.nim} />

        <section className="mt-8 space-y-7 px-5">
          <DashboardProgressSummary
            modules={modules}
            submissions={submissions}
            userName={user?.name}
          />

          <DashboardQuickAccess />

          <DashboardModuleProgress
            activeModule={activeModule}
            isTpSubmitted={isTpSubmitted}
          />

          <DashboardInfo />
        </section>
      </div>
    </main>
  );
}
