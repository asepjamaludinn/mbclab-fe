"use client";

import Image from "next/image";
import {
  BookOpen,
  CalendarClock,
  Download,
  FileCheck2,
  LockKeyhole,
} from "lucide-react";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { useMySubmissions } from "@/features/student-submissions";
import { useStudentModules } from "../hooks/use-student-modules";

const FALLBACK_MODULE_COVERS = [
  "/images/module-cover-1.jpg",
  "/images/module-cover-2.jpg",
  "/images/module-cover-3.jpg",
  "/images/module-cover-4.jpg",
];

function getModuleCoverUrl(index: number) {
  return FALLBACK_MODULE_COVERS[index % FALLBACK_MODULE_COVERS.length];
}

function formatDeadline(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function StudentModulesFeature() {
  const { data: modulesRes, isLoading: isLoadingModules } = useStudentModules();
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useMySubmissions();

  const isLoading = isLoadingModules || isLoadingSubmissions;
  const modules = modulesRes?.data || [];

  const combinedModules = modules.map((module) => {
    const submission = submissions.find((sub) => sub.moduleId === module.id);

    return {
      ...module,
      isTpSubmitted: !!submission,
    };
  });

  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <section className="px-5 pt-8">
        <div className="mb-6">
          <h1 className="max-w-[280px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
            Modul
            <br />
            Praktikum
          </h1>

          <p className="mt-4 max-w-[300px] font-secondary text-sm leading-relaxed text-white/75">
            Akses materi, unduh modul resmi, dan cek status TP praktikum kamu.
          </p>
        </div>

        <div className="flex rounded-full border border-white/25 bg-white/15 p-1 shadow-sm backdrop-blur-xl">
          <button className="flex flex-1 items-center justify-center gap-1 rounded-full bg-white px-4 py-3 font-secondary text-xs font-bold text-primary shadow-sm">
            Tersedia
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] text-white">
              {combinedModules.length}
            </span>
          </button>

          <button className="flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold text-white/80">
            TP
          </button>

          <button className="flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold text-white/80">
            Selesai
          </button>
        </div>
      </section>

      <section className="px-5 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-white">
            Daftar Modul
          </h2>

          <span className="rounded-full border border-white/70 bg-white/75 px-3 py-1 font-secondary text-[10px] font-bold text-primary shadow-sm backdrop-blur-xl">
            {combinedModules.length} Modul
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[242px] animate-pulse rounded-[30px] bg-white/70 shadow-sm backdrop-blur-xl"
              />
            ))}
          </div>
        ) : combinedModules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 text-center shadow-[0_18px_45px_-34px_rgba(0,101,176,0.45)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>

            <h3 className="text-base font-extrabold text-grey-900">
              Modul belum tersedia
            </h3>

            <p className="mx-auto mt-2 max-w-xs font-secondary text-sm leading-relaxed text-grey-500">
              Modul akan tampil setelah dipublikasikan oleh asisten.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {combinedModules.map((module, index) => {
              const canDownload = module.isActive && !!module.fileUrl;
              const coverUrl = getModuleCoverUrl(index);

              return (
                <article
                  key={module.id}
                  className="group relative h-[242px] overflow-hidden rounded-[30px] bg-grey-900 shadow-[0_22px_60px_-34px_rgba(0,101,176,0.55)]"
                >
                  <Image
                    src={coverUrl}
                    alt={module.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 480px) 100vw, 420px"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/30 to-black/85" />

                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                        Modul {module.order || index + 1}
                      </span>

                      <h3 className="mt-3 line-clamp-2 max-w-[260px] text-2xl font-extrabold leading-[1.04] tracking-tight text-white">
                        {module.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 max-w-[280px] font-secondary text-xs leading-relaxed text-white/70">
                        {module.description ||
                          "Deskripsi modul belum tersedia."}
                      </p>
                    </div>

                    {!module.isActive && (
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white shadow-sm backdrop-blur-xl">
                        <LockKeyhole className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="mb-3 flex flex-wrap gap-2">
                      {module.tpDeadline && (
                        <div className="flex max-w-full items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-white shadow-sm backdrop-blur-xl">
                          <CalendarClock className="h-3.5 w-3.5 shrink-0 text-warning" />

                          <span className="truncate font-secondary text-[10px] font-semibold text-white/85">
                            Deadline TP: {formatDeadline(module.tpDeadline)}
                          </span>
                        </div>
                      )}

                      {module.isTpSubmitted && (
                        <div className="flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-white shadow-sm backdrop-blur-xl">
                          <FileCheck2 className="h-3.5 w-3.5 text-success" />

                          <span className="font-secondary text-[10px] font-semibold text-white/85">
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
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
                      >
                        <Download className="h-4 w-4" />
                        Download Modul
                      </a>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl">
                        <LockKeyhole className="h-4 w-4" />
                        Belum Dibuka
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <StudentBottomNavigation />
    </main>
  );
}
