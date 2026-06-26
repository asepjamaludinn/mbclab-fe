"use client";

import { ReactNode } from "react";

import { StudentBottomNavigation } from "@/features/student-navigation";

export default function StudentLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-grey-200">
      <main className="pb-28">{children}</main>
      <StudentBottomNavigation />
    </div>
  );
}
