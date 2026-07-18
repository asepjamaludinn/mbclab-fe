"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  BookOpen,
  CalendarClock,
  CheckCircle2,
  Download,
  LockKeyhole,
  Search,
} from "lucide-react";
import { StudentBottomNavigation } from "@/features/student-navigation";
import { useMySubmissions } from "@/features/student-submissions";
import { useStudentModules } from "../hooks/use-student-modules";
import { useProfile } from "@/features/auth";

const FALLBACK_MODULE_COVERS = [
  "/images/module-cover-1.jpg",
  "/images/module-cover-2.jpg",
  "/images/module-cover-3.jpg",
  "/images/module-cover-4.jpg",
];

function StudentModulesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "all";

  const { data: userProfile } = useProfile("STUDENT");
  const isInter = userProfile?.isInternational === true;

  const {
    data: modulesRes,
    isLoading: isLoadingModules,
    isError,
  } = useStudentModules();
  const { data: submissions = [], isLoading: isLoadingSubmissions } =
    useMySubmissions();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const isLoading = isLoadingModules || isLoadingSubmissions;
  const modules = modulesRes?.data || [];

  const combinedModules = modules.map((module) => {
    const submission = submissions.find((sub) => sub.moduleId === module.id);
    return {
      ...module,
      isTpSubmitted: !!submission,
    };
  });

  const filteredModules = combinedModules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
          ? m.isActive
          : activeFilter === "submitted"
            ? m.isTpSubmitted
            : !m.isActive;

    return matchesSearch && matchesFilter;
  });

  return (
    <>
      <section className="px-5 pt-8">
        <div className="mb-6">
          <h1 className="max-w-[280px] text-[42px] font-extrabold leading-[1.02] tracking-[-0.04em] text-white">
            Modul
            <br />
            Praktikum
          </h1>
          <p className="mt-4 max-w-[300px] font-secondary text-sm leading-relaxed text-white/75">
            Pilih dan akses materi praktikum MBC Laboratory.
          </p>
        </div>

        <div className="mb-5 flex h-11 items-center gap-3 rounded-full border border-white/25 bg-white/15 px-4 text-white shadow-sm backdrop-blur-xl focus-within:border-white/50 focus-within:bg-white/25">
          <Search
            className="h-[18px] w-[18px] text-white/80"
            strokeWidth={1.8}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari modul..."
            className="w-full bg-transparent font-secondary text-xs font-medium text-white placeholder:text-white/75 focus:outline-none"
          />
        </div>

        <div className="flex rounded-full border border-white/25 bg-white/15 p-1 shadow-sm backdrop-blur-xl">
          <button
            onClick={() => setActiveFilter("all")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${
              activeFilter === "all"
                ? "bg-white text-primary shadow-sm font-bold"
                : "text-white/80"
            }`}
          >
            Semua
            <span
              className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                activeFilter === "all"
                  ? "bg-primary text-white"
                  : "bg-white/20 text-white"
              }`}
            >
              {modules.length}
            </span>
          </button>

          <button
            onClick={() => setActiveFilter("active")}
            className={`flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${
              activeFilter === "active"
                ? "bg-white text-primary shadow-sm font-bold"
                : "text-white/80"
            }`}
          >
            Tersedia
          </button>

          <button
            onClick={() => setActiveFilter("submitted")}
            className={`flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${
              activeFilter === "submitted"
                ? "bg-white text-primary shadow-sm font-bold"
                : "text-white/80"
            }`}
          >
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
            {filteredModules.length} Modul
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[214px] animate-pulse rounded-[30px] bg-white/70 shadow-sm backdrop-blur-xl"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 text-center shadow-[0_18px_45px_-34px_rgba(0,101,176,0.45)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error/10 text-error">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-error">
              Modul gagal dimuat
            </h3>
            <p className="mt-2 font-secondary text-sm leading-relaxed text-grey-500">
              Silakan coba beberapa saat lagi.
            </p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="rounded-[30px] border border-white/70 bg-white/80 p-6 text-center shadow-[0_18px_45px_-34px_rgba(0,101,176,0.45)] backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BookOpen className="h-8 w-8" />
            </div>
            <h3 className="text-base font-extrabold text-grey-900">
              Modul tidak ditemukan
            </h3>
            <p className="mx-auto mt-2 max-w-xs font-secondary text-sm leading-relaxed text-grey-500">
              Coba sesuaikan kata kunci pencarian atau filter Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredModules.map((module, index) => {
              const fileUrl = isInter
                ? module.fileUrlInternational
                : module.fileUrlRegular;
              const canDownload = module.isActive && !!fileUrl;
              const coverUrl =
                FALLBACK_MODULE_COVERS[index % FALLBACK_MODULE_COVERS.length];

              return (
                <article
                  key={module.id}
                  className="group relative h-[214px] overflow-hidden rounded-[30px] bg-grey-900 shadow-[0_22px_60px_-34px_rgba(0,101,176,0.55)]"
                >
                  <Image
                    src={coverUrl}
                    alt={module.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 480px) 100vw, 420px"
                  />

                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/80" />

                  <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1 font-secondary text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xl">
                        Modul {module.order}
                      </span>

                      <h3 className="mt-3 line-clamp-2 max-w-[240px] text-2xl font-extrabold leading-[1.04] tracking-tight text-white">
                        {module.title}
                      </h3>

                      {module.tpDeadline && (
                        <div className="mt-2 flex items-center gap-1.5 text-white/90">
                          <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                          <span className="font-secondary text-[10px] font-medium">
                            Batas TP:{" "}
                            {new Date(module.tpDeadline).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {module.isTpSubmitted && (
                      <div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-success text-white shadow-sm backdrop-blur-xl"
                        aria-label="TP Selesai Dikumpulkan"
                      >
                        <CheckCircle2 className="h-5 w-5" strokeWidth={2} />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    {canDownload ? (
                      <a
                        href={fileUrl!}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3 font-secondary text-xs font-bold text-primary shadow-sm transition hover:bg-primary hover:text-white"
                      >
                        <Download className="h-4 w-4" /> Download Modul
                      </a>
                    ) : (
                      <div className="flex w-full items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-5 py-3 font-secondary text-xs font-bold text-white shadow-sm backdrop-blur-xl">
                        <LockKeyhole className="h-4 w-4" /> Belum Dibuka
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export function StudentModulesFeature() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <Suspense
        fallback={
          <div className="px-5 pt-16 text-center font-secondary text-white">
            Memuat...
          </div>
        }
      >
        <StudentModulesContent />
      </Suspense>
      <StudentBottomNavigation />
    </main>
  );
}
