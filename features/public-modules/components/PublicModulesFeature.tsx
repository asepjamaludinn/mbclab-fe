"use client";

import { BookOpen } from "lucide-react";
import {
  usePublicModules,
  PublicBottomNavigation,
  publicBottomNavItems,
} from "@/features/public-home";
import { ModulesHero } from "./ModulesHero";
import { ModuleCard } from "./ModuleCard";

export function PublicModulesFeature() {
  const { data: modules = [], isLoading, isError } = usePublicModules();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,101,176,0.16),transparent_32%),radial-gradient(circle_at_top_right,rgba(30,63,117,0.1),transparent_30%),linear-gradient(180deg,#f8f9fa_0%,#edf6ff_42%,#f8f9fa_100%)] pb-28">
      <ModulesHero totalModules={modules.length} />

      <section className="mt-6 px-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold tracking-tight text-grey-900">
            Daftar Modul
          </h2>

          <span className="rounded-full border border-white/70 bg-white/60 px-3 py-1 font-secondary text-[10px] font-bold text-primary shadow-sm backdrop-blur-xl">
            {modules.length} Modul
          </span>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-[230px] animate-pulse rounded-[34px] bg-white/70 shadow-sm"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-[34px] border border-error/10 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[22px] bg-error/10 text-error">
              <BookOpen className="h-7 w-7" />
            </div>

            <h3 className="text-base font-extrabold text-error">
              Modul gagal dimuat
            </h3>

            <p className="mt-2 font-secondary text-sm leading-relaxed text-grey-500">
              Silakan coba beberapa saat lagi.
            </p>
          </div>
        ) : modules.length === 0 ? (
          <div className="rounded-[34px] border border-white/70 bg-white/75 p-6 text-center shadow-sm backdrop-blur-xl">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-[24px] bg-primary/10 text-primary">
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
            {modules.map((module, index) => (
              <ModuleCard key={module.id} module={module} index={index} />
            ))}
          </div>
        )}
      </section>

      <PublicBottomNavigation items={publicBottomNavItems} />
    </main>
  );
}
