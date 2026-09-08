"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen, Search } from "lucide-react";
import {
  usePublicModules,
  PublicBottomNavigation,
  publicBottomNavItems,
} from "@/features/public-home";
import { ModuleCard } from "./ModuleCard";

function PublicModulesContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const initialFilter = searchParams.get("filter") || "all";

  const { data: modules = [], isLoading, isError } = usePublicModules();

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState(initialFilter);

  const filteredModules = modules.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.description || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "active"
          ? m.isActive
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

        <div className="flex flex-col gap-3">
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
              onClick={() => setActiveFilter("archived")}
              className={`flex flex-1 items-center justify-center rounded-full px-4 py-3 font-secondary text-xs font-semibold transition ${
                activeFilter === "archived"
                  ? "bg-white text-primary shadow-sm font-bold"
                  : "text-white/80"
              }`}
            >
              Selesai
            </button>
          </div>
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
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="aspect-[4/5] w-full animate-pulse rounded-[30px] bg-white/70 shadow-sm backdrop-blur-xl"
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
          <div className="grid grid-cols-1 gap-6">
            {filteredModules.map((module, index) => {
              const order = (module as any).order ?? index + 1;

              return (
                <ModuleCard
                  key={module.id}
                  module={module as any}
                  index={order - 1}
                />
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

export function PublicModulesFeature() {
  return (
    <main className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#0065b0_0%,#1e3f75_30%,#eaf6ff_58%,#ffffff_86%)] pb-28 font-primary selection:bg-primary/20">
      <Suspense
        fallback={
          <div className="px-5 pt-16 text-center font-secondary text-white">
            Memuat...
          </div>
        }
      >
        <PublicModulesContent />
      </Suspense>
      <PublicBottomNavigation items={publicBottomNavItems} />
    </main>
  );
}
