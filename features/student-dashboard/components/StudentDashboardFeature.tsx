"use client";

import { useProfile } from "@/features/auth";
import { DashboardHero } from "./DashboardHero";
import { DashboardProfile } from "./DashboardProfile";
import { DashboardMenu } from "./DashboardMenu";
import { DashboardInfo } from "./DashboardInfo";

export function StudentDashboardFeature() {
  const { data: user } = useProfile("STUDENT");

  const groupName = user?.group?.name || "Belum ada kelompok";

  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <DashboardHero userName={user?.name} />

      <section className="relative z-20 -mt-16 px-5 space-y-10">
        <DashboardProfile nim={user?.nim} groupName={groupName} />

        <DashboardMenu />

        <DashboardInfo />
      </section>
    </main>
  );
}
