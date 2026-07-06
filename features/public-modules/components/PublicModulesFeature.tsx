"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BookOpen } from "lucide-react";
import {
  usePublicModules,
  PublicBottomNavigation,
  publicBottomNavItems,
} from "@/features/public-home";
import { ModulesHero } from "./ModulesHero";
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
      <ModulesHero
        totalModules={modules.length}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

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
            {filteredModules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
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
          <div className="px-5 pt-16 text-center text-white">Memuat...</div>
        }
      >
        <PublicModulesContent />
      </Suspense>
      <PublicBottomNavigation items={publicBottomNavItems} />
    </main>
  );
}
