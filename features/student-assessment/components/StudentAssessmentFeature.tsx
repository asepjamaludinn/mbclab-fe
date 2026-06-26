"use client";

import { ClipboardCheck, FileUp, PenTool, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useProfile } from "@/features/auth";
import { PublicBottomNavigation } from "@/features/public-home";

export function StudentAssessmentFeature() {
  const { data: user, isLoading } = useProfile("STUDENT");

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-grey-200">
        <span className="font-secondary text-sm text-primary animate-pulse">
          Memuat Assessment...
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-grey-200 pb-28">
      <section className="relative overflow-hidden rounded-b-[40px] bg-primary px-4 pb-12 pt-5 text-white shadow-sm">
        <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-secondary/40 blur-3xl" />

        <div className="relative z-10 mt-6">
          <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white p-2 shadow-lg">
            <ClipboardCheck className="h-8 w-8 text-primary" strokeWidth={2} />
          </div>
          <h1 className="mt-2 max-w-sm text-3xl font-bold leading-[1.05] tracking-tight text-white">
            Assessment
          </h1>
          <p className="mt-4 max-w-sm font-secondary text-sm leading-relaxed text-white/75">
            Halo <strong className="text-white">{user?.name}</strong>, pilih
            jenis evaluasi yang ingin Anda kerjakan hari ini.
          </p>
        </div>
      </section>

      <section className="relative z-20 -mt-6 px-4 space-y-4">
        {/* Kartu TP */}
        <Link
          href="/student/submissions"
          className="group block rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:border-primary/20 hover:shadow-md border border-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-info/10 transition group-hover:bg-info">
                <FileUp className="h-7 w-7 text-info transition group-hover:text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-grey-900">
                  Tugas Pendahuluan
                </h2>
                <p className="font-secondary text-xs text-grey-500 mt-1">
                  Unggah file laporan TP.
                </p>
              </div>
            </div>
            <ChevronRight className="text-grey-300 transition-transform group-hover:translate-x-1 group-hover:text-info" />
          </div>
        </Link>

        {/* Kartu TA */}
        <Link
          href="/student/exam-attempts"
          className="group block rounded-3xl bg-white p-6 shadow-sm transition-all duration-300 hover:border-warning/20 hover:shadow-md border border-transparent"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-warning/10 transition group-hover:bg-warning">
                <PenTool className="h-7 w-7 text-warning transition group-hover:text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-grey-900">
                  Tes Awal (TA)
                </h2>
                <p className="font-secondary text-xs text-grey-500 mt-1">
                  Kerjakan kuis saat praktikum.
                </p>
              </div>
            </div>
            <ChevronRight className="text-grey-300 transition-transform group-hover:translate-x-1 group-hover:text-warning" />
          </div>
        </Link>
      </section>

      <PublicBottomNavigation />
    </main>
  );
}
