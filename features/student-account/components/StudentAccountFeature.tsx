"use client";

import { useProfile } from "@/features/auth";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { AccountHeader } from "./AccountHeader";
import { AccountActions } from "./AccountActions";
import { GroupWithMembers } from "../types/student-account.type";

export function StudentAccountFeature() {
  const { data: user, isLoading } = useProfile("STUDENT");

  const group = user?.group as GroupWithMembers | undefined;

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
        <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
        <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

        <section className="relative z-10 px-5 pt-8">
          <div className="mx-auto h-28 w-28 animate-pulse rounded-[36px] bg-white/25" />
          <div className="mx-auto mt-5 h-7 w-44 animate-pulse rounded-xl bg-white/25" />
          <div className="mx-auto mt-3 h-4 w-36 animate-pulse rounded-full bg-white/20" />
        </section>

        <section className="relative z-10 mt-8 space-y-4 px-5">
          <div className="h-56 animate-pulse rounded-[34px] bg-white/70 shadow-sm backdrop-blur-xl" />
          <div className="h-24 animate-pulse rounded-[30px] bg-white/70 shadow-sm backdrop-blur-xl" />
        </section>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <div className="relative z-10">
        <AccountHeader
          name={user?.name}
          nim={user?.nim}
          role={user?.role}
          groupName={group?.name}
        />

        <AccountActions
          role={user?.role}
          currentUserNim={user?.nim}
          groupName={group?.name}
          groupMembers={group?.members || []}
        />
      </div>

      <StudentBottomNavigation />
    </main>
  );
}
