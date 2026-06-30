"use client";

import Link from "next/link";
import { ArrowRight, ClipboardCheck, FileUp, PenTool } from "lucide-react";
import { useProfile } from "@/features/auth";
import { StudentBottomNavigation } from "@/features/student-navigation";

export function StudentAssessmentFeature() {
  const { isLoading } = useProfile("STUDENT");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.16),transparent_34%),linear-gradient(180deg,#f8f9fa_0%,#eef6ff_45%,#f8f9fa_100%)] pb-28">
        <section className="px-5 pt-6">
          <div className="h-3 w-24 animate-pulse rounded-full bg-grey-200" />
          <div className="mt-3 h-8 w-44 animate-pulse rounded-xl bg-grey-200" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-full bg-grey-200" />
        </section>

        <section className="mt-6 space-y-4 px-5">
          <div className="h-52 animate-pulse rounded-[38px] bg-white/70" />
          <div className="h-28 animate-pulse rounded-[30px] bg-white/70" />
          <div className="h-28 animate-pulse rounded-[30px] bg-white/70" />
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <section className="px-5 pt-6">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Assessment Praktikum
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          Pilih Jenis Evaluasi
        </h1>

        <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-grey-500">
          Akses pengumpulan Tugas Pendahuluan dan Tes Awal sesuai jadwal
          praktikum yang tersedia.
        </p>
      </section>

      <section className="mt-5 px-5">
        <div className="relative overflow-hidden rounded-[38px] border border-white/70 bg-white/45 px-5 pb-5 pt-5 text-grey-900 shadow-[0_24px_70px_-32px_rgba(0,101,176,0.45)] backdrop-blur-2xl">
          <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-primary/20 blur-[70px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-secondary/15 blur-[80px]" />
          <div className="pointer-events-none absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-white/60 blur-[60px]" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/80 via-white/35 to-primary/10" />

          <div className="relative z-10">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/70 text-primary shadow-sm backdrop-blur-xl">
              <ClipboardCheck className="h-7 w-7" strokeWidth={1.8} />
            </div>

            <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.2em] text-primary/70">
              TP & TA
            </p>

            <h2 className="mt-3 max-w-[285px] text-[28px] font-extrabold leading-[1.08] tracking-tight text-grey-900">
              Kelola assessment praktikum
            </h2>

            <p className="mt-4 max-w-[290px] font-secondary text-sm leading-relaxed text-grey-600">
              Pastikan tugas dan jawaban sudah sesuai sebelum dikumpulkan ke
              sistem.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-4 px-5">
        <Link href="/student/submissions" className="group block">
          <article className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-info/10 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-info text-white shadow-lg shadow-info/20">
                  <FileUp className="h-7 w-7" strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-info">
                    Upload PDF
                  </p>

                  <h2 className="mt-1 text-base font-extrabold text-grey-900">
                    Tugas Pendahuluan
                  </h2>

                  <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
                    Unggah laporan TP sesuai modul praktikum.
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-info group-hover:text-white">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </article>
        </Link>

        <Link href="/student/exam-attempts" className="group block">
          <article className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-warning/10 blur-2xl" />

            <div className="relative z-10 flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] bg-warning text-white shadow-lg shadow-warning/20">
                  <PenTool className="h-7 w-7" strokeWidth={1.7} />
                </div>

                <div className="min-w-0">
                  <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-warning">
                    Quiz Session
                  </p>

                  <h2 className="mt-1 text-base font-extrabold text-grey-900">
                    Tes Awal (TA)
                  </h2>

                  <p className="mt-1 font-secondary text-xs leading-relaxed text-grey-500">
                    Kerjakan kuis saat sesi praktikum dibuka.
                  </p>
                </div>
              </div>

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition group-hover:bg-warning group-hover:text-white">
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>
          </article>
        </Link>
      </section>

      <StudentBottomNavigation />
    </main>
  );
}
