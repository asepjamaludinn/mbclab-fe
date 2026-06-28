"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  FileText,
  UploadCloud,
} from "lucide-react";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { usePublicModules } from "@/features/public-home";
import { useMySubmissions } from "../hooks/use-student-submissions";

export function StudentSubmissionsFeature() {
  const { data: modules = [], isLoading: isLoadingModules } =
    usePublicModules();
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useMySubmissions();

  const isLoading = isLoadingModules || isLoadingSubmissions;

  const combinedModules = modules.map((module) => {
    const submission = submissions.find((sub) => sub.moduleId === module.id);
    return {
      ...module,
      status: submission ? "Sudah dikumpulkan" : "Belum dikumpulkan",
      isSubmitted: !!submission,
    };
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <section className="px-5 pt-6">
        <Link
          href="/student/assessment"
          className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 font-secondary text-xs font-bold text-primary shadow-sm backdrop-blur-xl transition hover:bg-primary hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>

        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Tugas Pendahuluan
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          Pilih Modul TP
        </h1>

        <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-grey-500">
          Pilih modul praktikum yang ingin dikumpulkan dalam format PDF.
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
              Upload TP
            </p>

            <h2 className="mt-3 max-w-[285px] text-[28px] font-extrabold leading-[1.08] tracking-tight text-grey-900">
              Kumpulkan laporan TP sesuai modul
            </h2>

            <p className="mt-4 max-w-[290px] font-secondary text-sm leading-relaxed text-grey-600">
              Pastikan file sudah sesuai format dan ukuran sebelum dikirim ke
              sistem.
            </p>

            <div className="mt-6 flex items-center gap-2 rounded-2xl border border-primary/10 bg-primary/10 px-4 py-3 text-primary">
              <UploadCloud className="h-4 w-4 shrink-0" />
              <p className="font-secondary text-xs font-semibold">
                Format file yang diterima hanya PDF.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 space-y-4 px-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 w-full animate-pulse rounded-[30px] bg-white/60"
              />
            ))}
          </div>
        ) : combinedModules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-5 text-center shadow-sm">
            <p className="font-secondary text-sm font-semibold text-grey-500">
              Belum ada modul yang aktif.
            </p>
          </div>
        ) : (
          combinedModules.map((module) => (
            <Link
              key={module.id}
              href={`/student/submissions/${module.id}`}
              className="group block"
            >
              <article className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white">
                <div
                  className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl ${module.isSubmitted ? "bg-success/10" : "bg-info/10"}`}
                />

                <div className="relative z-10 flex items-center justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-white shadow-lg ${module.isSubmitted ? "bg-success shadow-success/20" : "bg-info shadow-info/20"}`}
                    >
                      <FileText className="h-7 w-7" strokeWidth={1.7} />
                    </div>

                    <div className="min-w-0">
                      <p
                        className={`font-secondary text-[10px] font-bold uppercase tracking-[0.18em] ${module.isSubmitted ? "text-success" : "text-info"}`}
                      >
                        PDF Submission
                      </p>

                      <h2 className="mt-1 text-base font-extrabold text-grey-900">
                        {module.title}
                      </h2>

                      <p className="mt-1 truncate font-secondary text-xs leading-relaxed text-grey-500">
                        {module.description}
                      </p>

                      <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 font-secondary text-[11px] font-semibold ${module.isSubmitted ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}
                      >
                        {module.status}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-grey-50 text-grey-400 transition ${module.isSubmitted ? "group-hover:bg-success" : "group-hover:bg-info"} group-hover:text-white`}
                  >
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </article>
            </Link>
          ))
        )}
      </section>

      <StudentBottomNavigation />
    </main>
  );
}
