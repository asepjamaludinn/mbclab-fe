"use client";

import { BookOpen } from "lucide-react";
import {
  usePublicModules,
  PublicBottomNavigation,
  publicBottomNavItems,
} from "@/features/public-home";
import { Card } from "@/shared/components/ui/card";
import { ModulesHero } from "./ModulesHero";
import { ModuleCard } from "./ModuleCard";

export function PublicModulesFeature() {
  const { data: modules = [], isLoading, isError } = usePublicModules();

  return (
    <main className="min-h-screen bg-grey-50 pb-28">
      <ModulesHero />

      <section className="relative z-20 -mt-8 space-y-4 px-4">
        <Card className="flex items-center justify-between p-4">
          <div>
            <h2 className="text-lg font-bold text-grey-900">Daftar Modul</h2>
            <p className="font-secondary text-xs text-grey-700">
              Materi praktikum untuk praktikan.
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 font-secondary text-[11px] font-bold text-primary">
            {modules.length} Modul
          </span>
        </Card>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-[32px] border border-grey-200 bg-white"
              />
            ))}
          </div>
        ) : isError ? (
          <Card className="border-error/20 bg-error/10 p-5 text-center">
            <h3 className="text-base font-bold text-error">
              Modul gagal dimuat
            </h3>
            <p className="mt-2 font-secondary text-sm text-grey-700">
              Silakan coba beberapa saat lagi.
            </p>
          </Card>
        ) : modules.length === 0 ? (
          <Card className="p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-bold text-grey-900">
              Modul belum tersedia
            </h3>
            <p className="mt-2 font-secondary text-sm leading-relaxed text-grey-700">
              Daftar modul akan tampil setelah dipublikasikan oleh asisten.
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
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
