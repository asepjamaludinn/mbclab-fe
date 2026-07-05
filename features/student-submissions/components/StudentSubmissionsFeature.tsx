"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, FileText } from "lucide-react";
import { useStudentModules } from "@/features/student-modules";
import { useMySubmissions } from "../hooks/use-student-submissions";

export function StudentSubmissionsFeature() {
  const { data: modulesRes, isLoading: isLoadingModules } = useStudentModules();
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useMySubmissions();

  const isLoading = isLoadingModules || isLoadingSubmissions;
  const modules = modulesRes?.data || [];

  const combinedModules = modules.map((module) => {
    const submission = submissions.find((sub) => sub.moduleId === module.id);
    return {
      ...module,
      status: submission ? "Sudah dikumpulkan" : "Belum dikumpulkan",
      isSubmitted: !!submission,
    };
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-10 font-primary selection:bg-primary/20">
      <div className="pointer-events-none absolute -right-20 top-8 h-60 w-60 rounded-full bg-white/15 blur-[75px]" />
      <div className="pointer-events-none absolute -left-24 top-52 h-64 w-64 rounded-full bg-white/10 blur-[80px]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_34%)]" />

      <div className="relative z-10">
        <section className="px-5 pt-8 text-white">
          <Link
            href="/student/assessment"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-md transition hover:bg-white/20 active:scale-[0.96]"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Link>

          <h1 className="text-[32px] font-extrabold tracking-tight drop-shadow-sm">
            Tugas Pendahuluan
          </h1>

          <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-white/85">
            Pilih modul praktikum di bawah ini untuk mengunggah file. Pastikan
            format file adalah <strong>PDF</strong>.
          </p>
        </section>

        <section className="mt-8 space-y-4 px-5">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-28 w-full animate-pulse rounded-[30px] bg-white/40 backdrop-blur-xl"
                />
              ))}
            </div>
          ) : combinedModules.length === 0 ? (
            <div className="rounded-[30px] border border-white/50 bg-white/40 p-6 text-center shadow-sm backdrop-blur-xl">
              <p className="font-secondary text-sm font-semibold text-slate-600">
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
                <article className="relative overflow-hidden rounded-[30px] border border-white/60 bg-white/60 p-5 shadow-[0_16px_45px_-28px_rgba(0,101,176,0.15)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:bg-white/80 active:scale-[0.98]">
                  <div
                    className={`pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-2xl ${
                      module.isSubmitted ? "bg-success/20" : "bg-info/20"
                    }`}
                  />

                  <div className="relative z-10 flex items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-4">
                      <div
                        className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] text-white shadow-md ${
                          module.isSubmitted
                            ? "bg-success shadow-success/20"
                            : "bg-info shadow-info/20"
                        }`}
                      >
                        <FileText className="h-7 w-7" strokeWidth={1.8} />
                      </div>

                      <div className="min-w-0">
                        <h2 className="text-[17px] font-extrabold tracking-tight text-slate-900">
                          {module.title}
                        </h2>

                        {module.tpDeadline && !module.isSubmitted && (
                          <p className="mt-0.5 font-secondary text-[11px] font-medium text-slate-500">
                            Batas:{" "}
                            {new Date(module.tpDeadline).toLocaleString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}{" "}
                            WIB
                          </p>
                        )}

                        <div className="mt-2 flex items-center">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-secondary text-[11px] font-bold ${
                              module.isSubmitted
                                ? "bg-success/15 text-success-700"
                                : "bg-warning/15 text-warning-700"
                            }`}
                          >
                            {module.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                        module.isSubmitted
                          ? "bg-success/10 text-success group-hover:bg-success group-hover:text-white"
                          : "bg-info/10 text-info group-hover:bg-info group-hover:text-white"
                      }`}
                    >
                      <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </article>
              </Link>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
