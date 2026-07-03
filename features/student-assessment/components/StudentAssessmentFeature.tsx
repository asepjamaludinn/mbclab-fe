"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  FileUp,
  PenTool,
  ShieldCheck,
} from "lucide-react";
import { useProfile } from "@/features/auth";
import { StudentBottomNavigation } from "@/features/student-navigation";

export function StudentAssessmentFeature() {
  const { isLoading } = useProfile("STUDENT");

  const itemClassName =
    "group flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-all duration-300 hover:bg-white/10 active:scale-[0.98]";

  const iconClassName =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white shadow-[0_10px_24px_-14px_rgba(0,101,176,0.9)] backdrop-blur-xl transition-transform duration-300 group-hover:scale-110";

  if (isLoading) {
    return (
      <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
        <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
        <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />

        <section className="relative z-10 px-5 pt-8">
          <div className="h-3 w-24 animate-pulse rounded-full bg-white/25" />
          <div className="mt-3 h-8 w-52 animate-pulse rounded-2xl bg-white/25" />
          <div className="mt-3 h-4 w-64 animate-pulse rounded-full bg-white/20" />
        </section>

        <section className="relative z-10 mt-8 space-y-4 px-5">
          <div className="h-44 animate-pulse rounded-[32px] bg-white/15 shadow-sm backdrop-blur-2xl" />
          <div className="mt-8 h-72 animate-pulse rounded-[32px] bg-white/40 shadow-sm backdrop-blur-2xl" />
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
        {/* Header */}
        <section className="px-5 pt-8 text-white">
          <div className="mb-6">
            <h1 className="mt-1 max-w-[280px] text-[34px] font-extrabold leading-[1.05] tracking-tight shadow-black/5 drop-shadow-sm">
              Pilih Jenis
              <br />
              Evaluasi
            </h1>

            <p className="mt-4 max-w-[310px] font-secondary text-sm leading-relaxed text-white/85">
              Akses pengumpulan Tugas Pendahuluan dan Tes Awal sesuai jadwal
              praktikum yang tersedia.
            </p>
          </div>
        </section>

        {/* Menu list */}
        <section className="mt-8 space-y-5 px-5">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Menu Assessment
              </h2>
              <span className="font-secondary text-[11px] font-bold text-white/80">
                2 Menu
              </span>
            </div>

            <div className="overflow-hidden rounded-[32px] border border-white/25 bg-white/15 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.55),inset_0_1px_0_rgba(255,255,255,0.4)] backdrop-blur-2xl">
              <Link href="/student/submissions" className={itemClassName}>
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`${iconClassName} border border-white/30 bg-info/80`}
                  >
                    <FileUp className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-[15px] font-extrabold text-white">
                      Tugas Pendahuluan
                    </h3>
                    <p className="mt-1 font-secondary text-xs text-white/70">
                      Unggah laporan TP sesuai modul
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors group-hover:bg-info/20">
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-info-light" />
                </div>
              </Link>

              <div className="mx-5 h-px bg-white/15" />

              <Link href="/student/exam-attempts" className={itemClassName}>
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className={`${iconClassName} border border-white/30 bg-warning/80`}
                  >
                    <PenTool className="h-5 w-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="text-[15px] font-extrabold text-white">
                      Tes Awal (TA)
                    </h3>
                    <p className="mt-1 font-secondary text-xs text-white/70">
                      Kerjakan kuis saat sesi dibuka
                    </p>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-colors group-hover:bg-warning/20">
                  <ArrowRight className="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-x-0.5 group-hover:text-warning-light" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Panduan & Aturan Section */}
        <section className="mt-8 space-y-4 px-5">
          <div className="mb-4 flex items-center justify-between">
            {/* Judul tetap putih dengan sedikit drop-shadow agar menonjol dari bg cerah */}
            <h2 className="text-xl font-extrabold tracking-tight text-white drop-shadow-md">
              Panduan Penting
            </h2>
          </div>

          <div className="rounded-[32px] border border-white/50 bg-white/40 p-6 shadow-[0_24px_60px_-38px_rgba(0,101,176,0.15)] backdrop-blur-xl">
            <ul className="space-y-6">
              {/* Aturan 1: Waktu TA */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-slate-700 shadow-sm">
                  <Clock className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Durasi Tes Awal
                  </h4>
                  <p className="mt-1.5 font-secondary text-[13px] leading-relaxed text-slate-600">
                    Waktu pengerjaan TA adalah 15 menit. Ujian akan otomatis
                    ter-submit jika waktu habis.
                  </p>
                </div>
              </li>

              {/* Aturan 2: Anti-Cheat */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fdecd5] text-orange-700 shadow-sm">
                  <AlertTriangle className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Sistem Anti-Curang
                  </h4>
                  <p className="mt-1.5 font-secondary text-[13px] leading-relaxed text-slate-600">
                    Sesi ujian akan <strong>terblokir otomatis</strong> jika
                    Anda keluar dari halaman atau berpindah tab.
                  </p>
                </div>
              </li>

              {/* Aturan 3: Tenggat TP */}
              <li className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-blue-700 shadow-sm">
                  <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">
                    Pengumpulan TP
                  </h4>
                  <p className="mt-1.5 font-secondary text-[13px] leading-relaxed text-slate-600">
                    Pastikan TP diunggah dalam format PDF sesuai dengan tenggat
                    waktu modul yang berlaku.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <StudentBottomNavigation />
    </main>
  );
}
