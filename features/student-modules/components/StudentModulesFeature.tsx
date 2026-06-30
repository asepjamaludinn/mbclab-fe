"use client";

import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CalendarClock,
  Download,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { useMySubmissions } from "@/features/student-submissions";
import { useStudentModules } from "../hooks/use-student-modules";

export function StudentModulesFeature() {
  const { data: modulesRes, isLoading: isLoadingModules } = useStudentModules();
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useMySubmissions();

  const isLoading = isLoadingModules || isLoadingSubmissions;
  const modules = modulesRes?.data || [];

  // Cross-reference data: Cek apakah modul ini sudah disubmit TP-nya
  const combinedModules = modules.map((module) => {
    const submission = submissions.find((sub) => sub.moduleId === module.id);
    return {
      ...module,
      isTpSubmitted: !!submission,
    };
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.18),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.12),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <section className="px-5 pt-6">
        <p className="font-secondary text-[11px] font-bold uppercase tracking-[0.18em] text-primary/70">
          Materi Pembelajaran
        </p>

        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-grey-900">
          Modul Praktikum
        </h1>

        <p className="mt-2 max-w-sm font-secondary text-sm leading-relaxed text-grey-500">
          Akses materi dan unduh modul resmi praktikum Anda di sini.
        </p>
      </section>

      <section className="mt-6 space-y-4 px-5">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 w-full animate-pulse rounded-[30px] bg-white/60"
              />
            ))}
          </div>
        ) : combinedModules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-5 text-center shadow-sm">
            <p className="font-secondary text-sm font-semibold text-grey-500">
              Belum ada modul yang tersedia.
            </p>
          </div>
        ) : (
          combinedModules.map((module) => {
            const canDownload = module.isActive && module.fileUrl;

            return (
              <article
                key={module.id}
                className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-5 shadow-[0_16px_45px_-28px_rgba(0,0,0,0.35)] backdrop-blur-xl transition hover:bg-white"
              >
                <div className="relative z-10 flex gap-4">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-[22px] shadow-lg ${module.isActive ? "bg-primary text-white shadow-primary/20" : "bg-grey-200 text-grey-400 shadow-none"}`}
                  >
                    <BookOpen className="h-7 w-7" strokeWidth={1.7} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-secondary text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
                          Modul {module.order}
                        </p>
                        <h2 className="mt-1 text-base font-extrabold leading-snug text-grey-900">
                          {module.title}
                        </h2>
                      </div>

                      {!module.isActive && (
                        <span className="shrink-0 rounded-full bg-grey-200 px-3 py-1 font-secondary text-[10px] font-bold text-grey-600">
                          Terkunci
                        </span>
                      )}
                    </div>

                    <p className="mt-1 line-clamp-2 font-secondary text-xs leading-relaxed text-grey-500">
                      {module.description || "Deskripsi modul belum tersedia."}
                    </p>

                    <div className="mt-4 space-y-2">
                      {module.tpDeadline && (
                        <div className="flex items-center gap-2 text-warning">
                          <CalendarClock className="h-4 w-4 shrink-0" />
                          <span className="font-secondary text-[11px] font-semibold">
                            Deadline TP:{" "}
                            {new Date(module.tpDeadline).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}

                      {module.isTpSubmitted && (
                        <div className="flex items-center gap-2 text-success">
                          <FileCheck2 className="h-4 w-4 shrink-0" />
                          <span className="font-secondary text-[11px] font-semibold">
                            TP Sudah Dikumpulkan
                          </span>
                        </div>
                      )}
                    </div>

                    {canDownload ? (
                      <a
                        href={module.fileUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-5 py-2.5 font-secondary text-xs font-bold text-primary transition hover:bg-primary hover:text-white"
                      >
                        <Download className="h-4 w-4" /> Download Modul
                      </a>
                    ) : (
                      <div className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-grey-100 px-5 py-2.5 font-secondary text-xs font-bold text-grey-500">
                        <LockKeyhole className="h-4 w-4" /> Belum Dibuka
                      </div>
                    )}
                  </div>
                </div>
              </article>
            );
          })
        )}
      </section>

      <StudentBottomNavigation />
    </main>
  );
}
